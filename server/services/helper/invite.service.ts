import Company from "../../models/company/company.model";
import { Invite } from "../../models/invite.model";
import userModel, { UserRole } from "../../models/user.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { IRegistrationBody } from "../../utils/interface/interface";
import sendMail, { EmailOptions } from "../../utils/sendMail";
import jwt from 'jsonwebtoken';

require('dotenv').config();

export const createInviteService = async (email: string, user: any, language: string): Promise<any> => {
    const appUrl = process.env.app_url;
    const invitationLink = `${appUrl}/service-provider-registration`;

    let role = UserRole.LAMI_ADMIN;
    if (user.role === UserRole.CLIENT_ADMIN) {
        role = UserRole.DEPO_ADMIN;
    }else if ( user.role === UserRole.DEPO_ADMIN){
        role = UserRole.LAMI_ADMIN;
    }

    const invite = new Invite({
        email,
        role,
        status: 'pending',
        invitedBy: user._id
    });

    await invite.save();

    const mailOptions: EmailOptions = {
        email,
        subject: 'You are Invited!',
        template: 'invite.ejs',
        data: {
            invitationLink,
            language: language,
        },
        attachments: [],
        cc: [],
        bcc: []
    };

    await sendMail(mailOptions);

    return invite;
}



export const sendOtpService = async (email: string): Promise<number> => {
    const otp = Math.floor(1000 + Math.random() * 9000);

    const invite = await Invite.findOne({ email });
    if (!invite) {
        throw new Error('No invitation found for this email address');
    }
    // Update or create invite with OTP
    await Invite.updateOne(
        { email },
        { $set: { otp } },
        { upsert: true }
    );

    const mailOptions = {
        email,
        subject: 'Your OTP Code',
        template: 'otpTemplate.ejs',
        data: { otp },
        attachments: [],
        cc: [],
        bcc: []
    };

    await sendMail(mailOptions);

    return otp;
};


export const resendInvitationService = async (emailId: string): Promise<any> => {
    // Check if the invitation already exists
    const invite = await Invite.findOne({ _id: emailId });
    if (!invite) {
        throw new Error('No invitation found for this email address');
    }

    const appUrl = process.env.APP_URL;
    const link = `${appUrl}/service-provider-registration`;
    invite.invitationDate = new Date();
    await invite.save();
    // Prepare email options
    const mailOptions = {
        email: invite.email,
        subject: 'You Are Invited to Join QAARO Platform',
        template: 'invite.ejs',
        data: { invitationLink: link },
        attachments: [],
        cc: [],
        bcc: []
    };

    // Send the invitation email
    await sendMail(mailOptions);

    return invite;
};


export const registationUserService = async (body: IRegistrationBody): Promise<any> => {
    const invite = await Invite.findOne({ email: body.email, otp: body.otp, status: "pending" });
    if (!invite) {
        throw new ErrorHandler("Invalid", 400);
    }

    let company = await Company.findOne({ companyName: body.company });
    let companyId: string;
    if (!company) {
        company = await Company.create({ companyName: body.company });
        companyId = company._id;
    } else {
        companyId = company._id;
    }

    const isEmailExists = await userModel.findOne({ email: body.email });
    const isPhoneExists = await userModel.findOne({ mobile: body.mobile });
    if (isEmailExists) {
        throw new ErrorHandler("email_duplicate", 400);
    }
    if (isPhoneExists) {
        throw new ErrorHandler("phone_duplicate", 400);
    }

    const inviter = await userModel.findById(invite.invitedBy);
    if (!inviter) {
        throw new ErrorHandler("Inviter not found", 404);
    }

    const newUser = {
        ...body,
        role: invite.role as UserRole,
        company: companyId,
    };

    if (inviter.role === UserRole.CLIENT_ADMIN) {
        newUser.plugoAdminId = inviter.plugoAdminId?.toString();
        newUser.clientAdminId = inviter._id.toString();
    } else if (inviter.role === UserRole.DEPO_ADMIN) {
        newUser.plugoAdminId = inviter.plugoAdminId?.toString();
        newUser.clientAdminId = inviter.clientAdminId?.toString();
        newUser.depoAdminId = inviter._id.toString();
    }

    const createdUser = new userModel(newUser);
    const result = await createdUser.save();
    const resultObject = result.toObject();
    const token = jwt.sign(resultObject, process.env.JWT_SECRET_KEY!);

    invite.status = "success";
    invite.registrationDate = new Date();
    await invite.save();

    try {
        await sendMail({
            email: body.email,
            subject: "Account credentials",
            template: "mailcredentials.ejs",
            data: {
                newUser: result,
                UserId: `User Id: ${body.email}`,
                Password: `Password: ${body.password}`,
                language: body.language,
            },
            cc: [],
            bcc: []
        });
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }

    return result;
};
