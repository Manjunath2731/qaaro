import mongoose from "mongoose";
import { ILamiAccount, LamiAccountModel } from "../../models/LamiAccount.model";
import { uploadToS3 } from "../../utils/s3Utils";

export const createLamiAccount = async (userId: string, emailSignature: string, emailTemplateHtml: string, emailServer: any, connected: boolean): Promise<ILamiAccount> => {
    try {
        // Convert userId to ObjectId
        const lamiId = new mongoose.Types.ObjectId(userId);

        // Prepare Lami account data
        const lamiAccountData: Partial<ILamiAccount> = {
            lamiId,
            emailServer,
            emailTemplate: emailTemplateHtml,
            connected: connected
        };

        // Upload email signature to S3 (if provided)
        if (emailSignature) {
            const emailSignatureBuffer = Buffer.from(emailSignature, 'base64');
            const emailSignatureUrl = await uploadToS3(emailSignatureBuffer, `${userId}_emailSignature.jpg`, 'emailSignatures', userId);
            lamiAccountData.emailSignatureUrl = emailSignatureUrl;
        }
        
        // Create new Lami account
        const newLamiAccount = await LamiAccountModel.create(lamiAccountData);
        
        return newLamiAccount;
    } catch (error) {
        throw new Error("Failed to create Lami account");
    }
};


export const getLamiAccountDetails = async (userId: string | undefined): Promise<ILamiAccount | null> => {
    try {
        if (!userId) {
            return null;
        }

        // Fetch Lami account details from the database based on user ID
        const lamiAccount = await LamiAccountModel.findOne({ lamiId: userId });

        return lamiAccount;
    } catch (error) {
        throw new Error('Failed to fetch Lami account details');
    }
};


export const updateLamiAccountDetails = async (userId: string, emailServer: any, emailSignature: string, emailTemplateHtml: string, connected: boolean): Promise<ILamiAccount | null> => {
    try {
        const lamiAccount = await LamiAccountModel.findOne({ lamiId: userId });
        if (!lamiAccount) {
            return null;
        }

        // Update Lami account details
        lamiAccount.emailServer = emailServer;
        lamiAccount.emailTemplate = emailTemplateHtml;
        lamiAccount.connected = connected;

        // Upload new email signature to S3 and update URL
        const emailSignatureBuffer = Buffer.from(emailSignature, 'base64');
        const emailSignatureUrl = await uploadToS3(emailSignatureBuffer, `${userId}_emailSignature.jpg`, 'emailSignatures', userId);
        lamiAccount.emailSignatureUrl = emailSignatureUrl;

        // Save the updated Lami account
        await lamiAccount.save();

        return lamiAccount;
    } catch (error) {
        throw new Error('Failed to update Lami account details');
    }
};