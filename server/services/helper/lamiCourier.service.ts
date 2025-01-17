import DriverCourierSummaryModel from "../../models/courierSummary.model";
import CourierLogModel from "../../models/courierTicketSummery.model";
import TicketDriver from "../../models/tickets/ticketdriver.model";
import Ticket from "../../models/tickets/tickets.model";
import TicketAudit from "../../models/tickets/ticketsaudit.model";
import ErrorHandler from "../../utils/ErrorHandler";
import { uploadToS3 } from "../../utils/s3Utils";

//Service function for get all tickets of that courier
export const getCourierTicketsService = async (userId: string): Promise<any> => {
    try {
        const tickets = await TicketDriver.find({ courierId: userId });
        const ticketIds = tickets.map(ticket => ticket.ticketId);

        const courierTickets = await Ticket.find({ _id: { $in: ticketIds } })
            .select('-dpdTicketNumber -dpdReferenceNumber -packageDetails -recipientDetails -parcelLabelAddress -locoContacts -attachment -updatedAt -sellerDetails -SubStatus -returnDescCouri -returnDescLami -__v')
            .sort({ deadlineDate: -1 });


        const courierTicketsWithStatus = courierTickets.map(ticket => {
            const ticketDriver = tickets.find(t => t.ticketId.toString() === ticket._id.toString());
            if (ticketDriver) {
                ticket.status = ticketDriver.status.replace(/_/g, ' ').toUpperCase();
            }
            return ticket;
        });

        return courierTicketsWithStatus;
    } catch (error) {
        throw new Error("Failed to get ticket list");
    }
};

//Service function for get all tickets of that courier
export const getCourierTicketsDetailsService = async (ticketId: string): Promise<any> => {
    try {

        const ticketDetails = await Ticket.findById(ticketId);

        if (!ticketDetails) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        const ticketDriver = await TicketDriver.findOne({ ticketId });
        const status = ticketDriver ? ticketDriver.status.replace(/_/g, ' ').toUpperCase() : '';
        const description = ticketDriver?.description;
        const ticketDetailsWithStatus = {
            ...ticketDetails.toObject(),
            status,
            description
        };

        return ticketDetailsWithStatus;
    } catch (e) {
        throw new Error("Failed to get ticket details");
    }
};

//Service function for return to lami from courier
export const returnToLaMiService = async (ticketId: string, body: any, files: any): Promise<any> => {
    try {
        const updatedTicket = await Ticket.findById(ticketId);

        if (!updatedTicket) {
            throw new ErrorHandler('Ticket not found', 404);
        }

        if (updatedTicket.status !== 'courier') {
            throw new ErrorHandler('Ticket not valid', 400);
        }

        const newTicketDriver = await TicketDriver.findOne({ ticketId: ticketId });
        if (!newTicketDriver) {
            throw new ErrorHandler('Ticket Driver Not Found', 404);
        }


        updatedTicket.status = 'preloco';
        updatedTicket.SubStatus = 'Courier_Returned';
        updatedTicket.returnDescCouri = body.description;
        newTicketDriver.status = 'Courier_Returned';

        const newTicketAudit = new TicketAudit({
            ticketId: ticketId,
            status: 'preloco',
            descpription: body.description
        });

        if (files) {
            if (!updatedTicket.signedoc) {
                updatedTicket.signedoc = { files: [] };
            }

            for (const file of files) {
                const fileBuffer = Buffer.from(file.buffer);
                const s3Url = await uploadToS3(fileBuffer, file.originalname, 'pdf', ticketId);

                // updatedTicket.signedoc = { files: [s3Url] };
                updatedTicket.signedoc.files.push(s3Url);
            }
        }

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

        const existingCourierLog = await CourierLogModel.findOne({
            courierId: newTicketDriver.courierId,
            date: { $gte: startDate, $lt: endDate }
        });

        if (existingCourierLog) {
            existingCourierLog.completed += 1;
            await existingCourierLog.save();
        } else {
            const newCourierLog = new CourierLogModel({
                courierId: newTicketDriver.courierId,
                date: startDate,
                assigned: 0,
                completed: 1
            });
            await newCourierLog.save();
        }

        const courierSummary = await DriverCourierSummaryModel.findOne({ courierId: newTicketDriver.courierId });
        if (courierSummary) {
            if (courierSummary.ticket.opened > 0) {
                courierSummary.ticket.opened -= 1;
            }
            courierSummary.ticket.complete += 1;
            const deadlineDate = updatedTicket.deadlineDate;
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
            console.log('Courier summary not found for courier ID:', newTicketDriver.courierId);
        }

        await Promise.all([updatedTicket.save(), newTicketAudit.save(), newTicketDriver.save()]);
    } catch (e) {
        throw e
    }
};