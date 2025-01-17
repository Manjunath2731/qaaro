import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import { sendApiResponse } from "../../../utils/apiresponse";
import ErrorHandler from "../../../utils/ErrorHandler";
import { verifyAuthorization } from "../../../middleware/auth";
import { createLamiAccount, getLamiAccountDetails, updateLamiAccountDetails } from "../../../services/helper/lamiAccount.service";

// Controller function for adding Lami account details
export const addAccountData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyAuthorization(req, next);
        // const userId = lamiUser?._id;
        const userId: string = req.query.userId as string;
        
        // Extract required fields from request body
        const { user, password, host, port } = req.body.emailServer;
        const { emailSignature, emailTemplateHtml, connected} = req.body;

        // Create Lami account
        const lamiAccount = await createLamiAccount(userId, emailSignature, emailTemplateHtml, { user, password, host, port }, connected);
        
        // Send success response
        sendApiResponse(res, { status: true, data: lamiAccount, message: "Lami account created successfully" });
    } catch (e:any) {
        next(new ErrorHandler(e.message, 500));
    }
});


// Controller function for fetching Lami account details
export const getAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const User = await verifyAuthorization(req, next);
        const userId: string = req.query.userId as string;
        console.log("userId", userId);
        
        const lamiAccount = await getLamiAccountDetails(userId);
        if (!lamiAccount) {
            return next(new ErrorHandler("Account not found", 404));
        }
        sendApiResponse(res, { status: true, data: lamiAccount, message: 'Lami account details retrieved successfully' });
    } catch (e:any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};


// Controller function for updating Lami account details
export const updateLamiAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyAuthorization(req, next);
        const userId: string = req.query.userId as string;
        
        const { emailServer, emailSignature, emailTemplateHtml, connected } = req.body;

        const updatedLamiAccount = await updateLamiAccountDetails(userId, emailServer, emailSignature, emailTemplateHtml, connected);
        if (!updatedLamiAccount) {
            return next(new ErrorHandler("Lami account not found", 404));
        }
        sendApiResponse(res, { status: true, data: updatedLamiAccount, message: 'Lami account updated successfully' });
    } catch (e:any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};