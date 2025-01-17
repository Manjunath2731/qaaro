import { Request, Response, NextFunction } from "express";
import * as CourierService from '../../../../services/helper/Dashboard-helper/courierDashboard.service';
import { CatchAsyncError } from "../../../../middleware/catchAsyncError";
import { verifyLamiCourierAuthorization } from "../../../../middleware/auth";
import { sendApiResponse } from "../../../../utils/apiresponse";

export const courierDashboardCardData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await CourierService.getCourierDashboardCardData(req, res, next);
    } catch (error) {
        next(error);
    }
});

export const openedTicketsData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await CourierService.getOpenedTicketsData(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const graphfirst = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await CourierService.getGraphFirst(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const graphSecond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await CourierService.getGraphSecond(req, res, next);
    } catch (error) {
        next(error);
    }
};

export const upCommingTickets = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const Tickets = await CourierService.getUpCommingTickets(user?._id);
        sendApiResponse(res, {
            status: true,
            data: { Tickets },
            message: "ticket_fetched"
        });
    } catch (e: any) {
        next(e)
    }
});

export const ticketStatusCounts = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const counts = await CourierService.getTicketStatusCounts(user?._id);
        sendApiResponse(res, {
            status: true,
            data: counts,
            message: "ticket_status_counts_fetched"
        });
    } catch (e: any) {
        next(e);
    }
});