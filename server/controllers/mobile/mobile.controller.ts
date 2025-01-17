import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../middleware/catchAsyncError";
import { sendApiResponse } from "../../utils/apiresponse";
import ErrorHandler from "../../utils/ErrorHandler";
import * as authService from "../../services/auth/auth.service"

require('dotenv').config();


interface ILoginBody {
    identifier: string;
    password: string;
}

export const mobilelogin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { identifier, password }: ILoginBody = req.body;
        const result = await authService.mobilelogin(identifier, password);
        sendApiResponse(res, { status: true, data: result, message: "Login successful" });
    } catch (e: any) {
        next(new ErrorHandler(e.message, 401));
    }
});