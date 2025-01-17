import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import userModel, { IUSer, UserRole, UserStatus } from "../../../models/user.model";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import ErrorHandler from "../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../utils/apiresponse";
import sendMail from "../../../utils/sendMail";
import { generateRandomPassword } from "../../../utils/randpassword";
import { verifyAuthorization, verifyLamiAuthorization, verifyPlugoAuthorization } from "../../../middleware/auth";
import { createCourierByAdminService, deleteCourierByAdminService, getCourierCreateByAdmin, updateCourierCreatedByAdmin } from "../../../services/helper/user/courier.service";
import { IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface";
import { ClientPlanUsage } from "../../../models/subscriptions/subscription.model";

require('dotenv').config();


// Create LaMi Courier user
// interface IRegistrationBody {
//     name: string;
//     email?: string;
//     role: string;
//     mobile?: number;
//     address?: string;
//     company: string;
//     status?: string;
//     language: string;
//     designation: string;
//     state: string;
//     country: string;
//     zipcode: number;
//     plugoAdminId: string;
//     lamiAdminId?: string;
//     clientAdminId?: string;
//     depoAdminId?: string;
// }

export const createCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        if (!user) {
            return next(new ErrorHandler("User not authorized", 401));
        }

        const body: IRegistrationBody = req.body;

        if (body.email) {
            const isEmailExists = await userModel.findOne({ email: body.email });
            if (isEmailExists) {
                return next(new ErrorHandler("email_duplicate", 400));
            }
        }

        if (body.mobile) {
            const isPhoneExists = await userModel.findOne({ mobile: body.mobile });
            if (isPhoneExists) {
                return next(new ErrorHandler("phone_duplicate", 400));
            }
        }

        const password = generateRandomPassword();

        const newLamiAdminData: Partial<IUSer> = {
            name: body.name,
            password,
            role: UserRole.LAMI_COURIER,
            mobile: body.mobile,
            address: body.address,
            company: user?.company,
            status: body.status as UserStatus,
            language: user?.language,
            designation: body.designation,
            state: body.state,
            country: body.country,
            zipcode: body.zipcode,
            plugoAdminId: user.plugoAdminId,
            clientAdminId: user.clientAdminId,
            depoAdminId: user.depoAdminId,
            lamiAdminId: user?._id,
            ...(body.email ? { email: body.email } : {}),
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
        const resultObject = newLamiAdmin.toObject();
        // delete resultObject.password;

        try {
            const mailData = {
                newUser: resultObject,
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

            sendApiResponse(res, {
                status: true,
                data: {},
                message: "lamicourier_created_successfully",
            });
        } catch (e: any) {
            return next(new ErrorHandler(e.message, 500));
        }
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});




// get LaMi Courier user
export const getCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        if (!user) {
            return next(new ErrorHandler("User not authorized", 401));
        }
        const users = await userModel.find({ lamiAdminId: user._id })
            .populate({
                path: 'company',
                select: 'companyName'
            })
            .select('-password -language -role -lamiAdminId -createdAt -updatedAt -__v')
            .limit(100)
            .lean()
            .sort({ createdAt: -1 });

        const usersWithCompanyName = users.map((user: any) => ({
            ...user,
            company: user.company?.companyName || ''
        }));

        sendApiResponse(res, {
            status: true,
            data: usersWithCompanyName,
            message: "user data fetched"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
})


// Update LaMi Courier user

interface IUpdateLamiCourierBody extends Partial<IRegistrationBody> {
    lamiCourierid: string;
    status?: 'active' | 'inactive';
}

export const updateLamiCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        if (!user) {
            return next(new ErrorHandler("User not authorized", 401));
        }
        const { name, email, mobile, address, status, designation, language }: IUpdateLamiCourierBody = req.body;
        const { lamiCourierid }: IUpdateLamiCourierBody = req.query as any;

        const LamiCourier = await userModel.findById(lamiCourierid);
        const isPhoneExists = await userModel.find({ _id: { $ne: lamiCourierid }, mobile: mobile })

        if (isPhoneExists.length !== 0) {
            return next(new ErrorHandler("phone_duplicate", 400));
        }

        if (!LamiCourier) {
            return next(new ErrorHandler("User not found", 404));
        }
        if (user._id.toString() !== LamiCourier?.lamiAdminId?.toString()) {
            return next(new ErrorHandler('Unauthorized', 400));
        }

        const updateFields: Partial<IUpdateLamiCourierBody> = {};
        if (name) updateFields.name = name;
        if (email) updateFields.email = email;
        if (mobile) updateFields.mobile = mobile;
        if (address) updateFields.address = address;
        if (status) updateFields.status = status as UserStatus;
        if (designation) updateFields.designation = designation;

        Object.assign(LamiCourier, updateFields);
        await LamiCourier.save();


        sendApiResponse(res, {
            status: true,
            data: {},
            message: "lami_updated_successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
})


// Delete LaMi Courier user
interface IDeleteLamiCourierBody {
    lamiCourierid: string;
}
export const deleteLamiCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        if (!user) {
            return next(new ErrorHandler("User not authorized", 401));
        }
        const { lamiCourierid }: IDeleteLamiCourierBody = req.query as any;
        const LamiCourier = await userModel.findById(lamiCourierid);
        if (!LamiCourier) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user._id.toString() !== (LamiCourier?.lamiAdminId?.toString())) {
            return next(new ErrorHandler('Unauthorized - Cannot delete another user\'s courier', 400));
        }

        await userModel.findByIdAndDelete(lamiCourierid);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "User deleted successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
})



// generate LaMi Courier user password
interface IGeneratePassword {
    courierid: string;
}
export const generateNewPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        if (!user) {
            return next(new ErrorHandler("User not authorized", 401));
        }

        const { courierid }: IGeneratePassword = req.query as any;
        const LamiCourier = await userModel.findById(courierid);
        if (!LamiCourier) {
            return next(new ErrorHandler("User not found", 404));
        }

        if (user._id.toString() !== (LamiCourier?.lamiAdminId?.toString())) {
            return next(new ErrorHandler('Unauthorized - Cannot generate a password for another user\'s courier', 400));
        }

        // Generate a new password
        const newPassword = generateRandomPassword();

        LamiCourier.password = newPassword;
        await LamiCourier.save();

        // Send the new password to the user's email
        await sendMail({
            email: user.email,
            subject: "New Password",
            template: "new_generate_password.ejs",
            data: { newPassword },
            cc: [],
            bcc: []
        });

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "New password generated and sent successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
})


export const createCourierByAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        if (!pluggoUser) {
            throw new ErrorHandler("Unauthorized access", 401);
        }

        const { name, email, mobile, address, language, designation, state, country, zipcode }: IRegistrationBody = req.body;
        const lamiId: string = req.query.lamiId as string;

        const newCourier = await createCourierByAdminService(pluggoUser?._id, lamiId, req.body);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Courier created successfully",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const getCourierByAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const clientId: string = req.query.clientId as string;
        const depoAdminId: string = req.query.depoAdminId as string;
        const lamiId: string = req.query.lamiId as string;

        const newCourier = await getCourierCreateByAdmin(user, clientId, depoAdminId, lamiId);

        sendApiResponse(res, {
            status: true,
            data: newCourier,
            message: "Courier_fetched",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const updateCourierByAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const { name, address, designation, status }: IUpdateUserBody = req.body;
        const courierId: string = req.query.courierId as string;
        const lamiId: string | undefined = req.query.lamiId as string | undefined;
        const clientAdmin = await updateCourierCreatedByAdmin(req.body, courierId, lamiId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "courier_updated",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const deleteCourierByAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const courierId: string = req.query.courierId as string;
        const user = await deleteCourierByAdminService(courierId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "courier_deleted",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});