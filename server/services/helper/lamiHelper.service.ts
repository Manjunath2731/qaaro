// lami.service.ts

import jwt from 'jsonwebtoken';
import userModel, { IUSer, UserStatus } from "../../models/user.model";
import ErrorHandler from "../../utils/ErrorHandler";
import sendMail from "../../utils/sendMail";
import { generateRandomPassword } from "../../utils/randpassword";
import { NextFunction } from 'express';
import { CatchAsyncError } from '../../middleware/catchAsyncError';
import TicketDriver from '../../models/tickets/ticketdriver.model';
import Ticket, { ITicket } from '../../models/tickets/tickets.model';
import mongoose from 'mongoose';
import TicketAudit from '../../models/tickets/ticketsaudit.model';
import LocoEmailModel from '../../models/locoEmail.model';

interface IRegistrationBody {
    name: string;
    email: string;
    mobile?: number;
    address?: string;
    company: string;
    status: string;
    language: string;
    designation: string;
    state: string;
    country: string;
    zipcode: number;
}

export const createLamiCourier = CatchAsyncError(async (decodedTokenId: string, requestData: IRegistrationBody, next: NextFunction): Promise<string> => {
    const user = await userModel.findById(decodedTokenId);

    if (!user || user.role !== 'LaMi_Admin') {
        throw new ErrorHandler('Unauthorized', 400);
    }

    const { name, email, mobile, address, status, designation, state, country, zipcode } = requestData;

    const isEmailExists = await userModel.findOne({ email });
    const isPhoneExists = await userModel.findOne({ mobile });

    if (isEmailExists) {
        throw new ErrorHandler("email_duplicate", 400);
    }

    if (isPhoneExists) {
        throw new ErrorHandler("phone_duplicate", 400);
    }

    const password = generateRandomPassword();

    const newLamiCourier: IUSer = new userModel({
        name, email, password, role: 'LaMi_Courier', mobile, address, company: user.company,
        status, language: user.language, designation, state, country, zipcode,
        lamiAdminId: user._id,
    });

    const result = await newLamiCourier.save();
    const resultObject = result.toObject();
    delete resultObject.password;

    const token = jwt.sign(resultObject, process.env.JWT_SECRET_KEY!);

    try {
        await sendMail({
            email: newLamiCourier.email,
            subject: "Account credentials",
            template: "mailcredentials.ejs",
            data: {
                newUser: newLamiCourier.toObject(),
                Credentials: `Email: ${email}\n Password: ${password}`
            },
            cc: [],
            bcc: []
        });

        return token;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
});

export const getLamiCourier = async (decodedTokenId: string) => {
    const user = await userModel.findById(decodedTokenId);

    if (!user || user.role !== 'LaMi_Admin') {
        throw new ErrorHandler('Unauthorized', 400);
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

    return usersWithCompanyName;
};

interface IUpdateLamiCourierBody extends Partial<IRegistrationBody> {
    lamiCourierid: string;
    status?: 'active' | 'inactive';
}

export const updateLamiCourier = async (decodedTokenId: string, reqBody: IUpdateLamiCourierBody) => {
    const { name, email, mobile, address, status, designation, language, lamiCourierid } = reqBody;

    const LamiUser = await userModel.findById(decodedTokenId);
    if (!LamiUser || LamiUser.role !== 'LaMi_Admin') {
        throw new ErrorHandler('Unauthorized', 400);
    }

    const LamiCourier = await userModel.findById(lamiCourierid);
    if (!LamiCourier) {
        throw new ErrorHandler("User not found", 404);
    }

    if (LamiUser._id.toString() !== LamiCourier?.lamiAdminId?.toString()) {
        throw new ErrorHandler('Unauthorized', 400);
    }

    const updateFields: Partial<IUpdateLamiCourierBody> = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (mobile) updateFields.mobile = mobile;
    if (address) updateFields.address = address;
    if (status) updateFields.status = status as UserStatus;
    if (designation) updateFields.designation = designation;
    if (language) updateFields.language = language;

    Object.assign(LamiCourier, updateFields);
    await LamiCourier.save();

    return true;
};

interface IDeleteLamiCourierBody {
    lamiCourierid: string;
}

export const deleteLamiCourier = async (decodedTokenId: string, lamiCourierid: string) => {
    const LamiUser = await userModel.findById(decodedTokenId);

    if (!LamiUser || LamiUser.role !== 'LaMi_Admin') {
        throw new ErrorHandler('Unauthorized', 400);
    }

    const LamiCourier = await userModel.findById(lamiCourierid);

    if (!LamiCourier) {
        throw new ErrorHandler("User not found", 404);
    }

    if (LamiUser._id.toString() !== (LamiCourier?.lamiAdminId?.toString())) {
        throw new ErrorHandler('Unauthorized - Cannot delete another user\'s courier', 400);
    }

    await userModel.findByIdAndDelete(lamiCourierid);
};

// Service function for getting courier history
export const getCourierHistory = async (userId: string): Promise<any> => {
    try {
        // Find couriers associated with the Lami admin user
        const couriers = await userModel.find({ lamiAdminId: userId });
        const currentDate = new Date();

        const courierDataPromises = couriers.map(async courier => {
            const courierId = courier._id;

            // Fetch ticketData for the current courier
            const ticketData = await TicketDriver.find({ courierId: courierId });
            const ticketIds = ticketData.map(ticket => ticket.ticketId);

            // Fetch tickets for the ticketIds
            const tickets: ITicket[] = await Ticket.find({ _id: { $in: ticketIds } });
            const courierAudit = await TicketAudit.find({ ticketId: { $in: ticketIds } });

            let open = 0;
            let closed = 0;
            let ontime = 0;
            let lostCount = 0;
            let lostvalue = 0;
            let upcommingOneDay = 0;
            let upcommingTwoDay = 0;
            let upcommingThreeDay = 0;

            ticketData.forEach(ticket => {

                let countOnTimeAudits = 0;
                const ticketInfo = tickets.find(t => t._id.toString() === ticket.ticketId.toString());
                if (!ticketInfo) return;

                const diffInMs = new Date(ticketInfo.deadlineDate).getTime() - currentDate.getTime();
                const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60) + 24);

                courierAudit.forEach(finishedDate => {
                    if (finishedDate.status === 'preloco' && (new Date(finishedDate.date).getTime() < new Date(ticketInfo.deadlineDate).getTime())) {
                        countOnTimeAudits++;
                    }
                });

                ontime = countOnTimeAudits;

                switch (ticketInfo.status) {
                    case 'courier':
                        open++;
                        if (diffInHours <= 24) upcommingOneDay++;
                        else if (diffInHours <= 48) upcommingTwoDay++;
                        else if (diffInHours <= 72) upcommingThreeDay++;
                        break;
                    case 'preloco':
                    case 'loco':
                    case 'locosuccess':
                    case 'insurance':
                        closed++;
                        break;
                    case 'locolost':
                        closed++;
                        lostCount++;
                        lostvalue += ticketInfo.amountInDispute || 0;
                        break;
                    default:
                        break;
                }
            });

            return {
                "_id": courier._id,
                "avatar": courier.avatar,
                "name": courier.name,
                "open": open,
                "closed": closed,
                "ontime": ontime,
                "lost-count": lostCount,
                "lost-value": lostvalue,
                "upcomming-one-day": upcommingOneDay,
                "upcomming-two-day": upcommingTwoDay,
                "upcomming-three-day": upcommingThreeDay
            };
        });

        const courierData = await Promise.all(courierDataPromises);
        return courierData;

    } catch (e: any) {
        throw new Error("Failed to get courier history data");
    }
};


// this service function will handles emaildata data
export const getemaildata = async (userId: string, ticketId: string): Promise<any> => {
    try {

        const locoEmailData = await LocoEmailModel.find({
            lamiAdminId: { $in: userId },
            ticketId: { $in: ticketId }
        });


        return locoEmailData;

    } catch (e: any) {
        throw new Error("Failed to get email data");
    }
}

// this service function will handles emaildata status
export const statusUpdateService = async (emailId: string): Promise<any> => {
    try {
        // Find the email document by its ID
        const emaildata = await LocoEmailModel.findById(emailId);

        // If the email document is not found, throw an error
        if (!emaildata) {
            throw new Error("Email data not found");
        }

        // Update the status of the email document to 'read'
        emaildata.status = 'read';

        // Save the updated email document
        await emaildata.save();

        // Return the updated email document (optional)
        return emaildata;

    } catch (e: any) {
        // Handle errors properly and provide meaningful error messages
        throw new Error("Failed to update email status");
    }
}
