import mongoose from "mongoose";
import userModel, { IUSer, UserRole, UserStatus } from "../../../models/user.model";
import { sendApiResponse } from "../../../utils/apiresponse";
import ErrorHandler from "../../../utils/ErrorHandler";
import { IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface";
import { generateRandomPassword } from "../../../utils/randpassword";
import sendMail from "../../../utils/sendMail";
import { ClientPlanUsage } from "../../../models/subscriptions/subscription.model";

export const createCourierByAdminService = async (userId: string, lamiId: string, body: IRegistrationBody): Promise<any> => {
    try {
        if (body.email) {
            const isEmailExists = await userModel.findOne({ email: body.email });
            if (isEmailExists) {
                throw new ErrorHandler("Email already exists", 400);
            }
        }

        if (body.mobile) {
            const isPhoneExists = await userModel.findOne({ mobile: body.mobile });
            if (isPhoneExists) {
                throw new ErrorHandler("Mobile number already exists", 400);
            }
        }

        const user = await userModel.findOne({ _id: lamiId });
        if (!user) {
            throw new ErrorHandler("Lami Admin not found", 404);
        }

        const password = generateRandomPassword();
        const newLamiAdminData: Partial<IUSer> = {
            name: body.name,
            password,
            role: UserRole.LAMI_COURIER,
            mobile: body.mobile,
            address: body.address,
            company: user.company,
            language: user.language,
            designation: body.designation,
            state: body.state,
            country: body.country,
            zipcode: body.zipcode,
            plugoAdminId: user.plugoAdminId,
            clientAdminId: user.clientAdminId,
            depoAdminId: user.depoAdminId,
            lamiAdminId: user._id,
            ...(body.email ? { email: body.email } : {})
        };

        const newLamiAdmin = await userModel.create(newLamiAdminData);

        // Find the client's active plan
        const activePlan = await ClientPlanUsage.findOne({ clientId: user.clientAdminId });
        if (!activePlan) {
            throw new ErrorHandler("Active plan not found for the client", 404);
        }

        // Decrement the userLimit
        activePlan.availableCount -= 1;
        await activePlan.save();

        // Prepare email data
        const mailData = {
            newUser: newLamiAdmin.toObject(),
            UserId: body.email ? `User Id: ${body.email}` : `Mobile Number: ${body.mobile}`,
            Password: `Password: ${password}`,
            language: user.language,
        };

        const recipientEmail = body.email || user.email;
        const ccEmails = body.email ? [user.email] : [];
        const bccEmails = body.email ? [user.email] : [];

        // Send the email
        await sendMail({
            email: recipientEmail,
            subject: "Account credentials",
            template: "mailcredentials.ejs",
            data: mailData,
            cc: [],
            bcc: []
        });

        return newLamiAdmin;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};


export const getCourierCreateByAdmin = async (user: any, clientId?: string, depoAdminId?: string, lamiId?: string): Promise<any> => {
    try {
        
        const query: any = {
            role: UserRole.LAMI_COURIER,
        };

        switch (user.role) {
            case UserRole.PLUGO_ADMIN:
                query.plugoAdminId = user._id;
                break;
            case UserRole.CLIENT_ADMIN:
                query.clientAdminId = user._id;
                break;
            case UserRole.DEPO_ADMIN:
                query.depoAdminId = user._id;
        }

        if (clientId) {
            query.clientAdminId = clientId;
        }

        if (depoAdminId) {
            query.depoAdminId = depoAdminId;
        }

        if (lamiId) {
            query.lamiAdminId = lamiId;
        }

        const lamiUsers = await userModel
            .find(query)
            .sort({ updatedAt: -1 })
            .populate('plugoAdminId', 'name')
            .populate('clientAdminId', 'name')
            .populate('depoAdminId', 'name')
            .populate('lamiAdminId', 'name')
            .populate('company', 'companyName');

        return lamiUsers;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};

export const updateCourierCreatedByAdmin = async (updateData: IUpdateUserBody, courierId: string, lamiId?: string): Promise<any> => {
    try {
        const { company, ...fields } = updateData;
        const user = await userModel.findById(courierId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        // if (updateData.mobile) {
        //     const isPhoneExists = await userModel.findOne({ _id: { $ne: depoAdminId }, mobile: updateData.mobile });
        //     if (isPhoneExists) {
        //         throw new ErrorHandler("Phone duplicate", 400);
        //     }
        // }

        if (updateData.name) user.name = updateData.name;
        //if (updateData.mobile) user.mobile = updateData.mobile;
        if (updateData.address) user.address = updateData.address;
        if (updateData.status) user.status = updateData.status as UserStatus;
        if (updateData.designation) user.designation = updateData.designation;

        if (lamiId) {
            user.lamiAdminId = new mongoose.Types.ObjectId(lamiId);
        }

        await user.save();

        return user;
    } catch (e) {
        throw e
    }
}


/* 
This is a service function which handles delete of courier's
*/
export const deleteCourierByAdminService = async (courierId: string): Promise<any> => {
    const updatedCourier = await userModel.findByIdAndUpdate(
        courierId,
        { status: UserStatus.INACTIVE },
        { new: true }
    );

    if (!updatedCourier) {
        throw new Error("courier not found or could not be updated");
    }
}