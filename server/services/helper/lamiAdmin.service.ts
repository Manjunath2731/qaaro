import Company from "../../models/company/company.model";
import userModel, { UserRole, UserStatus } from "../../models/user.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { IRegistrationBody, IUpdateUserBody } from "../../utils/interface/interface";
import { generateRandomPassword } from "../../utils/randpassword";
import jwt from 'jsonwebtoken';
import sendMail from "../../utils/sendMail";
import Ticket from "../../models/tickets/tickets.model";
import Language from "../../models/language.model";
import mongoose from 'mongoose';

// service function for creating lami user
export const createLamiUserService = async (body: IRegistrationBody, user: any, clientId?: string, depoAdminId?: string): Promise<any> => {
    try {

        let plugoAdminId, clientAdminId, depoAdminIdToUse;

        if (user.role === UserRole.PLUGO_ADMIN) {
            // If the Plugo_Admin is creating, use the IDs from req.query
            plugoAdminId = user._id;
            clientAdminId = clientId;
            depoAdminIdToUse = depoAdminId;
        } else if (user.role === UserRole.DEPO_ADMIN) {
            // If the Depo_Admin is creating, use the IDs from the user object
            plugoAdminId = user.plugoAdminId;
            clientAdminId = user.clientAdminId;
            depoAdminIdToUse = user._id;
        } else {
            throw new ErrorHandler("Unauthorized role", 403);
        }

        // Fetch the client admin to get the company ID
        const clientAdmin = await userModel.findById(clientAdminId);
        if (!clientAdmin) {
            throw new ErrorHandler("clientAdmin_not_found", 404);
        }

        const companyId = clientAdmin.company;

        const isEmailExists = await userModel.findOne({ email: body.email });
        const isPhoneExists = await userModel.findOne({ mobile: body.mobile })
        if (isEmailExists) {
            throw new ErrorHandler("email_duplicate", 400);
        }
        if (isPhoneExists) {
            throw new ErrorHandler("phone_duplicate", 400);
        }

        const password = generateRandomPassword();

        const newLamiAdmin = new userModel({
            ...body,
            password,
            role: UserRole.LAMI_ADMIN,
            company: companyId,
            plugoAdminId,
            clientAdminId,
            depoAdminId: depoAdminIdToUse
        });
        const result = await newLamiAdmin.save();
        const resultObject = result.toObject();
        const token = jwt.sign(resultObject, process.env.JWT_SECRET_KEY!);
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

// service function for get lami user
export const getLamiUserService = async (pluggoUser: any): Promise<any> => {

    const getStartOfToday = () => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    };

    const getEndOfToday = () => {
        const now = new Date();
        now.setHours(23, 59, 59, 999);
        return now;
    };
    try {
        const startOfToday = getStartOfToday();
        const endOfToday = getEndOfToday();
        const users = await userModel.find({ role: 'LaMi_Admin' })
            .populate({
                path: 'company',
                select: 'companyName'
            })
            .select('-password -language -role -plugoAdminId -createdAt -updatedAt -__v')
            .limit(100)
            .lean()
            .sort({ updatedAt: -1 });

        const usersWithCounts = await Promise.all(users.map(async (user: any) => {
            const [courierCountToday, totalCourierCount, ticketCountToday, totalTicketCount] = await Promise.all([
                userModel.countDocuments({
                    role: 'LaMi_Courier',
                    lamiAdminId: user._id,
                    createdAt: { $gte: startOfToday, $lte: endOfToday }
                }),
                userModel.countDocuments({
                    role: 'LaMi_Courier',
                    lamiAdminId: user._id
                }),
                Ticket.countDocuments({
                    lamiAdminId: user._id,
                    createdAt: { $gte: startOfToday, $lte: endOfToday }
                }),
                Ticket.countDocuments({
                    lamiAdminId: user._id
                })
            ]);

            return {
                ...user,
                company: user.company?.companyName || '',
                courierCountToday,
                totalCourierCount,
                ticketCountToday,
                totalTicketCount
            };
        }));

        return usersWithCounts;

    } catch (e) {
        throw e
    }
};

export const getLamiUser = async (
    user: any,
    clientId?: string,
    depoAdminId?: string
): Promise<any> => {
    try {
        const query: any = {
            role: UserRole.LAMI_ADMIN,
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

        console.log("query", query);

        const lamiUsers = await userModel
            .find(query)
            .sort({ updatedAt: -1 })
            .populate('plugoAdminId', 'name')
            .populate('clientAdminId', 'name')
            .populate('depoAdminId', 'name')
            .populate('company', 'companyName');

        return lamiUsers;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};


export const getCourierService = async (userId: string, clientId?: string, depoAdminId?: string, lamiAdminId?: string): Promise<any> => {
    try {
        const query: any = {
            plugoAdminId: userId,
            role: 'LaMi_Courier'
        };

        if (clientId) {
            query.clientAdminId = clientId;
        }

        if (depoAdminId) {
            query.depoAdminId = depoAdminId;
        }

        if (lamiAdminId) {
            query.lamiAdminId = lamiAdminId;
        }

        const couriers = await userModel.find(query);
        console.log(couriers);

        return couriers;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};


// service function for update lami user
export async function updateLamiService(updateData: IUpdateUserBody, depoAdminId?: string) {
    try {
        const { lamiAdminId, company, ...fields } = updateData;
        const user = await userModel.findById(lamiAdminId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        if (updateData.mobile) {
            const isPhoneExists = await userModel.findOne({ _id: { $ne: lamiAdminId }, mobile: updateData.mobile });
            if (isPhoneExists) {
                throw new ErrorHandler("Phone duplicate", 400);
            }
        }
        if (updateData.name) user.name = updateData.name;
        if (updateData.mobile) user.mobile = updateData.mobile;
        if (updateData.address) user.address = updateData.address;
        if (updateData.status) user.status = updateData.status as UserStatus;
        if (updateData.designation) user.designation = updateData.designation;

        if (depoAdminId) {
            user.depoAdminId = new mongoose.Types.ObjectId(depoAdminId);
        }

        await user.save();

        if (updateData.status === UserStatus.INACTIVE) {
            await userModel.updateMany(
                { lamiAdminId: user._id, role: UserRole.LAMI_COURIER },
                { status: UserStatus.INACTIVE }
            );
        }

        return user;
    } catch (e) {
        throw e;
    }
}



// service function for update lami user
export async function deleteLamiService(lamiAdminId: string) {
    try {
        const user = await userModel.findByIdAndUpdate(
            lamiAdminId,
            { status: UserStatus.INACTIVE },
            { new: true }
        );

        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
    } catch (e) {
        throw e
    }
};


export const updateLamiAdmins = async (userId: string, clientId: string, depoAdminId: string, lamiAdminId: string): Promise<any> => {
    try {
        // Convert string IDs to ObjectId
        const plugoAdminObjectId = new mongoose.Types.ObjectId(userId);
        const clientAdminObjectId = new mongoose.Types.ObjectId(clientId);
        const depoAdminObjectId = new mongoose.Types.ObjectId(depoAdminId);
        const lamiAdminObjectId = new mongoose.Types.ObjectId(lamiAdminId);

        // Find users with the role LaMi_Courier and lamiAdminId
        const users = await userModel.find({
            role: 'LaMi_Courier',
            lamiAdminId: lamiAdminObjectId,
        });

        if (users.length === 0) {
            throw new ErrorHandler("Users with role LaMi_Courier not found", 404);
        }

        // Update the found users
        const updatedUsers = await userModel.updateMany(
            {
                _id: { $in: users.map(user => user._id) }
            },
            {
                $set: {
                    plugoAdminId: plugoAdminObjectId,
                    clientAdminId: clientAdminObjectId,
                    depoAdminId: depoAdminObjectId,
                },
            }
        );

        return updatedUsers;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};
