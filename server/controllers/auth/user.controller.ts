require('dotenv').config();
import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/ErrorHandler";
import { sendApiResponse } from "../../utils/apiresponse";
import * as authService from "../../services/auth/auth.service"
import { verifyAuthorization } from "../../middleware/auth";


// Controller function for user login
interface ILoginBody {
    identifier: string;
    password: string;
}

export const login = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier, password }: ILoginBody = req.body;
        const result = await authService.login(identifier, password);
        sendApiResponse(res, { status: true, data: result, message: "Login successful" });
    } catch (e: any) {
        next(e)
        //next(new ErrorHandler(e.message, 401));
    }
});


//Controller function for user logout
export const logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        res.clearCookie('accessToken');
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Logout successful"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500))
    }
};


// Controller function for forgot password
export const forgotPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;
        const result = await authService.forgotPassword(email);
        sendApiResponse(res, { status: true, data: result, message: "New password sent to email" });
    } catch (e: any) {
        next(new ErrorHandler(e.message, 400));
    }
});


// Controller function for password reset
interface IResetBody {
    currentPassword: string;
    newPassword: string;
}

export const resetPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const { currentPassword, newPassword }:IResetBody = req.body;
        await authService.resetPassword(user?._id, currentPassword, newPassword);
        sendApiResponse(res, { status: true, data: {}, message: "Password reset successful" });
    } catch (e: any) {
        next(new ErrorHandler(e.message, 400));
    }
});