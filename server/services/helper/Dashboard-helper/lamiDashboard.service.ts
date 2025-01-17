import { Request, Response, NextFunction } from "express";
import { addDays, subMonths, subYears, format, subDays, endOfMonth, endOfYear, startOfMonth, startOfYear, endOfDay, startOfDay } from 'date-fns';
import { CatchAsyncError } from "../../../middleware/catchAsyncError";
import { verifyLamiAuthorization } from "../../../middleware/auth";
import { sendApiResponse } from "../../../utils/apiresponse";
import ErrorHandler from "../../../utils/ErrorHandler";
import Ticket from "../../../models/tickets/tickets.model";
import userModel from "../../../models/user.model";
import TicketDriver from "../../../models/tickets/ticketdriver.model";
import CourierLogModel from "../../../models/courierTicketSummery.model";
import TicketAudit, { ITicketAudit } from "../../../models/tickets/ticketsaudit.model";
import LamiLogModel from "../../../models/lamilog.model";
import AnonymousMailModel from "../../../models/tickets/ticketAnnonyous.model";
import TicketInvoice from "../../../models/tickets/ticketInvoice.model";
import TicketInsurance from "../../../models/tickets/ticketInsurance.model";
import mongoose from "mongoose";
import TicketNetLost from "../../../models/tickets/ticketnetlost.model";
import LocoEmailModel from "../../../models/locoEmail.model";

export const getLamiDashboardCardData = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {

    try {
        const user = await verifyLamiAuthorization(req, next);

        // Fetch all tickets and relevant courier data in parallel
        const [ticketList, lamiCourier, annonymous] = await Promise.all([
            Ticket.find({ lamiAdminId: user?._id }),
            userModel.find({ lamiAdminId: user?._id }),
            AnonymousMailModel.find({ lamiAdminId: user?._id })
        ]);

        // Count active and inactive couriers using array methods
        const activeCourier = lamiCourier.filter(courier => courier.status === 'active').length;
        const inactiveCourier = lamiCourier.filter(courier => courier.status === 'inactive').length;

        // Fetch ticket audits for relevant tickets with status 'loco'
        const ticketIds = ticketList.map(ticket => ticket._id);
        const ticketAudits: ITicketAudit[] = await TicketAudit.find({
            ticketId: { $in: ticketIds },
            status: 'loco'
        });

        // Count delayed and on-time completions using array methods
        const ontimecom = ticketAudits.filter(ticketAudit => {
            const ticket = ticketList.find(t => t._id.equals(ticketAudit.ticketId));
            return ticket && (ticketAudit.date <= ticket.deadlineDate) && ['loco', 'locolost', 'locosuccess', 'insurance', 'invoiced', 'insuokay', 'insureject', 'noinsu'].includes(ticket.status);
        }).length;

        const delayed = ticketAudits.filter(ticketAudit => {
            const ticket = ticketList.find(t => t._id.equals(ticketAudit.ticketId));
            return ticket && (ticketAudit.date > ticket.deadlineDate) && ['loco', 'locolost', 'locosuccess', 'insurance', 'invoiced', 'insuokay', 'insureject', 'noinsu'].includes(ticket.status);
        }).length;

        // Count justified, denied, and package lost
        const justified = ticketList.filter(ticket => ticket.SubStatus === 'Customer_Denied').length;
        const denied = ticketList.filter(ticket => ticket.status === 'locolost').length;
        // const packageLost = ticketList.filter(ticket => ticket.status === 'locolost').reduce((acc, ticket) => acc + ticket.amountInDispute, 0);

        const invoiceData = await TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec();
        const insuranceData = await TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec();

        // Map invoices and insurance data by ticketId
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

        let lostAmount = 0;

        ticketList.forEach(ticket => {
            const ticketIdStr = ticket._id.toString();

            switch (ticket.status) {
                case 'noinsu':
                case 'insureject':
                    lostAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
                case 'insuokay':
                    lostAmount += insuranceMap.get(ticketIdStr)?.insuDeductible || 0;
                    break;
            }
        });

        // const packageLost = lostAmount;

        // Count open and completed tickets
        const open = ticketList.filter(ticket => ['new', 'courier', 'preloco'].includes(ticket.status)).length;
        const completed = ticketList.length - open;

        // Count total delayed open tickets
        const currentDate = new Date();
        const totalDelayedOpen = ticketList.filter(ticket => ['new', 'courier', 'preloco'].includes(ticket.status) && ticket.deadlineDate < currentDate).length;

        // Prepare response
        const response = {
            "ticketdata": {
                "open": open,
                "completed": completed,
                "total": ticketList.length
            },
            "ticketcopletion": {
                "delayedTicket": delayed,
                "deleyedOpen": totalDelayedOpen,
                "ontimeComp": ontimecom
            },
            "packagedata": {
                "justified": justified,
                "denied": denied,
                "packageLost": lostAmount.toFixed(2)
            },
            "courierdata": {
                "activeCourier": activeCourier,
                "inactiveCourier": inactiveCourier
            },
            "annonymous": {
                "count": annonymous.length
            }
        };

        sendApiResponse(res, {
            status: true,
            data: response,
            message: "Courier dashboard card data retrieved successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const getLamiDashboardTicketTable = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketList = await Ticket.find({
            lamiAdminId: user?._id,
            'status': 'new'
        })
        .sort({ createdAt: -1 });

        // Check for pending emails with type IN for each ticket
        const modifiedTicketList = await Promise.all(ticketList.map(async (ticket) => {
            const email = await LocoEmailModel.findOne({
                ticketId: ticket._id,
                status: 'pending',
                type: 'IN'
            });

            const hasPendingInEmail = !!email;

            return {
                ...ticket.toObject(),
                hasPendingInEmail
            };
        }));

        sendApiResponse(res, {
            status: true,
            data: modifiedTicketList,
            message: "Courier dashboard ticket data retrieved successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});

export const getLamiDashboardTicketCourier = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const couriers = await userModel.find({ lamiAdminId: user?._id });

        const courierDataPromises = couriers.map(async courier => {
            const ticketData = await TicketDriver.find({ courierId: courier._id });
            let open = 0;
            let closed = 0;

            const ticketIds = ticketData.map(ticket => ticket.ticketId);
            // const tickets = await Ticket.find({ _id: { $in: ticketIds } });

            const [tickets, invoiceData, insuranceData] = await Promise.all([
                Ticket.find({ _id: { $in: ticketIds } }).select('_id status amountInDispute SubStatus').exec(),
                TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
                TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec()
            ]);

            const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
            const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

            let lostAmount = 0;

            tickets.forEach(ticket => {
                const ticketIdStr = ticket._id.toString();
                switch (ticket.status) {
                    case 'courier':
                        open++;
                        break;
                    case 'preloco':
                        closed++;
                    case 'noinsu':
                    case 'insureject':
                        lostAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                        break;
                    case 'insuokay':
                        lostAmount += insuranceMap.get(ticketIdStr)?.insuDeductible || 0;
                }
            });
            return {
                _id: courier._id,
                avatar: courier.avatar,
                name: courier.name,
                designation: courier.designation,
                open: open,
                closed: closed,
                lost: lostAmount
            };
        });

        const courierData = await Promise.all(courierDataPromises);

        sendApiResponse(res, {
            status: true,
            data: courierData,
            message: "Courier dashboard ticket courier retrieved successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


export const getLamiDashboardGraph1 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const { period } = req.query;
        let results: { [key: string]: { open: number; loco: number; success: number; lost: number; } } = {};

        const currentDate = new Date();
        let fromDate;

        if (period === 'days') {
            fromDate = new Date(currentDate);
            fromDate.setDate(currentDate.getDate() - 12);

            for (let date = new Date(currentDate); date >= fromDate; date.setDate(date.getDate() - 1)) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const startDate = startOfDay(date);
                const endDate = endOfDay(date);
                const courierLogs = await LamiLogModel.find({ userId: user?._id, date: { $gte: startDate, $lte: endDate } });

                const openCount = courierLogs.reduce((total, log) => total + log.open, 0);
                const locoCount = courierLogs.reduce((total, log) => total + log.loco, 0);
                const successCount = courierLogs.reduce((total, log) => total + log.locosuccess, 0);
                const lostCount = courierLogs.reduce((total, log) => total + log.locolost, 0);

                results[formattedDate] = { open: openCount, loco: locoCount, success: successCount, lost: lostCount };
            }
        } else if (period === 'months') {
            for (let i = 0; i <= 11; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const startDate = startOfMonth(date);
                const endDate = endOfMonth(date);
                const monthName = format(startDate, 'MMMM');

                const courierLogs = await LamiLogModel.find({ userId: user?._id, date: { $gte: startDate, $lte: endDate } });

                const openCount = courierLogs.reduce((total, log) => total + log.open, 0);
                const locoCount = courierLogs.reduce((total, log) => total + log.loco, 0);
                const successCount = courierLogs.reduce((total, log) => total + log.locosuccess, 0);
                const lostCount = courierLogs.reduce((total, log) => total + log.locolost, 0);

                results[monthName] = { open: openCount, loco: locoCount, success: successCount, lost: lostCount };
            }
        } else if (period === 'years') {
            const currentYear = currentDate.getFullYear();

            for (let i = 0; i <= 5; i++) {
                const year = currentYear - i;
                const startDate = startOfYear(new Date(year, 0, 1));
                const endDate = endOfYear(new Date(year, 11, 31));

                const courierLogs = await LamiLogModel.find({ userId: user?._id, date: { $gte: startDate, $lte: endDate } });

                const openCount = courierLogs.reduce((total, log) => total + log.open, 0);
                const locoCount = courierLogs.reduce((total, log) => total + log.loco, 0);
                const successCount = courierLogs.reduce((total, log) => total + log.locosuccess, 0);
                const lostCount = courierLogs.reduce((total, log) => total + log.locolost, 0);

                results[year.toString()] = { open: openCount, loco: locoCount, success: successCount, lost: lostCount };
            }
        }

        sendApiResponse(res, {
            status: true,
            data: {
                results: Object.entries(results).reverse(),
            },
            message: "Ticket Status Graph Data Retrieved Successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};


export const getLamiDashboardGraph2 = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const { period } = req.query;
        let results: { [key: string]: { assigned: number; completed: number } } = {};
        const couriers = await userModel.find({ lamiAdminId: user?._id });

        const currentDate = new Date();

        if (period === 'days') {
            const eightDaysAgo = new Date();
            eightDaysAgo.setDate(currentDate.getDate() - 8);

            for (let date = new Date(currentDate); date >= eightDaysAgo; date.setDate(date.getDate() - 1)) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const startDate = startOfDay(date);
                const endDate = endOfDay(date);
                const courierLogs = await CourierLogModel.find({ courierId: { $in: couriers.map(courier => courier._id) }, date: { $gte: startDate, $lte: endDate } });
                const assignedCount = courierLogs.reduce((total, log) => total + log.assigned, 0);
                const completedCount = courierLogs.reduce((total, log) => total + log.completed, 0);
                results[formattedDate] = { assigned: assignedCount, completed: completedCount };
            }
        } else if (period === 'month') {
            for (let i = 0; i < 8; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const startDate = startOfMonth(date);
                const endDate = endOfMonth(date);
                const monthName = format(startDate, 'MMMM');
                const courierLogs = await CourierLogModel.find({ courierId: { $in: couriers.map(courier => courier._id) }, date: { $gte: startDate, $lte: endDate } });
                const assignedCount = courierLogs.reduce((total, log) => total + log.assigned, 0);
                const completedCount = courierLogs.reduce((total, log) => total + log.completed, 0);
                results[monthName] = { assigned: assignedCount, completed: completedCount };
            }
        } else if (period === 'year') {
            for (let i = 0; i < 8; i++) {
                const year = currentDate.getFullYear() - i;
                const startDate = startOfYear(new Date(year, 0, 1));
                const endDate = endOfYear(new Date(year, 11, 31));
                const courierLogs = await CourierLogModel.find({ courierId: { $in: couriers.map(courier => courier._id) }, date: { $gte: startDate, $lte: endDate } });
                const assignedCount = courierLogs.reduce((total, log) => total + log.assigned, 0);
                const completedCount = courierLogs.reduce((total, log) => total + log.completed, 0);
                results[year.toString()] = { assigned: assignedCount, completed: completedCount };
            }
        }

        sendApiResponse(res, {
            status: true,
            data: {
                results: Object.entries(results).reverse(),
            },
            message: "Assigned vs. Completed Tickets Graph Data Retrieved Successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};



export const getLamiDashboardGraph3 = CatchAsyncError(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiAuthorization(req, next);
        const ticketsData = await Ticket.find({ lamiAdminId: user?._id });
        const ticketIds = ticketsData.map(ticket => ticket._id);
        const [invoiceData, insuranceData, paidAmounts] = await Promise.all([
            TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec(),
            TicketNetLost.aggregate([
                { $match: { lamiAdminId: new mongoose.Types.ObjectId(user?._id) } },
                { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } }
            ])
        ]);


        const totalPaidAmount = paidAmounts[0]?.totalPaidAmount || 0;

        // Map invoices and insurance data by ticketId
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

        let openAmount = 0;
        let lostAmount = 0;
        let pendingAmount = 0;
        let successAmount = 0;

        ticketsData.forEach(ticket => {
            const ticketIdStr = ticket._id.toString();
            switch (ticket.status) {
                case 'noinsu':
                case 'insureject':
                    lostAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
                case 'insuokay':
                    lostAmount += insuranceMap.get(ticketIdStr)?.insuDeductible || 0;
                    successAmount += insuranceMap.get(ticketIdStr)?.insuTransferAmount || 0;
                    break;
                case 'new':
                case 'courier':
                case 'preloco':
                    openAmount += ticket.amountInDispute || 0;
                    break;
                case 'locosuccess':
                    successAmount += ticket.amountInDispute || 0;
                    break;
                case 'loco':
                case 'locolost':
                    pendingAmount += ticket.amountInDispute || 0;
                    break;
                case 'invoiced':
                case 'insurance':
                    pendingAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
                default:
                    break;
            }
        });
        const totalAmount = (openAmount + lostAmount + pendingAmount + successAmount).toFixed(2);


        sendApiResponse(res, {
            status: true,
            data: {
                openAmount: openAmount.toFixed(2),
                lostAmount: (lostAmount - totalPaidAmount).toFixed(2),
                successAmount: (successAmount + totalPaidAmount).toFixed(2),
                pendingAmount: pendingAmount.toFixed(2),
                totalAmount
            },
            message: "Courier dashboard ticket courier retrieved successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
});


//Service function for assign courier api's


export const courierHistoryService = async (courierId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(courierId)) {
            throw new Error('Invalid courierId');
        }

        // Fetch courier details
        const courierPromise = userModel.findById(courierId).select('_id name designation').exec();

        // Fetch ticket drivers and their corresponding ticket IDs
        const ticketDrivers = await TicketDriver.find({ courierId }).select('ticketId').exec();
        const ticketIds = ticketDrivers.map(ticketDriver => ticketDriver.ticketId);

        // Fetch tickets, invoices, and insurance data concurrently
        const [courier, ticketsData, invoiceData, insuranceData, paidAmounts] = await Promise.all([
            courierPromise,
            Ticket.find({ _id: { $in: ticketIds } }).select('_id status amountInDispute SubStatus').exec(),
            TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec(),
            TicketNetLost.aggregate([
                { $match: { courierId: new mongoose.Types.ObjectId(courierId) } },
                { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } }
            ])
        ]);

        // Extract the total paid amount
        const totalPaidAmount = paidAmounts[0]?.totalPaidAmount || 0;

        // Map invoices and insurance data by ticketId
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

        // Initialize counters
        let open = 0, successAmount = 0, lostAmount = 0, openAmount = 0;
        let returned = 0, customerAccepted = 0, customerDenied = 0, returnedAmount = 0;
        let totalAmount = 0, totalCount = 0;

        // Process tickets data
        ticketsData.forEach(ticket => {
            const ticketIdStr = ticket._id.toString();

            // Calculate amounts based on ticket status
            switch (ticket.status) {
                case 'courier':
                    open++;
                    openAmount += ticket.amountInDispute || 0;
                    break;
                case 'locosuccess':
                    successAmount += ticket.amountInDispute || 0;
                    break;
                case 'noinsu':
                case 'insureject':
                    lostAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
                case 'insuokay':
                    lostAmount += insuranceMap.get(ticketIdStr)?.insuDeductible || 0;
                    successAmount += insuranceMap.get(ticketIdStr)?.insuTransferAmount || 0;
                    break;
                case 'loco':
                case 'locolost':
                case 'preloco':
                    returnedAmount += ticket.amountInDispute || 0;
                    break;
                case 'invoiced':
                case 'insurance':
                    returnedAmount += invoiceMap.get(ticketIdStr)?.finalLostAmmount || 0;
                    break;
            }

            // Calculate counts based on ticket sub-status
            if (ticket.SubStatus) {
                switch (ticket.SubStatus) {
                    case 'Courier_Returned':
                        returned++;
                        break;
                    case 'Customer_Accepted':
                        customerAccepted++;
                        break;
                    case 'Customer_Denied':
                        customerDenied++;
                        break;
                }
            }
        });

        // Calculate total counts and amounts
        totalCount = open + returned + customerAccepted + customerDenied;
        totalAmount = openAmount + successAmount + lostAmount + returnedAmount;

        // Calculate net lost amount
        const netLostAmount = (lostAmount - totalPaidAmount).toFixed(2);

        // Construct response
        const response = {
            _id: courier?._id,
            name: courier?.name,
            routeNo: courier?.designation,
            count: {
                open,
                returned,
                customerAccepted,
                customerDenied,
                total: totalCount,
            },
            value: {
                open: openAmount.toFixed(2),
                success: successAmount.toFixed(2),
                lost: lostAmount.toFixed(2),
                returned: returnedAmount.toFixed(2),
                total: totalAmount.toFixed(2),
            },
            amount: {
                netLost: netLostAmount
            }
        };

        return response;
    } catch (error) {
        throw error;
    }
};
