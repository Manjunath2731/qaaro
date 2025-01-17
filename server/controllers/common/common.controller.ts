require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import userModel, { IUSer, UserRole, UserStatus } from "../../models/user.model";
import ErrorHandler from "../../utils/ErrorHandler";
import jwt from 'jsonwebtoken';
import { sendApiResponse } from "../../utils/apiresponse";
import { deleteFromS3, uploadToS3 } from "../../utils/s3Utils";
import { LamiAccountModel } from "../../models/LamiAccount.model";
import { v4 as uuidv4 } from 'uuid';
import { ClientPlanUsage } from "../../models/subscriptions/subscription.model";


//Get Logged in User Data
export const getUserData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return next(new ErrorHandler('Unauthorized', 401));
        }
        const tokenString = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_KEY!) as { id: string };
        const user = await userModel.findById(decodedToken.id)
            .select('-createdAt -updatedAt -__v -plugoAdminId')
            .populate({
                path: 'company',
                select: 'companyName'
            });

        if (!user) {
            return next(new ErrorHandler("Invalid Token", 400));
        }

        const lamiAccount = await LamiAccountModel.findOne({ lamiId: user._id }).select('connected');

        let currentDate = new Date();
        let subscription;
        if (user.role === UserRole.LAMI_ADMIN) {
             subscription = await ClientPlanUsage.findOne({
                clientId: user.clientAdminId,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
            })
        }

        const userData = {
            ...user.toObject(),
            availableUser: subscription?.availableCount ? subscription?.availableCount : null,
            connected: lamiAccount ? lamiAccount.connected : null
        };

        sendApiResponse(res, {
            status: true,
            data: userData,
            message: "Profile data fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 400))
    }
})

interface IUpdateUserDataBody {
    name?: string;
    email?: string;
    mobile?: number;
    address?: string;
    company?: string;
    status?: 'active' | 'inactive';
    language?: string;
    designation?: string;
    avatar?: string;
    zipcode?: number;
    state?: string;
    country?: string;
}



export const updateUserData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return next(new ErrorHandler('Unauthorized', 401));
        }
        const tokenString = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_KEY!) as { id: string };

        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }

        const { name, email, mobile, address, company, status, language, designation, zipcode, state, country }: IUpdateUserDataBody = req.body;

        const isPhoneExists = await userModel.find({ _id: { $ne: user._id }, mobile: mobile });
        if (isPhoneExists.length !== 0) {
            return next(new ErrorHandler("phone_duplicate", 400));
        }

        if (req.file) {
            // if (user.avatar && user.avatar.url) {
            //     await deleteFromS3(user.avatar.url);
            // }

            const avatarBuffer = req.file.buffer;
            const uniqueFileName = `${user._id}_${uuidv4()}.png`;
            const avatarUrl = await uploadToS3(avatarBuffer, uniqueFileName, 'avatars');
            user.avatar = { publicId: '', url: avatarUrl };
        }

        switch (user.role) {
            case 'LaMi_Admin':
                updateAdminFields(user, { name, email, mobile, address, company, status, language, designation, zipcode, state, country });
                break;
            case 'LaMi_Courier':
                updateCourierFields(user, { name, mobile, address, company, status, language, designation, zipcode, state, country });
                break;
            default:
                return next(new ErrorHandler('Invalid user role', 400));
        }

        await user.save();

        sendApiResponse(res, {
            status: true,
            data: user,
            message: "User data updated successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

function updateAdminFields(user: IUSer, fields: Partial<IUpdateUserDataBody>): void {
    const { name, email, mobile, address, status, designation, language, state, zipcode, country } = fields;
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (status) user.status = status as UserStatus;
    if (designation) user.designation = designation;
    if (language) user.language = language;
    if (state) user.state = state;
    if (zipcode) user.zipcode = zipcode;
    if (country) user.country = country;
}

function updateCourierFields(user: IUSer, fields: Partial<IUpdateUserDataBody>): void {
    const { name, mobile, address, status, designation, state, zipcode, country } = fields;
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (status) user.status = status as UserStatus;
    if (designation) user.designation = designation;
    if (state) user.state = state;
    if (zipcode) user.zipcode = zipcode;
    if (country) user.country = country;
}