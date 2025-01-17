import { Request, Response, NextFunction } from "express";
import { verifyLamiAuthorization } from "../../../../middleware/auth";
import { CatchAsyncError } from "../../../../middleware/catchAsyncError";
import Ticket, { ITicket } from "../../../../models/tickets/tickets.model";
import TicketAudit, { ITicketAudit } from "../../../../models/tickets/ticketsaudit.model";
import ErrorHandler from "../../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../../utils/apiresponse";
import TicketDriver, { ITicketDriver } from "../../../../models/tickets/ticketdriver.model";
import userModel from "../../../../models/user.model";
import { ticketTackerDetailsService, ticketTackerService } from "../../../../services/helper/Tracker/tracker.service";


//Controller function for ticketTracker
export const ticketTracker = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const responseData = await ticketTackerService(userId);
        sendApiResponse(res, {
            status: true,
            data: responseData,
            message: 'Ticket tracking details retrieved successfully'
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for ticketTrackerDetails
export const ticketTrackerDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId = req.query.ticketId as string;
        const responseData = await ticketTackerDetailsService(user, ticketId);

        // Send API response
        sendApiResponse(res, {
            status: true,
            data: responseData,
            message: 'Ticket tracking details retrieved successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});