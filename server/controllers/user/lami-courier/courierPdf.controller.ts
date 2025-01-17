import { Request, Response, NextFunction } from "express";
import { sendApiResponse } from "../../../utils/apiresponse";
import { verifyLamiCourierAuthorization } from "../../../middleware/auth";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import { uploadToS3 } from "../../../utils/s3Utils";
import Ticket from "../../../models/tickets/tickets.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import TicketDriver from "../../../models/tickets/ticketdriver.model";
import DriverCourierSummaryModel from "../../../models/courierSummary.model";
import CourierLogModel from "../../../models/courierTicketSummery.model";
import TicketAudit from "../../../models/tickets/ticketsaudit.model";
import axios from "axios";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import DeniedPdfModel from "../../../models/resource/deniedpdf.model";
import { format } from "date-fns";
import { Link } from "../../../models/Link.model";


export const addDataToCustometAcceptedPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const { ticketId, signatureImage, name, place, date }: { ticketId: string, signatureImage: string, name: string, place: string, date: string} = req.body;
        const ticketDetails = await Ticket.findById(ticketId);
        const ticketDriver = await TicketDriver.findOne({ ticketId });

        if (!ticketDetails) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (ticketDetails.status !== 'courier') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        const attachment = ticketDetails.attachment;

        if (!attachment || !attachment.files || attachment.files.length === 0) {
            throw new ErrorHandler('Attachment files not found in the ticket', 404);
        }

        if (!ticketDetails.attachment) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        const pdfFilePath = ticketDetails.attachment.files.find(url => url.endsWith('RVE_Empfangsbestaetigung.pdf'));

        if (!pdfFilePath) {
            throw new ErrorHandler('file not found', 404);
        }

        const { data: pdfBytes } = await axios.get(pdfFilePath, { responseType: 'arraybuffer' });
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const signatureImageBytes = Buffer.from(signatureImage, 'base64');
        // const nameImageBytes = Buffer.from(nameImage, 'base64');

        const signatureImg = await pdfDoc.embedPng(signatureImageBytes);
        // const nameImg = await pdfDoc.embedPng(nameImageBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        firstPage.drawImage(signatureImg, { x: 310, y: 210, width: signatureImg.width / 2, height: signatureImg.height / 6 });
        // firstPage.drawImage(nameImg, {x: 310,y: 165,width: nameImg.width / 2,height: nameImg.height / 8});
        firstPage.drawText(place, { x: 30, y: 210, size: 12, font: font, color: rgb(0, 0, 0) });
        firstPage.drawText(name, { x: 310, y: 165, size: 12, font: font, color: rgb(0, 0, 0) });
        firstPage.drawText(date, { x: 140, y: 500, size: 12, font: font, color: rgb(0, 0, 0) });
        // firstPage.drawText(packageDate, { x: 140, y: 500, size: 12, font: font, color: rgb(0, 0, 0) });
        firstPage.drawText(ticketDetails.parcelLabelAddress.name, { x: 140, y: 420, size: 12, font: font, color: rgb(0, 0, 0) });
        firstPage.drawText(ticketDetails.parcelLabelAddress.address, { x: 140, y: 440, size: 12, font: font, color: rgb(0, 0, 0) });

        const modifiedPdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(modifiedPdfBytes);
        const currentDateTime = format(new Date(), 'yyyyMMdd_HHmmss');
        const s3Filename = `RVE_Empfangsbestaetigung_${ticketDetails?.complainNumber}_${currentDateTime}.pdf`;
        //const s3Filename = `${ticketId}_${Date.now()}.pdf`;
        const pdfLocation = await uploadToS3(pdfBuffer, s3Filename, 'pdfs/acceptedPdf', ticketId);

        ticketDetails.signedoc = { files: [pdfLocation] };
        //ticketDetails.signedoc?.files.push(pdfLocation);
        ticketDetails.status = "preloco";
        ticketDetails.SubStatus = "Customer_Accepted"

        const courierSummary = await DriverCourierSummaryModel.findOne({ courierId: user?._id });
        if (courierSummary) {
            if (courierSummary.ticket.opened > 0) {
                courierSummary.ticket.opened -= 1;
            }
            courierSummary.ticket.complete += 1;
            const deadlineDate = ticketDetails.deadlineDate;
            if (deadlineDate) {
                const currentDate = new Date();
                if (currentDate <= deadlineDate) {
                    courierSummary.ticket.onTime += 1;
                } else {
                    courierSummary.ticket.late += 1;
                }
            }

            await courierSummary.save();
        } else {
            console.log('Courier summary not found for courier ID:', user?._id);
        }


        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const existingCourierLog = await CourierLogModel.findOne({
            courierId: user?._id,
            date: { $gte: startDate, $lt: endDate }
        });

        if (existingCourierLog) {
            existingCourierLog.completed += 1;
            await existingCourierLog.save();
        } else {
            const newCourierLog = new CourierLogModel({
                courierId: user?._id,
                date: startDate,
                assigned: 0,
                completed: 1
            });
            await newCourierLog.save();
        }

        if (ticketDriver) {
            ticketDriver.status = "Customer_Accepted";
            await ticketDriver.save();
        } else {
            throw new ErrorHandler('Ticket driver not found', 404);
        }


        const newTicketAudit = new TicketAudit({
            ticketId: ticketId,
            status: 'preloco',
            descpription: "customer-accepted",
        });

        await Promise.all([ticketDetails.save(), newTicketAudit.save()]);

        sendApiResponse(res, {
            status: true,
            data: { pdfLocation },
            message: "Data added to PDF successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};

export const custometAcceptedPDF = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { ticketId, signatureImage, name, place, packageDate, address, cname }:
            { ticketId: string, signatureImage: string, name: string, place: string, packageDate: string, address: string, cname: string } = req.body;
        const linkId: string = req.query.linkId as string;

        const ticketDetails = await Ticket.findById(ticketId);
        const link = await Link.findOne({ _id: linkId });
        if (!link || !link.active) {
            throw new ErrorHandler('Link is inactive or not found', 404);
        }

        if (!ticketDetails) {
            throw new ErrorHandler('Ticket not found', 404);
        }


        if (ticketDetails?.status === 'courier') {
            const ticketDriver = await TicketDriver.findOne({ ticketId });
            const attachment = ticketDetails.attachment;
            if (!attachment || !attachment.files || attachment.files.length === 0) {
                throw new ErrorHandler('Attachment files not found in the ticket', 404);
            }

            if (!ticketDetails.attachment) {
                throw new ErrorHandler('Ticket not found', 404);
            }

            const pdfFilePath = ticketDetails.attachment.files.find(url => url.endsWith('RVE_Empfangsbestaetigung.pdf'));

            if (!pdfFilePath) {
                throw new ErrorHandler('file not found', 404);
            }

            const { data: pdfBytes } = await axios.get(pdfFilePath, { responseType: 'arraybuffer' });
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const signatureImageBytes = Buffer.from(signatureImage, 'base64');
            const signatureImg = await pdfDoc.embedPng(signatureImageBytes);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            firstPage.drawImage(signatureImg, { x: 310, y: 210, width: signatureImg.width / 2, height: signatureImg.height / 6 });
            firstPage.drawText(place, { x: 30, y: 210, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(name, { x: 310, y: 165, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(packageDate, { x: 140, y: 500, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(cname, { x: 140, y: 440, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(address, { x: 140, y: 420, size: 12, font: font, color: rgb(0, 0, 0) });

            const modifiedPdfBytes = await pdfDoc.save();
            const pdfBuffer = Buffer.from(modifiedPdfBytes);
            const currentDateTime = format(new Date(), 'yyyyMMdd_HHmmss');
            const s3Filename = `RVE_Empfangsbestaetigung_${ticketDetails?.complainNumber}_${currentDateTime}.pdf`;
            const pdfLocation = await uploadToS3(pdfBuffer, s3Filename, 'pdfs/acceptedPdf', ticketId);
            ticketDetails.signedoc = { files: [pdfLocation] };
            ticketDetails.status = "preloco";
            ticketDetails.SubStatus = "Customer_Accepted";
            const courierSummary = await DriverCourierSummaryModel.findOne({ courierId: ticketDriver?.courierId });
            if (courierSummary) {
                if (courierSummary.ticket.opened > 0) {
                    courierSummary.ticket.opened -= 1;
                }
                courierSummary.ticket.complete += 1;
                const deadlineDate = ticketDetails.deadlineDate;
                if (deadlineDate) {
                    const currentDate = new Date();
                    if (currentDate <= deadlineDate) {
                        courierSummary.ticket.onTime += 1;
                    } else {
                        courierSummary.ticket.late += 1;
                    }
                }

                await courierSummary.save();
            } else {
                console.log('Courier summary not found for courier ID:', ticketDriver?.courierId);
            }


            const currentDate = new Date();
            const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

            const existingCourierLog = await CourierLogModel.findOne({
                courierId: ticketDriver?.courierId,
                date: { $gte: startDate, $lt: endDate }
            });

            if (existingCourierLog) {
                existingCourierLog.completed += 1;
                await existingCourierLog.save();
            } else {
                const newCourierLog = new CourierLogModel({
                    courierId: ticketDriver?.courierId,
                    date: startDate,
                    assigned: 0,
                    completed: 1
                });
                await newCourierLog.save();
            }

            if (ticketDriver) {
                ticketDriver.status = "Customer_Accepted";
                await ticketDriver.save();
            } else {
                throw new ErrorHandler('Ticket driver not found', 404);
            }
            const newTicketAudit = new TicketAudit({
                ticketId: ticketId,
                status: 'preloco',
                descpription: "customer-accepted",
            });

            link.active = false;
            await Promise.all([ticketDetails.save(), newTicketAudit.save(), link.save()]);

            sendApiResponse(res, {
                status: true,
                data: { pdfLocation },
                message: "Data added to PDF successfully"
            });

        } else if (ticketDetails.status === 'preloco' || ticketDetails.status === 'loco') {

            const attachment = ticketDetails.attachment;

            if (!attachment || !attachment.files || attachment.files.length === 0) {
                throw new ErrorHandler('Attachment files not found in the ticket', 404);
            }

            if (!ticketDetails.attachment) {
                throw new ErrorHandler('Ticket not found', 404);
            }

            const pdfFilePath = ticketDetails.attachment.files.find(url => url.endsWith('RVE_Empfangsbestaetigung.pdf'));

            if (!pdfFilePath) {
                throw new ErrorHandler('file not found', 404);
            }

            const { data: pdfBytes } = await axios.get(pdfFilePath, { responseType: 'arraybuffer' });
            const pdfDoc = await PDFDocument.load(pdfBytes);
            const signatureImageBytes = Buffer.from(signatureImage, 'base64');
            const signatureImg = await pdfDoc.embedPng(signatureImageBytes);

            const pages = pdfDoc.getPages();
            const firstPage = pages[0];

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            firstPage.drawImage(signatureImg, { x: 310, y: 210, width: signatureImg.width / 2, height: signatureImg.height / 6 });
            firstPage.drawText(place, { x: 30, y: 210, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(name, { x: 310, y: 165, size: 12, font: font, color: rgb(0, 0, 0) });

            firstPage.drawText(packageDate, { x: 140, y: 500, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(cname, { x: 140, y: 440, size: 12, font: font, color: rgb(0, 0, 0) });
            firstPage.drawText(address, { x: 140, y: 420, size: 12, font: font, color: rgb(0, 0, 0) });

            const modifiedPdfBytes = await pdfDoc.save();
            const pdfBuffer = Buffer.from(modifiedPdfBytes);
            const currentDateTime = format(new Date(), 'yyyyMMdd_HHmmss');
            const s3Filename = `RVE_Empfangsbestaetigung_${ticketDetails?.complainNumber}_${currentDateTime}.pdf`;
            const pdfLocation = await uploadToS3(pdfBuffer, s3Filename, 'pdfs/acceptedPdf', ticketId);
            ticketDetails.signedoc = { files: [pdfLocation] };

            link.active = false;
            await Promise.all([ticketDetails.save(), link.save()]);
            sendApiResponse(res, {
                status: true,
                data: { pdfLocation },
                message: "Data added to PDF successfully"
            });
        } else {
            throw new ErrorHandler('Ticket not valid', 400);
        }
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }

}



export const addDataToCustometDeniedPDF = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const { ticketId, description, signatureImage, name, place }:
            { ticketId: string, description: string, signatureImage: string, name: string, place: string } = req.body;
        const ticketDetails = await Ticket.findById(ticketId);
        const ticketDriver = await TicketDriver.findOne({ ticketId });
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

        if (ticketDetails.status !== 'courier') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        const pdfFilePath = ticketDetails.attachment.files.find(url => url.endsWith('Rechtsverbindliche_Erkl%C3%A4rung.pdf'));


        if (!pdfFilePath) {
            throw new ErrorHandler('file not found', 404);
        }

        const { data: pdfBytes } = await axios.get(pdfFilePath, { responseType: 'arraybuffer' });
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const signatureImageBytes = Buffer.from(signatureImage, 'base64');
        // const nameImageBytes = Buffer.from(nameImage, 'base64');

        const signatureImg = await pdfDoc.embedPng(signatureImageBytes);
        // const nameImg = await pdfDoc.embedPng(nameImageBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages[1];

        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        firstPage.drawImage(signatureImg, { x: 310, y: 355, width: signatureImg.width / 2, height: signatureImg.height / 6 });
        // firstPage.drawImage(nameImg, {x: 310,y: 315,width: nameImg.width/2,height: nameImg.height / 10});
        firstPage.drawText(place, { x: 30, y: 355, size: 12, font: font, color: rgb(0, 0, 0) });

        firstPage.drawText(name, { x: 310, y: 315, size: 12, font: font, color: rgb(0, 0, 0) });



        secondPage.drawImage(signatureImg, { x: 310, y: 345, width: signatureImg.width / 2, height: signatureImg.height / 6 });
        // secondPage.drawImage(nameImg, {x: 310,y: 295,width: nameImg.width/2,height: nameImg.height / 10});
        secondPage.drawText(place, { x: 30, y: 345, size: 12, font: font, color: rgb(0, 0, 0) });
        secondPage.drawText(name, { x: 310, y: 295, size: 12, font: font, color: rgb(0, 0, 0) });

        // Split description into lines
        const descriptionLines = splitDescriptionIntoLines(description, 94);

        const lineHeight = 25;
        let currentY = 530;
        for (const line of descriptionLines) {
            secondPage.drawText(line, { x: 30, y: currentY, size: 12, font: font, color: rgb(0, 0, 0) });
            currentY -= lineHeight;
        }


        const modifiedPdfBytes = await pdfDoc.save();
        const pdfBuffer = Buffer.from(modifiedPdfBytes);
        const s3Filename = `Rechtsverbindliche_Erkl%C3%A4rung_${ticketDetails?.complainNumber}.pdf`;
        const pdfLocation = await uploadToS3(pdfBuffer, s3Filename, 'pdfs/deniedPdf', ticketId);
        ticketDetails.signedoc = { files: [pdfLocation] };


        ticketDetails.signedoc = { files: [pdfLocation] };
        ticketDetails.status = "preloco";
        ticketDetails.SubStatus = "Customer_Denied"


        const courierSummary = await DriverCourierSummaryModel.findOne({ courierId: user?._id });
        if (courierSummary) {
            if (courierSummary.ticket.opened > 0) {
                courierSummary.ticket.opened -= 1;
            }
            courierSummary.ticket.complete += 1;
            const deadlineDate = ticketDetails.deadlineDate;
            if (deadlineDate) {
                const currentDate = new Date();
                if (currentDate <= deadlineDate) {
                    courierSummary.ticket.onTime += 1;
                } else {
                    courierSummary.ticket.late += 1;
                }
            }

            await courierSummary.save();
        } else {
            console.log('Courier summary not found for courier ID:', user?._id);
        }



        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const existingCourierLog = await CourierLogModel.findOne({
            courierId: user?._id,
            date: { $gte: startDate, $lt: endDate }
        });

        if (existingCourierLog) {
            existingCourierLog.completed += 1;
            await existingCourierLog.save();
        } else {
            const newCourierLog = new CourierLogModel({
                courierId: user?._id,
                date: startDate,
                assigned: 0,
                completed: 1
            });
            await newCourierLog.save();
        }

        if (ticketDriver) {
            ticketDriver.status = "Customer_Denied";
            await ticketDriver.save();
        } else {
            throw new ErrorHandler('Ticket driver not found', 404);
        }

        const newTicketAudit = new TicketAudit({
            ticketId: ticketId,
            status: 'preloco',
            descpription: description,
        });

        const deniedPdfData = new DeniedPdfModel({
            ticketId: ticketId,
            description: description,
            signatureImage: signatureImage,
            name: name,
            place: place
        });

        await Promise.all([ticketDetails.save(), newTicketAudit.save(), deniedPdfData.save()]);
        sendApiResponse(res, {
            status: true,
            data: { pdfLocation },
            message: "Data added to PDF successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});



export function splitDescriptionIntoLines(description: string, maxLength: number) {
    const words = description.split(' ');
    const lines = [];
    let currentLine = '';
    for (const word of words) {
        if ((currentLine + word).length <= maxLength) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
}