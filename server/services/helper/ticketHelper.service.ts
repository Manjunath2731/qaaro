// ticketHelper.service.ts
import TicketDriver from "../../models/tickets/ticketdriver.model";
import Ticket, { ITicket } from "../../models/tickets/tickets.model";
import TicketAudit from "../../models/tickets/ticketsaudit.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { LamiAccountModel } from "../../models/LamiAccount.model";
import LamiLogModel from "../../models/lamilog.model";
import LocoEmailModel, { ILocoEmail } from "../../models/locoEmail.model";
import { copyInS3, deleteFromS3, uploadToS3 } from "../../utils/s3Utils";
import sendMail, { EmailOptions } from "../../utils/sendMail";
import DriverCourierSummaryModel from "../../models/courierSummary.model";
import CourierLogModel from "../../models/courierTicketSummery.model";
import userModel, { IUSer, UserStatus } from "../../models/user.model";
import mongoose from 'mongoose';
import AnonymousMailModel from "../../models/tickets/ticketAnnonyous.model";
import { ITicketCreationBody } from "../../utils/interface/interface";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import axios from "axios";
import DeniedPdfModel from "../../models/resource/deniedpdf.model";
import { splitDescriptionIntoLines } from "../../controllers/user/lami-courier/courierPdf.controller";
import TicketInvoice, { ITicketInvoice } from "../../models/tickets/ticketInvoice.model";
import TicketInsurance, { ITicketInsurance } from "../../models/tickets/ticketInsurance.model";
import TicketNetLost from "../../models/tickets/ticketnetlost.model";
import { ILink, Link } from "../../models/Link.model";

require('dotenv').config();

//Service function for Temporary add ticket
//<--------------------------------- Temporary ---------------------------------->
export const addTicketService = async (body: any, lamiAdminIdId: string, anonymousId: string) => {
    try {
        const anonymousData = await AnonymousMailModel.findById(anonymousId);

        const newTicket = new Ticket({
            dpdTicketNumber: body.dpdTicketNumber,
            complainNumber: body.complainNumber,
            packageNumber: body.packageNumber,
            claimType: body.claimType,
            problem: body.problem,
            amountInDispute: body.amountInDispute,
            dpdReferenceNumber: body.dpdReferenceNumber,
            packageDetails: body.packageDetails,
            sellerDetails: body.sellerDetails,
            recipientDetails: body.recipientDetails,
            parcelLabelAddress: body.parcelLabelAddress,
            deadlineDate: body.deadlineDate,
            locoContacts: body.locoContacts,
            attachment: anonymousData?.attachment,
            status: "new",
            lamiAdminId: lamiAdminIdId
        });

        const savedTicket = await newTicket.save();
        const ticketId = savedTicket._id;

        const currentDate = new Date();
        const newTicketAudit = new TicketAudit({
            ticketId,
            status: 'new',
            date: currentDate,
            descpription: 'ticket created'
        });

        //this is for temprory we need to change it on production cron job
        //const userId = await userModel.findById(lamiAdminIdId);
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        const existingLamiLog = await LamiLogModel.findOne({
            userId: lamiAdminIdId,
            date: { $gte: startDate, $lt: endDate }
        });

        if (existingLamiLog) {
            existingLamiLog.open += 1;
            await existingLamiLog.save();
        } else {
            const newLamiLog = new LamiLogModel({
                userId: lamiAdminIdId,
                date: startDate,
                open: 1,
                loco: 0,
                locosuccess: 0,
                locolost: 0
            });
            await newLamiLog.save();
        }

        // Create a new LocoEmail document based on the anonymous data
        const locoEmailData: Partial<ILocoEmail> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiAdminIdId),
            emailBody: anonymousData?.emailBody,
            attachment: anonymousData?.attachment,
            status: "pending",
            type: "IN",
            emailDate: anonymousData?.emailDate
        };

        // Save the new LocoEmail document
        const locoEmail = await LocoEmailModel.create(locoEmailData);
        await newTicketAudit.save();
        await AnonymousMailModel.deleteOne({ _id: anonymousId });
    } catch (e) {
        throw e
    }
};

//<--------------------------------- Temporary ---------------------------------->


//Service function for get Ticket List
export const getTicketsListService = async (userId: string) => {
    try {

        const ticketList = await Ticket.find({
            lamiAdminId: userId
        })
            .select('-dpdTicketNumber -dpdReferenceNumber -packageDetails -recipientDetails -parcelLabelAddress -locoContacts -attachment -updatedAt -sellerDetails -__v')
            .sort({ updatedAt: -1 });

        const modifiedTicketList = await Promise.all(ticketList.map(async (ticket) => {
            let status = ticket.status;
            if (status === 'locolost') {
                status = 'LOCO LOST';
            } else if (status === 'locosuccess') {
                status = 'LOCO SUCCESS';
            }

            const capitalizedStatus = status.toUpperCase();
            const assignedDriver = await TicketDriver.findOne({ 'ticketId': ticket._id });
            const driverData = await userModel.findById(assignedDriver?.courierId);
            const email = await LocoEmailModel.findOne({
                ticketId: ticket._id,
                status: 'pending',
                type: 'IN'
            });

            const hasPendingInEmail = !!email;


            if (ticket.status) {
                const formattedSubStatus = ticket.SubStatus?.replace(/_/g, ' ').toUpperCase();

                return {
                    ...ticket.toObject(),
                    status: capitalizedStatus,
                    SubStatus: formattedSubStatus,
                    courierData: {
                        _id: driverData?._id,
                        name: driverData?.name,
                        avatar: driverData?.avatar,
                        routeNo: driverData?.designation
                    },
                    hasPendingInEmail
                };
            }

            return {
                ...ticket.toObject(),
                status: capitalizedStatus
            };
        }));

        return modifiedTicketList;
    } catch (e) {
        throw e
    }
};


//Service function for get Ticket details
export const getTicketDetails = async (ticketId: string) => {
    try {

        const ticketDetails = await Ticket.findById(ticketId);
        const courierData = await TicketDriver.findOne({ 'ticketId': ticketId });
        const courierUser = await userModel.findById(courierData?.courierId);
        const InvoicedData = await TicketInvoice.findOne({ 'ticketId': ticketId });
        const InsuranceData = await TicketInsurance.findOne({ 'ticketId': ticketId });


        if (!ticketDetails) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        let status = ticketDetails.status;
        if (status === 'locolost') {
            status = 'LOCO LOST';
        } else if (status === 'locosuccess') {
            status = 'LOCO SUCCESS';
        } else if (status === 'insuokay') {
            status = 'INSUOKAY';
        } else if (status === 'insureject') {
            status = 'INSUREJECT';
        }

        const formattedStatus = status.toUpperCase();
        let formattedSubStatus = '';
        if (ticketDetails.SubStatus) {
            formattedSubStatus = ticketDetails.SubStatus?.replace(/_/g, ' ').toUpperCase();
        }

        const modifiedTicketDetails = {
            ...ticketDetails.toObject(),
            status: formattedStatus,
            SubStatus: formattedSubStatus,
            courierdata: courierUser,
            invoicedData: InvoicedData ? InvoicedData : {},
            insuranceData: InsuranceData ? InsuranceData : {}
        };
        return modifiedTicketDetails;
    } catch (e) {
        throw e
    }
};


//Service function for assign courier api's
export const assignCourierToTicket = async (ticketId: string, courierId: string, description: string) => {
    try {
        const courierData = await userModel.findById(courierId);
        const updatedTicket = await Ticket.findById(ticketId);
        if (!updatedTicket) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (updatedTicket.status !== 'new' && updatedTicket.status !== 'loco') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        if (courierData?.status === UserStatus.INACTIVE) {
            throw new ErrorHandler('Courier not active', 401);
        }

        // Create a new ticket driver with provided details
        // const newTicketDriver = new TicketDriver({ ticketId, courierId, status: 'open', description: description });
        // Create a new ticket driver with provided details
        const newTicketDriver = new TicketDriver({ ticketId, courierId, status: 'open', description: description });

        await newTicketDriver.save();
        // Create a new ticket audit entry for courier assignment
        const newTicketAudit = new TicketAudit({ ticketId, status: 'courier', descpription: `asigned to ${courierData?.name} (${courierData?.designation})` });

        let courierSummary = await DriverCourierSummaryModel.findOne({ courierId }).populate('ticket');

        // If courier summary is not found, create a new one
        if (!courierSummary) {
            courierSummary = new DriverCourierSummaryModel({
                courierId,
                ticket: { opened: 1, complete: 0, lostAmount: 0, onTime: 0, late: 0 }, completed: 0
            });
        } else {
            // Increment the opened ticket count in the courier summary
            courierSummary.ticket.opened += 1;
        }

        /*
        why dates should not stored as Strings:-
                            Inaccurate sorting: Sorting by date may not produce correct results since strings are sorted lexicographically, not chronologically.
                            Limited querying capabilities: It becomes challenging to perform date-based queries, such as finding records within a specific date range.
                            Timezone inconsistencies: Strings may not accurately represent timezone information, leading to discrepancies in date/time calculations.
        */

        // Get current date and create start and end date for querying courier logs
        const currentDate = new Date();

        // Create start date for querying courier logs (beginning of current day)

        /*
        Start Date Creation:
                            create a new date representing the beginning of the current day (startDate).
                            This is achieved by using the getFullYear(), getMonth(), and getDate() methods of the currentDate object to extract the 
                            year, month, and day, respectively, and pass them as arguments to the Date constructor.
                            This ensures that startDate represents midnight of the current day. 
        */
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

        // Create end date for querying courier logs (beginning of next day)
        /*
        End Date Creation:
                            create another date representing the beginning of the next day (endDate).
                            Similar to startDate, we use the getFullYear(), getMonth(), and getDate() methods of the currentDate object to extract the 
                            year, month, and day, respectively, and add 1 to the day value to move to the next day. 
                            This ensures that endDate represents midnight of the next day.
        */
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        // Find existing courier log entry for the current date
        const existingCourierLog = await CourierLogModel.findOne({
            courierId: newTicketDriver.courierId,
            date: { $gte: startDate, $lt: endDate }// 24-04-2023: 21:09:18 
        });

        console.log(newTicketDriver.createdAt);


        // If existing courier log found, update assigned count; otherwise, create new log entry
        if (existingCourierLog) {
            existingCourierLog.assigned += 1;
            await existingCourierLog.save();
        } else {
            const newCourierLog = new CourierLogModel({ courierId, date: newTicketDriver.createdAt, assigned: 1, completed: 0 });
            await newCourierLog.save();
        }

        updatedTicket.status = 'courier';

        await Promise.all([
            newTicketAudit.save(),
            updatedTicket.save(),
            courierSummary.save()
        ]);

        return newTicketDriver;
    } catch (e) {
        throw e
    }
};


export const returnTicketToCourier = async (ticketId: string, courierId: string, description: string) => {
    try {
        const [courierData, TicketData, ticketDriver, previousAudit, courierSummary] = await Promise.all([
            userModel.findById(courierId),
            Ticket.findById(ticketId),
            TicketDriver.findOne({ ticketId: ticketId }),
            TicketAudit.findOne({ ticketId: ticketId, status: { $in: ["preloco", "loco"] } }).sort({ date: -1 }),
            DriverCourierSummaryModel.findOne({ courierId }).populate('ticket')
        ]);


        if (!TicketData || (TicketData.status !== 'preloco' && TicketData.status !== 'loco') || !ticketDriver || !previousAudit || !courierSummary) {
            throw new ErrorHandler('Invalid ticket or related data', 404);
        }

        if (courierData?.status === UserStatus.INACTIVE) {
            throw new ErrorHandler('Courier not active', 401);
        }

        ticketDriver.status = 're-open';
        ticketDriver.description = description;
        await ticketDriver.save();

        // Create a new ticket audit entry for courier assignment
        const newTicketAudit = new TicketAudit({ ticketId, status: 'courier', descpription: `returned to ${courierData?.name} (${courierData?.designation})` });


        // Clear returnDescCouri and returnDescLami if they have a string value
        if (TicketData.returnDescCouri) {
            TicketData.returnDescCouri = '';
        }

        if (TicketData.returnDescLami) {
            TicketData.returnDescLami = '';
        }

        // If courier summary is not found, create a new one
        if (courierSummary) {
            courierSummary.ticket.opened += 1;
            courierSummary.ticket.complete -= 1;
            if (previousAudit?.date <= TicketData.deadlineDate) {
                courierSummary.ticket.onTime -= 1;
            } else {
                courierSummary.ticket.late -= 1;
            }
        }

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        // Find existing courier log entry for the current date
        const existingCourierLog = await CourierLogModel.findOne({
            courierId: ticketDriver.courierId,
            date: { $gte: startDate, $lt: endDate }// 24-04-2023: 21:09:18 
        });


        // If existing courier log found, update assigned count; otherwise, create new log entry
        if (existingCourierLog) {
            existingCourierLog.assigned += 1;
            await existingCourierLog.save();
        }
        else {
            const newCourierLog = new CourierLogModel({ courierId, date: ticketDriver.createdAt, assigned: 1, completed: 0 });
            await newCourierLog.save();
        }

        TicketData.status = 'courier';
        TicketData.SubStatus = '';

        await Promise.all([
            newTicketAudit.save(),
            TicketData.save(),
            courierSummary?.save()
        ]);

        return ticketDriver;
    } catch (e) {
        throw e
    }
};


//Service function for Return to loco api's
export const cancelCourierService = async (ticketId: string, currCourierId: string) => {
    try {
        const ticketObjectId = new mongoose.Types.ObjectId(ticketId);
        const currCourierObjectId = new mongoose.Types.ObjectId(currCourierId);
        const driver = await TicketDriver.findOne({ ticketId: ticketObjectId, status: "open" });
        if (!driver) {
            throw new ErrorHandler('Ticket driver not found', 404);
        }
        const currentDate = driver.createdAt;
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const [driverData, ticketAudit, courierLog, ticketData, courierSummary] = await Promise.all([
            TicketDriver.findOne({ ticketId: ticketObjectId, status: "open" }),
            TicketAudit.findOne({ ticketId: ticketObjectId, status: "courier" }),
            CourierLogModel.findOne({ courierId: currCourierObjectId, date: { $gte: startDate, $lt: endDate } }),
            // CourierLogModel.findOne({ courierId: currCourierObjectId }),
            Ticket.findOne({ _id: ticketObjectId }),
            DriverCourierSummaryModel.findOne({ courierId: currCourierObjectId }).populate('ticket')
        ]);

        if (!driverData) {
            throw new ErrorHandler('Ticket driver not found', 404);
        }

        if (!ticketAudit) {
            throw new ErrorHandler('Ticket audit not found for the provided ticketId and status "courier"', 404);
        }

        if (!courierLog) {
            throw new ErrorHandler('Courier log not found', 404);
        }

        if (!courierSummary) {
            throw new ErrorHandler('Courier summary not found', 404);
        }

        if (!ticketData) {
            throw new ErrorHandler('ticket not found', 404);
        }

        if (ticketData.status !== 'courier') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        // Delete driver data
        await driverData.deleteOne();

        // Delete audit data
        await ticketAudit.deleteOne();

        if (courierLog.assigned > 0) {
            // Decrement assigned value of courier by 1
            courierLog.assigned -= 1;
        }
        if (courierSummary.ticket.opened > 0) {
            // Decrement opened value by 1
            courierSummary.ticket.opened -= 1;
        }

        //Ticket data
        ticketData.status = "new";
        // Save updated courier log and summary
        await Promise.all([courierLog.save(), courierSummary.save(), ticketData.save()]);
    } catch (e) {
        throw e;
    }
};





export const returnTicketToLoCo = async (lamiUser: any, ticketId: string, body: any, newAttachment: any) => {
    try {
        const lamiAccount = await LamiAccountModel.findOne({ lamiId: lamiUser?._id });
        if (!lamiAccount || !lamiAccount.connected) {
            throw new ErrorHandler('Account_Not_Connected', 404);
        }

        //Mail sending (finding mail credentials from locoAccoutn model and sending mail)
        //<---------------------------------Start--------------------------------------->
        const { user, password, host, port } = lamiAccount?.emailServer;
        const transportOptions = {
            host,
            port,
            service: "gmail",
            secure: false,
            auth: {
                user,
                pass: password
            }
        };
        //<---------------------------------End--------------------------------------->
        const updatedTicket = await Ticket.findById(ticketId);
        if (!updatedTicket) {
            throw new ErrorHandler('Ticket not found', 404);
        }



        const attachmentArray = body.attachment && body.attachment !== "undefined" ? body.attachment.split(',') : [];

        // Process attachments
        const processedAttachments: { files: string[] } = { files: [] };
        // Handle existing attachments if provided
        if (body.attachment && Array.isArray(attachmentArray)) {
            processedAttachments.files.push(...attachmentArray);
        }
        // Handle new attachments, upload them to S3 and collect URLs
        if (newAttachment && newAttachment.length > 0) {
            const uploadPromises = newAttachment.map(async (file: { buffer: Buffer | Express.Multer.File; originalname: string; }) => {
                const s3Url = await uploadToS3(file.buffer, file.originalname, 'attachment/lami', ticketId);
                return s3Url;
            });
            const s3Urls = await Promise.all(uploadPromises);
            processedAttachments.files.push(...s3Urls);
            updatedTicket.signedoc?.files.push(...s3Urls);
        }
        // Update the ticket with new attachment references if there are any
        // if (processedAttachments.length > 0) {
        //     updatedTicket.signedoc = updatedTicket.signedoc || { files: [] };
        //     updatedTicket.signedoc.files.push(...processedAttachments);
        //     //body.attachment should remove
        // }


        let finalSignature: string;
        if (body.signature === null || !body.signature) {
            const emailSignatureBuffer = Buffer.from(body.newsignature, 'base64');
            const emailSignatureUrl = await uploadToS3(emailSignatureBuffer, `${lamiUser._id}_updated_emailSignature.jpg`, 'emailSignatures/extra', lamiUser._id);
            finalSignature = emailSignatureUrl;
        } else {
            finalSignature = body.signature;
        }

        if (updatedTicket.status === "new") {
            updatedTicket.status = 'loco';
            updatedTicket.SubStatus = 'LaMi_Returned';
            updatedTicket.returnDescLami = body.description;

        } else {
            updatedTicket.status = 'loco';
            updatedTicket.returnDescLami = body.description;
        }
        //Position of this section should be verified


        const newTicketAudit = new TicketAudit({
            ticketId: updatedTicket._id,
            status: 'loco',
            descpription: body.description
        });

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const existingLamiLog = await LamiLogModel.findOne({
            userId: lamiUser?._id,
            date: { $gte: startDate, $lt: endDate }
        });

        if (existingLamiLog) {
            if (existingLamiLog.open > 0) {
                existingLamiLog.open -= 1;
            }
            existingLamiLog.loco += 1;

            await existingLamiLog.save();
        } else {
            const newCourierLog = new LamiLogModel({
                userId: lamiUser?._id,
                date: startDate,
                open: 0,
                loco: 1,
                locosuccess: 0,
                locolost: 0
            });
            await newCourierLog.save();
        }


        const recipients: string[] = Array.isArray(body.to) ? body.to : [body.to];
        const ccRecipients: string[] = Array.isArray(body.cc) ? body.cc : body.cc ? [body.cc] : [];
        const bccRecipients: string[] = Array.isArray(body.bcc) ? body.bcc : body.bcc ? [body.bcc] : [];

        // Define the options for sending the email
        const mailOptions: EmailOptions = {
            email: body.to,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject: body.subject || '',
            template: 'return-to-loco.ejs',
            data: {
                name: lamiUser?.name,
                ticketId: updatedTicket._id,
                message: body.message || '',
                description: body.description,
                attachment: processedAttachments,
                signature: finalSignature
            },
            attachments: processedAttachments.files
        };

        // Send the email
        const htmlContent = await sendMail(mailOptions, transportOptions);

        const locoEmailData: Partial<ILocoEmail> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiUser?._id),
            emailBody: htmlContent,
            type: "OUT",
            attachment: processedAttachments,
            status: "pending",
            emailDate: currentDate
        };

        //updating table after sccessfull process completetion
        await Promise.all([updatedTicket.save(), newTicketAudit.save(), LocoEmailModel.create(locoEmailData)]);


    } catch (e) {
        throw e
    }
};

export const mailSendServer = async (lamiUser: any, ticketId: string, body: any, files: any) => {
    try {
        const lamiAccount = await LamiAccountModel.findOne({ lamiId: lamiUser?._id });
        if (!lamiAccount || !lamiAccount.connected) {
            throw new ErrorHandler('Account_Not_Connected', 404);
        }

        //Mail sending (finding mail credentials from locoAccoutn model and sending mail)
        //<---------------------------------Start--------------------------------------->
        const { user, password, host, port } = lamiAccount?.emailServer;
        const transportOptions = {
            host,
            port,
            service: "gmail",
            secure: false,
            auth: {
                user,
                pass: password
            }
        };

        const attachmentArray = body.attachment && body.attachment !== "undefined" ? body.attachment.split(',') : [];

        // Process attachments
        const processedAttachments: { files: string[] } = { files: [] };
        // Handle existing attachments if provided
        if (body.attachment && Array.isArray(attachmentArray)) {
            processedAttachments.files.push(...attachmentArray);
        }
        // Handle new attachments, upload them to S3 and collect URLs
        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file: { buffer: Buffer | Express.Multer.File; originalname: string; }) => {
                const s3Url = await uploadToS3(file.buffer, file.originalname, 'attachment/locoemail');
                return s3Url;
            });
            const s3Urls = await Promise.all(uploadPromises);
            processedAttachments.files.push(...s3Urls);
        }

        const ccRecipients: string[] = Array.isArray(body.cc) ? body.cc : body.cc ? [body.cc] : [];
        const bccRecipients: string[] = Array.isArray(body.bcc) ? body.bcc : body.bcc ? [body.bcc] : [];

        // Define the options for sending the email
        const mailOptions: EmailOptions = {
            email: body.to,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject: body.subject || '',
            template: 'sendmail.ejs',
            data: {
                message: body.message || ''
            },
            attachments: processedAttachments.files
        };

        const htmlContent = await sendMail(mailOptions, transportOptions);

        console.log("html", htmlContent);

        const currentDate = new Date();
        const locoEmailData: Partial<ILocoEmail> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiUser?._id),
            emailBody: htmlContent,
            type: "OUT",
            attachment: processedAttachments,
            status: "pending",
            emailDate: currentDate
        };

        console.log("processedAttachments", processedAttachments);

        await LocoEmailModel.create(locoEmailData);

    } catch (e: any) {
        throw e
    }

}


//Accept Insurance service
export const ApplyInsuranceService = async (lamiUser: any, ticketId: string, body: any, files: any) => {
    try {

        console.log("aa", body);

        const lamiAccount = await LamiAccountModel.findOne({ lamiId: lamiUser?._id });
        const TicketData = await Ticket.findById(ticketId);
        const InvoiceData = await TicketInvoice.findOne({ ticketId: ticketId });

        if (!TicketData) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (TicketData.status !== 'invoiced') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        if (!lamiAccount || !lamiAccount.connected) {
            throw new ErrorHandler('Account not connected', 404);
        }

        // Mail sending setup
        const { user, password, host, port } = lamiAccount?.emailServer;
        const transportOptions = {
            host,
            port,
            service: "gmail",
            secure: false,
            auth: {
                user,
                pass: password
            }
        };

        const attachmentArray = body.attachment && body.attachment !== "undefined" ? body.attachment.split(',') : [];
        const processedAttachments: { files: string[] } = { files: [] };

        if (Array.isArray(attachmentArray)) {
            processedAttachments.files.push(...attachmentArray);
        }

        // Handle new attachments, upload them to S3 and collect URLs
        if (files && files.length > 0) {
            const uploadPromises = files.map(async (file: { buffer: Buffer | Express.Multer.File; originalname: string; }) => {
                const s3Url = await uploadToS3(file.buffer, file.originalname, 'attachment/insurance');
                return s3Url;
            });
            const s3Urls = await Promise.all(uploadPromises);
            processedAttachments.files.push(...s3Urls);
        }

        const ccRecipients: string[] = Array.isArray(body.cc) ? body.cc : body.cc ? [body.cc] : [];
        const bccRecipients: string[] = Array.isArray(body.bcc) ? body.bcc : body.bcc ? [body.bcc] : [];

        // Define the options for sending the email
        const mailOptions: EmailOptions = {
            email: body.to,
            cc: ccRecipients,
            bcc: bccRecipients,
            subject: body.subject || '',
            template: 'sendmail.ejs',
            data: {
                message: body.message || ''
            },
            attachments: processedAttachments.files
        };

        const htmlContent = await sendMail(mailOptions, transportOptions);

        const currentDate = new Date();
        const locoEmailData: Partial<ILocoEmail> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiUser?._id),
            emailBody: htmlContent,
            type: "OUT",
            attachment: processedAttachments,
            status: "pending",
            emailDate: currentDate
        };

        TicketData.status = 'insurance';

        const newTicketAudit = new TicketAudit({
            ticketId: new mongoose.Types.ObjectId(ticketId),
            status: 'insurance',
            descpription: body.notes
        });

        const InsuranceData: Partial<ITicketInsurance> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiUser?._id),
            insuCompensationAmount: InvoiceData?.finalLostAmmount,
            notes: body.message
        };

        console.log("ticletaudit", newTicketAudit);


        // await Promise.all([
        //     TicketData.save(),
        //     newTicketAudit.save(),
        //     LocoEmailModel.create([locoEmailData]),
        //     TicketInsurance.create([InsuranceData])
        // ]);

        await Promise.all([TicketData.save(), newTicketAudit.save(), LocoEmailModel.create(locoEmailData), TicketInsurance.create(InsuranceData)]);

    } catch (e: any) {
        throw e;
    };
}



//Reject Insurance service
export const AcceptInsuranceService = async (lamiUser: any, ticketId: string, body: any) => {
    try {
        const TicketData = await Ticket.findById(ticketId);
        const Insurance = await TicketInsurance.findOne({ ticketId: ticketId });

        if (!TicketData) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (TicketData.status !== 'insurance') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        if (!Insurance) {
            throw new ErrorHandler('Insurance record not found', 404);
        }

        TicketData.status = 'insuokay';

        const newTicketAudit = new TicketAudit({
            ticketId: new mongoose.Types.ObjectId(ticketId),
            status: 'insuokay',
            description: body.notes
        });

        // Update the existing insurance record with new data
        Insurance.insuClaimNumber = body.insuClaimNumber;
        Insurance.insuOurSign = body.insuOurSign;
        Insurance.insuDate = body.insuDate;
        Insurance.insuTransferAmount = body.insuTransferAmount;
        Insurance.insuCompensationAmount = body.insuCompensationAmount;
        Insurance.insuDeductible = body.insuDeductible;
        Insurance.notes = body.notes;

        await Promise.all([
            TicketData.save(),
            newTicketAudit.save(),
            Insurance.save()
        ]);

    } catch (e: any) {
        throw e;
    }
};



//Pdf description update service while return to loco
export const RejectInsuranceService = async (lamiUser: any, ticketId: string, body: any) => {
    try {
        const TicketData = await Ticket.findById(ticketId);
        const Insurance = await TicketInsurance.findOne({ ticketId: ticketId });

        if (!TicketData) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (TicketData.status !== 'insurance') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        if (!Insurance) {
            throw new ErrorHandler('Insurance record not found', 404);
        }

        TicketData.status = 'insureject';

        const newTicketAudit = new TicketAudit({
            ticketId: new mongoose.Types.ObjectId(ticketId),
            status: 'insureject',
            description: body.notes
        });

        // Update the existing insurance record with new data
        Insurance.lamiAdminId = new mongoose.Types.ObjectId(lamiUser?._id);
        Insurance.insuClaimNumber = body.insuClaimNumber;
        Insurance.insuOurSign = body.insuOurSign;
        Insurance.insuDate = body.insuDate;
        Insurance.notes = body.notes;

        await Promise.all([
            TicketData.save(),
            newTicketAudit.save(),
            Insurance.save()
        ]);

    } catch (e: any) {
        throw e;
    }
};


//Update Insurance service
export const UpdateInsuranceService = async (ticketId: string, body: any) => {
    try {
        const insuranceRecord = await TicketInsurance.findOne({ ticketId: new mongoose.Types.ObjectId(ticketId) });

        if (!insuranceRecord) {
            throw new Error('Insurance record not found');
        }

        // Update the insurance record with the new values
        Object.assign(insuranceRecord, body);

        // Save the updated insurance record back to the database
        const updatedInsuranceRecord = await insuranceRecord.save();

        return updatedInsuranceRecord;
    } catch (e: any) {
        throw e;
    }
};

//Update Invoice Service
export const invoiceUpdateService = async (ticketId: string, body: any) => {
    try {
        const invoiceRecord = await TicketInvoice.findOne({ ticketId: new mongoose.Types.ObjectId(ticketId) });

        if (!invoiceRecord) {
            throw new Error('Invoice record not found');
        }

        // Update the insurance record with the new values
        Object.assign(invoiceRecord, body);

        // Save the updated insurance record back to the database
        const updatedInsuranceRecord = await invoiceRecord.save();

        return updatedInsuranceRecord;
    } catch (e: any) {
        throw e;
    }
};

export const pdfDataService = async (ticketId: string) => {
    try {
        const pdfData = await DeniedPdfModel.findOne({ ticketId: ticketId });

        if (!pdfData) {
            throw new Error("PDF not found");
        }

        let data = pdfData.description;

        return data;

    } catch (e: any) {
        throw new Error("Failed get pdf data");
    }
}

//Pdf create service while return to loco
export const createPdf = async (ticketId: string, description: string) => {
    try {

        const pdfData = await DeniedPdfModel.findOne({ ticketId: ticketId });

        const ticketDetails = await Ticket.findById(ticketId);
        if (!pdfData) {
            throw new Error("PDF not found");
        }

        if (!ticketDetails) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        const attachment = ticketDetails.attachment;

        if (!attachment || !attachment.files || attachment.files.length === 0) {
            throw new ErrorHandler('Attachment files not found in the ticket', 404);
        }

        if (!ticketDetails.attachment) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        const pdfFilePath = ticketDetails.attachment.files.find(url => url.endsWith('Rechtsverbindliche_Erkl%C3%A4rung.pdf'));

        if (!pdfFilePath) {
            throw new ErrorHandler('file not found', 404);
        }

        const { data: pdfBytes } = await axios.get(pdfFilePath, { responseType: 'arraybuffer' });
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const signatureImageBytes = Buffer.from(pdfData?.signatureImage, 'base64');

        const signatureImg = await pdfDoc.embedPng(signatureImageBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        firstPage.drawImage(signatureImg, { x: 310, y: 355, width: signatureImg.width / 2, height: signatureImg.height / 6 });
        firstPage.drawText(pdfData?.place, { x: 30, y: 355, size: 12, font: font, color: rgb(0, 0, 0) });

        firstPage.drawText(pdfData?.name, { x: 310, y: 315, size: 12, font: font, color: rgb(0, 0, 0) });



        secondPage.drawImage(signatureImg, { x: 310, y: 345, width: signatureImg.width / 2, height: signatureImg.height / 6 });
        secondPage.drawText(pdfData?.place, { x: 30, y: 345, size: 12, font: font, color: rgb(0, 0, 0) });
        secondPage.drawText(pdfData?.name, { x: 310, y: 295, size: 12, font: font, color: rgb(0, 0, 0) });

        // Split description into lines
        const descriptionLines = splitDescriptionIntoLines(description, 94);

        const lineHeight = 25;
        let currentY = 530;
        for (const line of descriptionLines) {
            secondPage.drawText(line, { x: 30, y: currentY, size: 12, font: font, color: rgb(0, 0, 0) });
            currentY -= lineHeight;
        }


        const modifiedPdfBytes = await pdfDoc.save();

        await deleteFromS3(pdfFilePath);

        const pdfBuffer = Buffer.from(modifiedPdfBytes);
        const s3Filename = `Rechtsverbindliche_Erkl%C3%A4rung_${ticketId}.pdf`;
        const pdfLocation = await uploadToS3(pdfBuffer, s3Filename, 'pdfs/deniedPdf', ticketId);
        //update ticket table signdoc
        ticketDetails.signedoc = { files: [pdfLocation] };

        pdfData.description = description;

        await Promise.all([ticketDetails.save(), pdfData.save()]);
    } catch (e: any) {
        throw new Error("Failed to create pdf");
    }
}



//Service function for Return to loco api's dependent data
export const getlamiReturnDetails = async (userId: string, ticketId: string): Promise<any> => {
    try {
        const ticketData = await Ticket.findById(ticketId);
        const lamiAccountData = await LamiAccountModel.findOne({ lamiId: userId });

        if (!ticketData || !lamiAccountData) {
            throw new Error('Ticket or Lami Account not found');
        }
        const response = {
            "to": ticketData.locoContacts.email,
            "subject": ticketData.subject ?? "",
            "message": lamiAccountData.emailTemplate ?? "",
            "signature": lamiAccountData.emailSignatureUrl ?? "",
            "attachment": ticketData.signedoc ?? {}
        };

        return response;
    } catch (error) {
        throw new Error("Failed to create Lami account");
    }
};

//Service function for finalize ticket
export const getfinalTicket = async (userId: string, ticketId: string, status: string, description: string): Promise<any> => {
    try {
        // Validate status
        if (!['locolost', 'locosuccess'].includes(status)) {
            throw new ErrorHandler('Invalid status value. Allowed values are locolost or locosuccess.', 400);
        }

        // Update LamiLogModel
        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);
        let existingLamiLog = await LamiLogModel.findOne({
            userId: userId,
            date: { $gte: startDate, $lt: endDate }
        });

        const locoEmailData = await LocoEmailModel.findOne({
            ticketId: { $in: ticketId }
        });

        const driver = await TicketDriver.findOne({ ticketId: ticketId });

        if (!locoEmailData) {
            throw new ErrorHandler('locoEmailData not found', 404);
        }

        if (!driver) {
            throw new ErrorHandler('courier not found', 404);
        }

        if (!existingLamiLog) {
            existingLamiLog = new LamiLogModel({
                userId: userId,
                date: startDate,
                open: 0,
                loco: 0,
                locosuccess: status === 'locosuccess' ? 1 : 0,
                locolost: status === 'locolost' ? 1 : 0
            });
        }

        if (status === 'locolost') {
            existingLamiLog.locolost += 1;
            driver.status = "lost";
        } else if (status === 'locosuccess') {
            existingLamiLog.locosuccess += 1;
            driver.status = "success";
        }


        locoEmailData.status = "completed";

        // Batch processing: Save both locoEmailData and existingLamiLog concurrently
        await Promise.all([locoEmailData.save(), existingLamiLog.save()]);

        // Update Ticket and TicketAudit
        //const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, { status }, { new: true });
        const updatedTicket = await Ticket.findOne({ _id: ticketId });
        if (!updatedTicket) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (updatedTicket.status !== 'loco') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        updatedTicket.status = status;

        const newTicketAudit = new TicketAudit({
            ticketId,
            status,
            descpription: description,
        });
        await Promise.all([newTicketAudit.save(), updatedTicket.save(), driver.save()])
    } catch (e) {
        throw e
    }
};



export const getFinalInsurance = async (ticketId: string, description: string): Promise<any> => {
    try {
        const ticket = await Ticket.findById(ticketId);
        if (!ticket || ticket.status !== 'invoiced') {
            throw new ErrorHandler('Ticket not found', 404);
        }

        ticket.status = 'noinsu';

        const newTicketAudit = new TicketAudit({
            ticketId,
            status: 'noinsu',
            descpription: description,
        });

        await Promise.all([newTicketAudit.save(), ticket.save()])

        return ticket;
    } catch (e: any) {
        throw new ErrorHandler(e.message, e.statusCode || 500);
    }
};
//Service function for update ticket api's dependent data
export const updateTicketService = async (ticketId: string, body: Partial<ITicketCreationBody>): Promise<any> => {
    try {

        const ticketData = await Ticket.findOneAndUpdate({ _id: ticketId }, body, { new: true });

        if (!ticketData) {
            throw new Error("Ticket not found");
        }

        return ticketData;

    } catch (error) {
        throw new Error("Failed to update ticket");
    }
};

// this service function will handles annonymous data
export const getAnnonymousdata = async (userId: string): Promise<any> => {
    try {
        const annonymous = await AnonymousMailModel.find({ lamiAdminId: userId });
        return annonymous;

    } catch (e: any) {
        throw new Error("Failed to get anonymous data");
    }
};

// this service function will handles annonymous data
export const anonymousDataUpdate = async (anonymousId: string): Promise<any> => {
    try {
        const anonymous = await AnonymousMailModel.findOne({ _id: anonymousId });
        if (!anonymous) {
            throw new Error("Anonymous data not found");
        }

        anonymous.status = 'read';
        await anonymous.save();

        return anonymous;
    } catch (e: any) {
        throw new Error("Failed to update anonymous data: ");
    }
};


// this service function will handles annonymous data delete
export const anonymousDataDelete = async (anonymousId: string): Promise<any> => {
    try {
        const anonymous = await AnonymousMailModel.findByIdAndDelete(anonymousId);
        return anonymous;
    } catch (e: any) {
        throw new Error("Failed to update anonymous data: ");
    }
};


// this service function will handles annonymous data attach to tickets
export const anonymousDataToTicket = async (anonymousId: string, ticketId: string, lamiAdminId: string): Promise<ILocoEmail | null> => {
    try {
        // Retrieve the anonymous data
        const anonymousData = await AnonymousMailModel.findById(anonymousId);
        if (!anonymousData) {
            throw new Error("Anonymous data not found");
        }

        // Create a new LocoEmail document based on the anonymous data
        const locoEmailData: Partial<ILocoEmail> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiAdminId),
            emailBody: anonymousData.emailBody,
            attachment: anonymousData.attachment,
            status: "pending",
            type: "IN",
            emailDate: anonymousData.emailDate
        };

        // Save the new LocoEmail document
        const locoEmail = await LocoEmailModel.create(locoEmailData);
        // Delete the anonymous data
        await AnonymousMailModel.deleteOne({ _id: anonymousId });

        return locoEmail;
    } catch (e: any) {
        throw new Error("Failed to update anonymous data");
    }
};


export const attachInvoiceService = async (lamiAdminId: string, ticketId: string, body: any, attachment: any): Promise<any> => {
    try {

        const TicketData = await Ticket.findById(ticketId);

        if (!TicketData || TicketData.status !== 'locolost') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        const processedAttachments: { files: string[] } = { files: [] };
        // Handle new attachments, upload them to S3 and collect URLs
        if (attachment && attachment.length > 0) {
            const uploadPromises = attachment.map(async (file: { buffer: Buffer | Express.Multer.File; originalname: string; }) => {
                const s3Url = await uploadToS3(file.buffer, file.originalname, 'attachment/invoiced');
                return s3Url;
            });
            const s3Urls = await Promise.all(uploadPromises);
            processedAttachments.files.push(...s3Urls);
        }

        const InvoiceAttachData: Partial<ITicketInvoice> = {
            ticketId: new mongoose.Types.ObjectId(ticketId),
            lamiAdminId: new mongoose.Types.ObjectId(lamiAdminId),
            mailHeaderNumber: body.mailHeaderNumber,
            dpdInvoiceNumber: body.dpdInvoiceNumber,
            date: body.date,
            packageNumber: body.packageNumber,
            complainNumber: body.complainNumber,
            finalLostAmmount: body.finalLostAmmount,
            notes: body.notes,
            attachment: processedAttachments
        };

        const newTicketAudit = new TicketAudit({
            ticketId: new mongoose.Types.ObjectId(ticketId),
            status: 'invoiced',
            descpription: body.notes
        });

        TicketData.status = 'invoiced'

        await Promise.all([TicketData.save(), newTicketAudit.save(), TicketInvoice.create(InvoiceAttachData)])

    } catch (e: any) {
        throw e
    }
};


//Insurance List service
export const getInsuranceListService = async (userId: string): Promise<any> => {
    try {
        // Retrieve insurance data for the given user
        const insuranceData = await TicketInsurance.find({ lamiAdminId: userId });
        const ticketIds = insuranceData.map(ticket => ticket.ticketId);

        // Retrieve ticket data for the associated ticket IDs
        const ticketData = await Ticket.find({ _id: { $in: ticketIds } });

        // Retrieve courier information for the associated ticket IDs
        const couriers = await TicketDriver.find({ ticketId: { $in: ticketIds } });
        const courierIds = couriers.map(driver => driver.courierId);

        // Retrieve user data for the associated courier IDs
        const users = await userModel.find({ _id: { $in: courierIds } });

        // Create a map for easier access to tickets and users by their IDs
        const ticketMap = new Map(ticketData.map(ticket => [ticket._id.toString(), ticket]));
        const userMap = new Map(users.map(user => [user._id.toString(), user]));

        // Format the response data
        const response = insuranceData.map(insurance => {
            const ticket = ticketMap.get(insurance.ticketId.toString());
            const courier = couriers.find(driver => driver.ticketId.toString() === insurance.ticketId.toString());
            const user = userMap.get(courier?.courierId.toString());

            return {
                insurance: {
                    _id: insurance._id,
                    ticketId: insurance.ticketId,
                    lamiAdminId: insurance.lamiAdminId,
                    insuClaimNumber: insurance.insuClaimNumber,
                    insuOurSign: insurance.insuOurSign,
                    insuDate: insurance.insuDate,
                    insuTransferAmount: insurance.insuTransferAmount,
                    insuCompensationAmount: insurance.insuCompensationAmount,
                    insuDeductible: insurance.insuDeductible,
                },
                ticketData: ticket ? {
                    _id: ticket._id,
                    complainNumber: ticket.complainNumber,
                    packageNumber: ticket.packageNumber,
                    status: ticket.status?.toUpperCase()
                } : null,
                courier: user ? {
                    avatar: user.avatar,
                    name: user.name,
                    routeNo: user.designation
                } : null
            };
        });

        return response;
    } catch (e: any) {
        throw e;
    }
};

//Invoice List service
export const getInvoiceListService = async (userId: string): Promise<any> => {
    try {
        // Retrieve invoice data for the given user
        const invoiceData = await TicketInvoice.find({ lamiAdminId: userId });
        const ticketIds = invoiceData.map(invoice => invoice.ticketId);

        // Retrieve ticket data for the associated ticket IDs
        const ticketData = await Ticket.find({ _id: { $in: ticketIds } });

        // Create a map for easier access to tickets by their IDs
        const ticketMap = new Map(ticketData.map(ticket => [ticket._id.toString(), ticket]));

        // Format the response data
        const response = invoiceData.map(invoice => {
            const ticket = ticketMap.get(invoice.ticketId.toString());

            return {
                invoice: {
                    _id: invoice._id,
                    ticketId: invoice.ticketId,
                    lamiAdminId: invoice.lamiAdminId,
                    mailHeaderNumber: invoice.mailHeaderNumber,
                    dpdInvoiceNumber: invoice.dpdInvoiceNumber,
                    date: invoice.date,
                    packageNumber: invoice.packageNumber,
                    complainNumber: invoice.complainNumber,
                    finalLostAmmount: invoice.finalLostAmmount,
                    notes: invoice.notes,
                    attachment: invoice.attachment,
                },
                ticketData: ticket ? {
                    _id: ticket._id,
                    complainNumber: ticket.complainNumber,
                    packageNumber: ticket.packageNumber
                } : null
            };
        });

        return response;
    } catch (e: any) {
        throw e;
    }
};



// Amount Count
export const getAmountService = async (userId: string): Promise<any> => {
    try {
        // Retrieve insurance data for the given user
        const insuranceData = await TicketInsurance.find({ lamiAdminId: userId });
        const invoiceData = await TicketInvoice.find({ lamiAdminId: userId });

        // Calculate the total amounts for insurance
        const totalInsuranceAmounts = insuranceData.reduce((totals, insurance) => {
            totals.insuTransferAmount += insurance.insuTransferAmount || 0;
            totals.insuCompensationAmount += insurance.insuCompensationAmount || 0;
            totals.insuDeductible += insurance.insuDeductible || 0;
            return totals;
        }, {
            insuTransferAmount: 0,
            insuCompensationAmount: 0,
            insuDeductible: 0
        });

        // Calculate the total amount for invoices
        const totalInvoiceAmount = invoiceData.reduce((total, invoice) => {
            return total + (invoice.finalLostAmmount || 0);
        }, 0);

        // Combine the results into a single response object
        const response = {
            insuTransferAmount: totalInsuranceAmounts.insuTransferAmount.toFixed(2),
            insuCompensationAmount: totalInsuranceAmounts.insuCompensationAmount.toFixed(2),
            insuDeductible: totalInsuranceAmounts.insuDeductible.toFixed(2),
            finalLostAmmount: totalInvoiceAmount.toFixed(2)
        };

        return response;
    } catch (e: any) {
        throw e;
    }
};


export const dragdropService = async (ticketId: string, attachment: string[]): Promise<any> => {
    try {
        const ticket = await Ticket.findById(ticketId);

        if (!ticket) {
            throw new Error("Ticket not found");
        }

        // Append the new attachments to the existing attachments
        if (ticket.attachment) {
            if (ticket.attachment.files) {
                ticket.attachment.files.push(...attachment);
            } else {
                ticket.attachment.files = attachment;
            }
        } else {
            ticket.attachment = { files: attachment };
        }


        // Save the updated ticket
        await ticket.save();

        // Return the updated ticket
        return ticket;
    } catch (e: any) {
        throw new Error(e.message);
    }
}


// Amount Count
export const paidAmountService = async (userId: string, courierId: string, body: any): Promise<any> => {
    try {
        const { date, paidAmount } = body;

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(courierId)) {
            throw new Error('Invalid userId or courierId');
        }

        if (!date || !paidAmount) {
            throw new Error('Date and paidAmount are required');
        }

        const ticketNetLost = new TicketNetLost({
            lamiAdminId: new mongoose.Types.ObjectId(userId),
            courierId: new mongoose.Types.ObjectId(courierId),
            date,
            paidAmount
        });

        await ticketNetLost.save();
        return ticketNetLost;

    } catch (e: any) {
        throw e;
    }
};



export const getPaidAmountService = async (user: any, courierId: string): Promise<any> => {
    try {
        const amount = await TicketNetLost.find({ courierId: courierId })
            .select('date paidAmount')
            .exec();

        const ticketDrivers = await TicketDriver.find({ courierId }).select('ticketId').exec();
        const ticketIds = ticketDrivers.map(ticketDriver => ticketDriver.ticketId);

        const [ticketsData, invoiceData, insuranceData] = await Promise.all([
            Ticket.find({ _id: { $in: ticketIds }, status: { $in: ['noinsu', 'insureject', 'insuokay'] } })
                .select('_id status amountInDispute SubStatus complainNumber').exec(),
            TicketInvoice.find({ ticketId: { $in: ticketIds } })
                .select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } })
                .select('ticketId insuDeductible').exec(),
        ]);

        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

        let totalLostAmount = 0;
        const ticketDetails = ticketsData.map(ticket => {
            const ticketIdStr = ticket._id.toString();
            let lostAmount = 0;
            switch (ticket.status) {
                case 'noinsu':
                case 'insureject':
                    lostAmount = invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
                case 'insuokay':
                    lostAmount = insuranceMap.get(ticketIdStr)?.insuDeductible || 0;
                    break;
            }

            totalLostAmount += lostAmount;
            return {
                complainNumber: ticket.complainNumber,
                status: ticket.status.toUpperCase(),
                lostAmount
            };
        });

        // Calculate net lost
        const offsetAmount = amount.reduce((acc, curr) => acc + curr.paidAmount, 0);
        const netlost = (totalLostAmount - offsetAmount).toFixed(2);

        // Construct response
        const response = {
            offset: amount,
            lostdata: ticketDetails,
            netlost: netlost
        };

        return response;

    } catch (e: any) {
        throw e;
    }
};



export const contactCustomerService = async (email: string, ticketId: string, language: string): Promise<any> => {
    const linkId = new mongoose.Types.ObjectId().toString();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const appUrl = process.env.app_url;
    // const link = `${appUrl}/customer-form?ticketId=${ticketId}&linkId=${linkId}`;
    const link = `${appUrl}/customer-form/${ticketId}/${linkId}`;

    const newLink = new Link({
        _id: linkId,
        email,
        ticketId,
        link,
        expiresAt,
        active: true
    });

    await newLink.save();

    const mailOptions: EmailOptions = {
        email,
        subject: 'Contact Customer',
        template: 'contactCustomer.ejs',
        data: {
            link,
            language: language,
        },
        attachments: [],
        cc: [],
        bcc: []
    };

    await sendMail(mailOptions);

    return newLink;
};