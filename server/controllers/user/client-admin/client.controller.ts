import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import ErrorHandler from "../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../utils/apiresponse";
import { verifyAuthorization, verifyPlugoAuthorization } from "../../../middleware/auth";
import { createClientAdminService, deleteClientAdminService, depoOverViewService, getClientAdminService, lamiOverViewService, updateClientAdminService } from "../../../services/helper/user/clientAdmin.service";
import { IDeleteUserBody, IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface";

/*
    This is controller function handles creation of clientAdmin, 
    Client_Admin comes after Main Admin
*/
export const createClientAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const { name, email, mobile, address, company: companyName,
            language, designation, state, country, zipcode }: IRegistrationBody = req.body;

        const clientAdmin = await createClientAdminService(pluggoUser?._id, req.body);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "clientAdmin_created",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


/*
    This is controller function handles get of clientAdmin,
*/
export const getAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const clientAdmin = await getClientAdminService(pluggoUser?._id);
        sendApiResponse(res, {
            status: true,
            data: clientAdmin,
            message: "clientAdmin_fetched",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

/*
    This is controller function handles update of clientAdmin,
*/
export const updateClientAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        // const userId = pluggoUser?._id;
        const { name, mobile, address, company: companyName, designation }: IUpdateUserBody = req.body;
        const clientId: string = req.query.clientId as string;
        const clientAdmin = await updateClientAdminService( clientId, req.body);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "clientAdmin_updated",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

/*
    This is controller function handles delete of clientAdmin,
*/
export const deleteClientAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pluggoUser = await verifyPlugoAuthorization(req, next);
        const clientId: string = req.query.clientId as string;
        const clientAdmin = await deleteClientAdminService(clientId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "clientAdmin_deleted",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

/* 
    This controller function handles sp overview
*/

export const lamiAdminOverView = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const lamiId: string = req.query.lamiId as string;
        const lamiOverView = await lamiOverViewService(lamiId);
        sendApiResponse(res, {
            status: true,
            data: lamiOverView,
            message: "lami_overview",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


/* 
    This controller function handles depo overview
*/

export const depoAdminOverView = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const depoAdminId: string = req.query.depoAdminId as string;
        const depoOverView = await depoOverViewService(depoAdminId);
        sendApiResponse(res, {
            status: true,
            data: depoOverView,
            message: "depo_overview",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});