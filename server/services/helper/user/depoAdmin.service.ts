import Company from "../../../models/company/company.model";
import userModel, { UserRole, UserStatus } from "../../../models/user.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import { IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface"
import { generateRandomPassword } from "../../../utils/randpassword";
import jwt from 'jsonwebtoken';
import sendMail from "../../../utils/sendMail";
import mongoose from "mongoose";


/* 
This is a service function which handles creation of DepoAdmin's
*/
export const createDepoAdminService = async (body: IRegistrationBody, user: any, clientId?: string): Promise<any> => {
    try {
        // Check if email or phone already exists
        const isEmailExists = await userModel.findOne({ email: body.email });
        const isPhoneExists = await userModel.findOne({ mobile: body.mobile });

        if (isEmailExists) {
            throw new ErrorHandler("email_duplicate", 400);
        }
        if (isPhoneExists) {
            throw new ErrorHandler("phone_duplicate", 400);
        }

        let companyId;
        
        if (clientId) {
            // Fetch the client admin to get the company ID
            const clientAdmin = await userModel.findById(clientId);
            if (!clientAdmin) {
                throw new ErrorHandler("clientAdmin_not_found", 404);
            }
            companyId = clientAdmin.company;
        } else {
            companyId = user?.company;
        }

        // Generate a random password for the new depo admin
        const password = generateRandomPassword();

        // Create the new depo admin
        const newDepoAdminData: any = {
            ...body,
            password,
            role: 'Depo_Admin',
            company: companyId,
        };

        if (user.role === 'Plugo_Admin') {
            newDepoAdminData.plugoAdminId = user._id;
            newDepoAdminData.clientAdminId = clientId;
        } else if (user.role === 'Client_Admin') {
            newDepoAdminData.clientAdminId = user._id;
            newDepoAdminData.plugoAdminId = user.plugoAdminId;
        }

        const newDepoAdmin = new userModel(newDepoAdminData);
        const result = await newDepoAdmin.save();
        const resultObject = result.toObject();

        // Sign a JWT token for the new depo admin
        const token = jwt.sign(resultObject, process.env.JWT_SECRET_KEY!);

        // Send email with account credentials
        try {
            await sendMail({
                email: body.email,
                subject: "Account credentials",
                template: "mailcredentials.ejs",
                data: {
                    newUser: result,
                    UserId: `User Id: ${body.email}`,
                    Password: `Password: ${password}`,
                    language: result.language,
                },
                cc: [],
                bcc: []
            });
        } catch (e: any) {
            throw new ErrorHandler(e.message, 500);
        }

        return result;
    } catch (e) {
        throw e;
    }
};




/* 
This is a service function which handles getting of DepoAdmin's
*/
export const getDepoAdminService = async (user: any, clientAdminId?: string): Promise<any> => {
    try {
        let query: any = { role: 'Depo_Admin' };

        if (user.role === 'Plugo_Admin') {
            query.plugoAdminId = new mongoose.Types.ObjectId(user._id);
        } else if (user.role === 'Client_Admin') {
            query.clientAdminId = new mongoose.Types.ObjectId(user._id);
        }

        if (clientAdminId) {
            query.clientAdminId = new mongoose.Types.ObjectId(clientAdminId);
        }

        console.log("Query", query);

        const depoAdmins = await userModel.find(query)
            .sort({ updatedAt: -1 })
            .populate('clientAdminId', 'name')
            .populate('plugoAdminId', 'name')
            .populate({
                path: 'company',
                select: 'companyName'
            });

        return depoAdmins;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};

/* 
This is a service function which handles update of DepoAdmin's
*/
export const updateDepoAdminService = async (depoAdminId: string, updateData: IUpdateUserBody): Promise<any> => {
    try {
        const { company, ...fields } = updateData;
        const user = await userModel.findById(depoAdminId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        if (updateData.mobile) {
            const isPhoneExists = await userModel.findOne({ _id: { $ne: depoAdminId }, mobile: updateData.mobile });
            if (isPhoneExists) {
                throw new ErrorHandler("Phone duplicate", 400);
            }
        }

        if (updateData.name) user.name = updateData.name;
        if (updateData.mobile) user.mobile = updateData.mobile;
        if (updateData.address) user.address = updateData.address;
        if (updateData.status) user.status = updateData.status as UserStatus;
        if (updateData.designation) user.designation = updateData.designation;

        await user.save();

        if (updateData.status === UserStatus.INACTIVE) {
            await userModel.updateMany(
                { lamiAdminId: user._id, role: UserRole.CLIENT_ADMIN },
                { status: UserStatus.INACTIVE }
            );
        }

        return user;
    } catch (e) {
        throw e
    }
}


/* 
This is a service function which handles delete of DepoAdmin's
*/
export const deleteDepoAdminService = async (depoAdminId: string): Promise<any> => {
    const updatedClientAdmin = await userModel.findByIdAndUpdate(
        depoAdminId,
        { status: UserStatus.INACTIVE },
        { new: true }
    );

    if (!updatedClientAdmin) {
        throw new Error("depoAdmin not found or could not be updated");
    }
}