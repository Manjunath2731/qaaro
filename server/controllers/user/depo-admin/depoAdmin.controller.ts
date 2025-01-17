import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import ErrorHandler from "../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../utils/apiresponse";
import { verifyAuthorization, verifyPlugoAuthorization } from "../../../middleware/auth";
import { createDepoAdminService, deleteDepoAdminService, getDepoAdminService, updateDepoAdminService } from "../../../services/helper/user/depoAdmin.service";
import { IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface";

/*
    This is controller function handles creation of DepoAdmin, 
    DepoAdmin comes after Client_Admin
*/
export const createDepoAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const pluggoUser = await verifyPlugoAuthorization(req, next);
        const user = await verifyAuthorization(req, next);
        const clientId: string | undefined = req.query.clientId as string | undefined;
        const {
            name,
            email,
            mobile,
            address,
            language,
            designation,
            state,
            country,
            zipcode
        }: IRegistrationBody = req.body;
        
        const depoAdmin = await createDepoAdminService(req.body, user, clientId);
        
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "depoAdmin_created",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


/*
    This is controller function handles get of DepoAdmin,
*/
export const getDepoAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const pluggoUser = await verifyPlugoAuthorization(req, next);
        const user = await verifyAuthorization(req, next);
        const clientId: string | undefined = req.query.clientId as string | undefined;
        
        const clientAdmin = await getDepoAdminService(user, clientId);
        sendApiResponse(res, {
            status: true,
            data: clientAdmin,
            message: "depoAdmin_fetched",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

/*
    This is controller function handles update of DepoAdmin,
*/
export const updateDepoAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const pluggoUser = await verifyPlugoAuthorization(req, next);
        const user = await verifyAuthorization(req, next);
        const { name, mobile, address, designation, status }: IUpdateUserBody = req.body;
        const depoAdminId: string = req.query.depoAdminId as string;
        const clientAdmin = await updateDepoAdminService(depoAdminId, req.body);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "depoAdmin_updated",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

/*
    This is controller function handles delete of DepoAdmin,
*/
export const deleteDepoAdmin = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        //const pluggoUser = await verifyPlugoAuthorization(req, next);
        const user = await verifyAuthorization(req, next);
        const depoAdminId: string = req.query.depoAdminId as string;
        const clientAdmin = await deleteDepoAdminService(depoAdminId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "depoAdmin_deleted",
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});