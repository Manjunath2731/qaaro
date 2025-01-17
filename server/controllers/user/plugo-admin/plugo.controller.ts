require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import userModel, { IUSer } from "../../../models/user.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import jwt from 'jsonwebtoken';
import sendMail from "../../../utils/sendMail";
import { generateRandomPassword } from "../../../utils/randpassword";
import { UserStatus } from "../../../models/user.model";
import { sendApiResponse } from "../../../utils/apiresponse";
import Company from "../../../models/company/company.model";
import { verifyAuthorization, verifyPlugoAuthorization } from "../../../middleware/auth";
import { createLamiUserService, deleteLamiService, getCourierService, getLamiUser, getLamiUserService, updateLamiAdmins, updateLamiService } from "../../../services/helper/lamiAdmin.service";
import { IDeleteUserBody, IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface";

//Controller function for creating Lami-User
export const createLami = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const clientId: string | undefined = req.query.clientId as string | undefined;
        const depoAdminId: string | undefined = req.query.depoAdminId as string | undefined;

        const { name, email, mobile, address, company: companyName,
            language, designation, state, country, zipcode }: IRegistrationBody = req.body;

        const lamiUserData = await createLamiUserService(req.body, user, clientId, depoAdminId);
        if (!lamiUserData) {
            return next(new ErrorHandler("Lami account not found", 404));
        }
        sendApiResponse(res, { status: true, data: {}, message: 'lami_created_successfully' });
    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};

export const dummy = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const userId = pluggoUser?._id;
        const clientId: string = req.query.clientId as string;
        const depoAdminId: string = req.query.depoAdminId as string;
        const lamiAdminId: string = req.query.lamiAdminId as string;

        const updatedUser = await updateLamiAdmins(userId, clientId, depoAdminId, lamiAdminId);

        if (!updatedUser) {
            return next(new ErrorHandler("User with role LaMi_Admin not found", 404));
        }

        sendApiResponse(res, {
            status: true,
            data: updatedUser,
            message: "User data updated successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for Get All Lami-Admin
export const getLami = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const lamiUserData = await getLamiUserService(pluggoUser);

        if (!lamiUserData) {
            return next(new ErrorHandler("Lami account data not found", 404));
        }
        sendApiResponse(res, { status: true, data: lamiUserData, message: 'user data fetched' });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
});


//Controller function for Get All Lami-Admin
export const getLamiAdmins = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const clientId: string | undefined = req.query.clientId as string | undefined;
        const depoAdminId: string | undefined = req.query.depoAdminId as string | undefined;
        const lamiUserData = await getLamiUser(user, clientId, depoAdminId);

        if (!lamiUserData) {
            return next(new ErrorHandler("Lami account data not found", 404));
        }
        sendApiResponse(res, { status: true, data: lamiUserData, message: 'user data fetched' });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const getCourierNew = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const userId = pluggoUser?._id;
        const clientId: string | undefined = req.query.clientId as string | undefined;
        const depoAdminId: string | undefined = req.query.depoAdminId as string | undefined;
        const lamiAdminId: string | undefined = req.query.lamiAdminId as string | undefined;

        const courierData = await getCourierService(userId, clientId, depoAdminId, lamiAdminId);

        if (!courierData) {
            return next(new ErrorHandler("Courier data not found", 404));
        }

        sendApiResponse(res, {
            status: true,
            data: courierData,
            message: "courier_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for Update Lami-Admin
export const updateLami = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const depoAdminId: string | undefined = req.query.depoAdminId as string | undefined;
        const { name, mobile, address, company: companyName, status, designation }: IUpdateUserBody = req.body;
        const { lamiAdminId }: IUpdateUserBody = req.query as any;
        const updateData: IUpdateUserBody = {
            lamiAdminId: req.query.lamiAdminId as string,
            ...req.body,
        };
        const result = await updateLamiService(updateData, depoAdminId);
        sendApiResponse(res, {
            status: true,
            data: result,
            message: "lami_updated_successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for Delete Lami-Admin
export const deleteLamiAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = await verifyAuthorization(req, next);
        const { lamiAdminId }: IDeleteUserBody = req.query as any;
        const result = await deleteLamiService(lamiAdminId);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "User deleted successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
});