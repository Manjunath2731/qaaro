import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../../../../middleware/catchAsyncError";
import { verifyAuthorization, verifyLamiAuthorization } from "../../../../middleware/auth";
import ErrorHandler from "../../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../../utils/apiresponse";
import {
    AcceptInsuranceService, ApplyInsuranceService, RejectInsuranceService, UpdateInsuranceService, addTicketService, anonymousDataDelete, anonymousDataToTicket,
    anonymousDataUpdate, assignCourierToTicket, attachInvoiceService, cancelCourierService, createPdf, getAmountService, getAnnonymousdata,
    getInsuranceListService, getInvoiceListService, getTicketDetails, getTicketsListService, getFinalInsurance, getfinalTicket, getlamiReturnDetails, invoiceUpdateService, mailSendServer,
    pdfDataService, returnTicketToCourier, returnTicketToLoCo, updateTicketService,
    dragdropService,
    paidAmountService,
    getPaidAmountService,
    contactCustomerService
} from "../../../../services/helper/ticketHelper.service";
import { IAttachment, IFinalTicketBody, IInsurance, IMailSend, INetLost, IRejectInsurance, ITicketCreationBody, IcreatePdf, IreturnToLocoBody } from "../../../../utils/interface/interface";
import { getemaildata, statusUpdateService } from "../../../../services/helper/lamiHelper.service";
import { Link } from "../../../../models/Link.model";
import Ticket from "../../../../models/tickets/tickets.model";
import { LamiAccountModel } from "../../../../models/LamiAccount.model";

//Controller function for Temporary add ticket
export const addTickets = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const lamiAdminIdId = user?._id;
        const body: ITicketCreationBody = req.body;
        const anonymousId: string = req.query.anonymousId as string;

        const modifiedTicketList = await addTicketService(req.body, lamiAdminIdId, anonymousId);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "tiket_created_successfully",
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for get Ticket List
export const getTicketsList = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const modifiedTicketList = await getTicketsListService(userId);
        sendApiResponse(res, {
            status: true,
            data: modifiedTicketList,
            message: "ticket_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for get Ticket details
export const getTicketsDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;

        const newTicketDriver = await getTicketDetails(ticketId);

        sendApiResponse(res, {
            status: true,
            data: newTicketDriver,
            message: "ticket_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//contoller function for email list
export const emailList = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const ticketId: string = req.query.ticketId as string;
        const emailData = await getemaildata(userId, ticketId);

        sendApiResponse(res, {
            status: true,
            data: emailData,
            message: "email data fetched"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


//contoller function for email status update
export const emailStatusUpdate = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const emailId: string = req.query.emailId as string;

        const status = await statusUpdateService(emailId);

        sendApiResponse(res, {
            status: true,
            data: status,
            message: "email data fetched"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


//Controller function for assign courier
export const assignCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const courierId: string = req.query.courierId as string;
        const description: string = req.body.description;

        const newTicketDriver = await assignCourierToTicket(ticketId, courierId, description);

        sendApiResponse(res, {
            status: true,
            data: newTicketDriver,
            message: "Courier assigned to ticket successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for assign courier
export const reAssignCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const courierId: string = req.query.courierId as string;
        const description: string = req.body.description;

        const newTicketDriver = await returnTicketToCourier(ticketId, courierId, description);

        sendApiResponse(res, {
            status: true,
            data: newTicketDriver,
            message: "Courier re-assigned to ticket successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for re-assign courier
export const cancelCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const CourierId: string = req.query.courierId as string;

        const newTicketDriver = await cancelCourierService(ticketId, CourierId);

        sendApiResponse(res, {
            status: true,
            // data: newTicketDriver,
            message: "Courier canceled successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for return to loco
export const returnToLoCo = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const { description, to, cc, bcc, message, attachment, subject, signature, newsignature }: IreturnToLocoBody = req.body;
        const newAttachment = req.files as Express.Multer.File[];

        const lamiTicketData = await returnTicketToLoCo(lamiUser, ticketId, req.body, newAttachment);
        console.log("req.files", req.files);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Ticket returned to loco successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const mailSend = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const { to, cc, bcc, message, subject, attachment }: IMailSend = req.body;
        const files = req.files as Express.Multer.File[];
        const lamiTicketData = await mailSendServer(lamiUser, ticketId, req.body, files);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'mail_sent_successfull'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for read customer denied pdf data
export const getPdfData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const descpription = await pdfDataService(ticketId);

        sendApiResponse(res, {
            status: true,
            data: { descpription },
            message: 'pdf data fetched'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

// Controller function for creating customer denied PDF data
export const CreateDeniedPdf = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const { description }: IcreatePdf = req.body;

        const ticketPdfData = await createPdf(ticketId, description || "");
        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Denied pdf created'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for ticket finalize
export const finalTicket = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const ticketId: string = req.query.ticketId as string;
        const { status, description }: IFinalTicketBody = req.body;

        const lamiTicketData = await getfinalTicket(userId, ticketId, status, description);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Ticket status updated'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

//Controller function for ticket finalize
export const finalInsurance = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const description: string = req.body.description;

        const lamiTicketData = await getFinalInsurance(ticketId, description);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Ticket status updated'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


//Controller function for Return to loco api's dependent data
export const lamiReturnDetails = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        let ticketId: string = req.query.ticketId as string;
        const lamiTicketData = await getlamiReturnDetails(userId, ticketId);

        sendApiResponse(res, {
            status: true,
            data: lamiTicketData,
            message: 'Ticket data fetched'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

//Controller function for Update Ticket api's dependent data
export const updateTicket = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        let ticketId: string = req.query.ticketId as string;

        const { dpdTicketNumber, complainNumber, packageNumber, claimType, problem,
            amountInDispute, dpdReferenceNumber, packageDetails, sellerDetails, recipientDetails,
            parcelLabelAddress, deadlineDate, locoContacts, subject
        }: ITicketCreationBody = req.body;

        const finalTicket = await updateTicketService(ticketId, req.body);

        sendApiResponse(res, {
            status: true,
            data: finalTicket,
            message: 'Ticket data updated'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const annonymousEmail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const annonymousData = await getAnnonymousdata(userId);

        sendApiResponse(res, {
            status: true,
            data: annonymousData,
            message: "annonymous data fetched"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const annonymousEmailupdate = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        let annonymousId: string = req.query.annonymousId as string;
        const annonymousData = await anonymousDataUpdate(annonymousId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "annonymous data updated"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const annonymousEmailDelete = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        let annonymousId: string = req.query.annonymousId as string;
        const annonymousData = await anonymousDataDelete(annonymousId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "annonymous data deleted"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const attachToTicket = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const annonymousId: string = req.query.annonymousId as string;
        const ticketId: string = req.query.ticketId as string;
        const lamiAdminId = user?._id;

        const annonymousData = await anonymousDataToTicket(annonymousId, ticketId, lamiAdminId);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "annonymous_data_attached"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const attachInvoice = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const body: IAttachment = req.body;
        const attachment = req.files as Express.Multer.File[];

        const attachedInvoiceToTicket = await attachInvoiceService(user?._id, ticketId, req.body, attachment);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "invoice_data_attached"
        });
    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const updateInvoice = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const body: IAttachment = req.body;
        // const attachment = req.files as Express.Multer.File[];

        const invoiceUpdated = await invoiceUpdateService(ticketId, req.body);
        sendApiResponse(res, {
            status: true,
            data: {},
            message: "invoice_data_update"
        });
    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const applyInsurance = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const files = req.files as Express.Multer.File[];
        const { to, cc, bcc, message, subject, notes, attachment }: IMailSend = req.body;
        //const body: IMailSend = req.body;
        const insurance = await ApplyInsuranceService(lamiUser, ticketId, req.body, files);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Insurance_applied_successfull"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const acceptInsurance = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const body: IInsurance = req.body;
        const insurance = await AcceptInsuranceService(lamiUser, ticketId, body);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Insurance_accepted_successfull"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const rejectInsurance = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        // const notes: string = req.body.notes as string;
        const body: IRejectInsurance = req.body;
        const insurance = await RejectInsuranceService(lamiUser, ticketId, body);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Insurance_rejected_successfull"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const updateInsurance = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const lamiUser = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const body: IInsurance = req.body;
        const insurance = await UpdateInsuranceService(ticketId, body);

        sendApiResponse(res, {
            status: true,
            data: {},
            message: "Insurance_updated_successfull"
        });

    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


//Controller function for get Insurance List
export const getInsuranceList = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const insuranceList = await getInsuranceListService(userId);
        sendApiResponse(res, {
            status: true,
            data: insuranceList,
            message: "insurance_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for get Invoice List
export const getInvoiceList = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const invoiceList = await getInvoiceListService(userId);
        sendApiResponse(res, {
            status: true,
            data: invoiceList,
            message: "invoice_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

//Controller function for get Ticket List
export const getAmount = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const invoiceList = await getAmountService(userId);
        sendApiResponse(res, {
            status: true,
            data: invoiceList,
            message: "amount_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for Drag and Drop
export const dragdrop = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketId: string = req.query.ticketId as string;
        const { attachment }: { attachment: string[] } = req.body;
        const dragdrop = await dragdropService(ticketId, attachment);
        sendApiResponse(res, {
            status: true,
            data: dragdrop,
            message: "files_added"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});



//Controller function for Add paid Amount
export const addPaidAmount = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const userId = user?._id;
        const courierId: string = req.query.courierId as string;
        const body: INetLost = req.body;
        const paidAmount = await paidAmountService(userId, courierId, body);
        sendApiResponse(res, {
            status: true,
            data: paidAmount,
            message: "amount_added"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//Controller function for get paid amount
export const getPaidAmount = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        // const userId = user?._id;
        const courierId: string = req.query.courierId as string;
        const paidamount = await getPaidAmountService(user, courierId);
        sendApiResponse(res, {
            status: true,
            data: paidamount,
            message: "amount_fetched"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//contact customer
export const contactCustomer = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyAuthorization(req, next);
        const email: string = req.body.email as string;
        const language: string = req.body.language as string;
        const ticketId: string = req.query.ticketId as string;
        const contact = await contactCustomerService(email, ticketId, language);
        sendApiResponse(res, {
            status: true,
            data: contact,
            message: "Email_sent_successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


//checkLinkStatus
export const checkLinkStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const linkId: string = req.query.linkId as string;
        const link = await Link.findOne({ _id: linkId });

        if (!link) {
            throw new ErrorHandler('Link not found', 404);
        }
        if (link.active && link.expiresAt > new Date()) {
            sendApiResponse(res, {
                status: true,
                data: { linkId, active: true },
                message: 'Link is active',
            });
        } else {
            sendApiResponse(res, {
                status: true,
                data: { linkId, active: false },
                message: 'Link is inactive or expired',
            });
        }
    } catch (e: any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};

export const newTicketDetails = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const ticketId: string = req.query.ticketId as string;
        const ticket = await Ticket.findOne({_id: ticketId});
        sendApiResponse(res, {
            status: true,
            data: {ticket},
            message: 'Ticket_Fetched',
        });
    } catch (e:any) {
        next(new ErrorHandler(e.message, e.statusCode || 500));
    }
}

export const disconnectAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const lamiId: string = req.query.lamiId as string;
        if (!lamiId) {
            throw new ErrorHandler('LamiId is required', 400);
        }

        const account = await LamiAccountModel.findOne({ lamiId });

        if (!account) {
            throw new ErrorHandler('LamiId not valid', 400);
        }

        if (account.connected === true) {
            account.connected = false;
            await account.save();
        }


        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'deactivate',
        });
    } catch (e: any) {
        next(new ErrorHandler(e.message || 'Internal Server Error', e.statusCode || 500));
    }
}