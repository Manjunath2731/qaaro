import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import { verifyAuthorization, verifyPlugoAuthorization } from "../../../middleware/auth";
import { createInviteService, registationUserService, resendInvitationService, sendOtpService } from "../../../services/helper/invite.service";
import { sendApiResponse } from "../../../utils/apiresponse";
import ErrorHandler from "../../../utils/ErrorHandler";
import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { Invite } from "../../../models/invite.model";
import { IRegistrationBody } from "../../../utils/interface/interface";
import userModel from "../../../models/user.model";

export const inviteByEmail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const emails: string = req.body.emails as string;
        const language: string = req.body.language as string;
        if (!emails) {
            return res.status(400).json({ message: 'Emails are required' });
        }

        const emailArray = emails.split(',').map((email: string) => email.trim());
        if (emailArray.length === 0) {
            return res.status(400).json({ message: 'No valid emails provided' });
        }

        const invitePromises = emailArray.map(async (email: string) => {
            // Check if the email already exists

            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return null; // Skip if email already invited
            }
            const existingInvite = await Invite.findOne({ email });
            if (existingInvite) {
                return null; // Skip if email already invited
            }
            return createInviteService(email, user, language);
        });
        const invites = await Promise.all(invitePromises);

        sendApiResponse(res, {
            status: true,
            data: invites,
            message: "Email_sent_successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const inviteByExcelEmail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const file = req.file;
        const language: string = req.body.language as string;
        if (!file) {
            console.log("No file uploaded");
            return res.status(400).json({ message: 'Excel file is required' });
        }

        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const emailData = xlsx.utils.sheet_to_json<{ email: string }>(worksheet);
        const emails = emailData.map(data => data.email).filter(Boolean);

        if (emails.length === 0) {
            console.log("No valid emails found");
            return res.status(400).json({ message: 'No valid emails found in Excel file' });
        }

        const invitePromises = emails.map(async (email) => {
            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return null; // Skip if email already invited
            }
            const existingInvite = await Invite.findOne({ email });
            if (existingInvite) {
                return null; // Skip if email already invited
            }
            return createInviteService(email, user, language);
        });
        const invites = await Promise.all(invitePromises);
        sendApiResponse(res, {
            status: true,
            data: invites,
            message: "Email_sent_successfully"
        });
    } catch (e: any) {
        console.error("Error:", e.message);
        return next(new ErrorHandler(e.message, 500));
    }
});

export const generateOtp = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email as string;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const otp = await sendOtpService(email);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "OTP sent successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const registation = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        // const userId: string = req.query.userId as string;
        const { name, email, mobile, address, company: companyName, status,
            language, designation, state, country, zipcode, otp, password }: IRegistrationBody = req.body;

        const userData = await registationUserService(req.body);
        if (!userData) {
            return next(new ErrorHandler("User Not created", 404));
        }
        sendApiResponse(res, { status: true, data: {}, message: 'user_created_successfully' });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const getInvitation = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const invitelist = await Invite.find({ invitedBy: user?._id });
        sendApiResponse(res, {
            status: true,
            data: { invitelist },
            message: "invite_list"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const resendInvitation = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const emailId: string = req.query.emailId as string;
        const invite = await resendInvitationService(emailId);
        sendApiResponse(res, {
            status: true,
            data: invite,
            message: "Email_sent_successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});