import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import ErrorHandler from "../../../utils/ErrorHandler";
import { verifyLamiCourierAuthorization } from "../../../middleware/auth";
import { sendApiResponse } from "../../../utils/apiresponse";
import { getCourierTicketsDetailsService, getCourierTicketsService, returnToLaMiService } from "../../../services/helper/lamiCourier.service";
import { IUpdateUserDataBody } from "../../../utils/interface/interface";


//Controller function for get all tickets of that courier
export const getCourierTickets = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const userId = user?._id;
        const courierTicketsWithStatus = await getCourierTicketsService(userId);

        sendApiResponse(res, {
            status: true,
            data: courierTicketsWithStatus,
            message: "tiket_fetched_successfully",
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for get ticket details of that courier
export const getCourierTicketsDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        let ticketId: string = req.query.ticketId as string;
        const ticketDetailsWithStatus = await getCourierTicketsDetailsService(ticketId);

        sendApiResponse(res, {
            status: true,
            data: ticketDetailsWithStatus,
            message: "Ticket data fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for returnToLaMi
export const returnToLaMi = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const { description }: IUpdateUserDataBody = req.body;       
        const files = req.files as Express.Multer.File[];
        const returntolami = await returnToLaMiService(ticketId, req.body, files);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Ticket status updated to loco successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});