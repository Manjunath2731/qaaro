import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../../middleware/catchAsyncError";
import * as lamiDashboardService from '../../../../services/helper/Dashboard-helper/lamiDashboard.service';
import { verifyAuthorization, verifyLamiAuthorization } from "../../../../middleware/auth";
import { sendApiResponse } from "../../../../utils/apiresponse";
import ErrorHandler from "../../../../utils/ErrorHandler";
import { getCourierHistory } from "../../../../services/helper/lamiHelper.service";
import { courierHistoryService } from "../../../../services/helper/Dashboard-helper/lamiDashboard.service";


//Controller function for lami-dashboard cards
export const lamiDashboardCardData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardCardData(req, res, next);
    } catch (e: any) {
        next(e);
    }
});


//Controller function for lami-dashboard ticket table
export const lamiDashboardTicketTable = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardTicketTable(req, res, next);
    } catch (e: any) {
        next(e);
    }
});

//Controller function for lami-dashboard ticket table
export const lamiDashboardTicketCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardTicketCourier(req, res, next);
    } catch (e: any) {
        next(e);
    }
});


//Controller function for lami-dashboard graph ticket table
// <----------------------------------------------start---------------------------------------------------------------------->
export const lamiDashboardGraph1 = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardGraph1(req, res, next);
    } catch (e: any) {
        next(e)
    }
});

export const lamiDashboardGraph2 = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardGraph2(req, res, next);
    } catch (e: any) {
        next(e)
    }
});

export const lamiDashboardGraph3 = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        await lamiDashboardService.getLamiDashboardGraph3(req, res, next);
    } catch (e: any) {
        next(e)
    }
});

// <----------------------------------------------End---------------------------------------------------------------------->

// Controller function for courier history
export const courierHistory = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;

        const courierData = await getCourierHistory(userId);

        sendApiResponse(res, {
            status: true,
            data: courierData,
            message: "Courier dashboard ticket courier retrieved successfully"
        });
    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

// Controller function for courier history Details
export const courierHistoryDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {   
        const user = await verifyAuthorization(req, next);
        const courierId: string = req.query.courierId as string;
        const courierDetails = await courierHistoryService(courierId);

        sendApiResponse(res, {
            status: true,
            data: courierDetails,
            message: "Courier details fetched"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});