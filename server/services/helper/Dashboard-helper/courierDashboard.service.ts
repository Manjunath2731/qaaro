import { startOfDay, endOfDay, startOfMonth, endOfMonth, startOfYear, endOfYear, format } from 'date-fns';
import { Request, Response, NextFunction } from "express";
import { verifyLamiCourierAuthorization } from "../../../middleware/auth";
import DriverCourierSummaryModel from "../../../models/courierSummary.model";
import CourierLogModel from "../../../models/courierTicketSummery.model";
import TicketDriver from "../../../models/tickets/ticketdriver.model";
import Ticket from "../../../models/tickets/tickets.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import { sendApiResponse } from "../../../utils/apiresponse";
import TicketInvoice from '../../../models/tickets/ticketInvoice.model';
import TicketInsurance from '../../../models/tickets/ticketInsurance.model';
import mongoose from 'mongoose';
import TicketNetLost from '../../../models/tickets/ticketnetlost.model';
import { CatchAsyncError } from '../../../middleware/catchAsyncError';

export const getCourierDashboardCardData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const tickets = await TicketDriver.find({ courierId: user?._id });
        const ticketIds = tickets.map(ticket => ticket.ticketId);

        const [newTicketsData, allTicketsData, courierSummary] = await Promise.all([
            Ticket.find({ _id: { $in: ticketIds }, status: 'new' }),
            Ticket.find({ _id: { $in: ticketIds } }),
            DriverCourierSummaryModel.findOne({ courierId: user?._id })
        ]);

        let within24Hours = 0;
        let within48Hours = 0;
        let within3Days = 0;
        let totalDelayedOpen = 0;
        let justified = 0;
        let denied = 0;
        let packageLost = 0;

        const currentDate = new Date();

        allTicketsData.forEach(ticket => {
            const diffInMs = new Date(ticket.deadlineDate).getTime() - currentDate.getTime();
            const diffInHours = Math.ceil(diffInMs / (1000 * 60 * 60) + 24);
            if (ticket.status === 'courier') {
                if (diffInHours <= 24) {
                    within24Hours++;
                } else if (diffInHours <= 48) {
                    within48Hours++;
                } else if (diffInHours <= 72) {
                    within3Days++;
                }
            }

            if (ticket.SubStatus === 'Customer_Denied') {
                justified++;
            } else if (ticket.status === 'locolost') {
                denied++;
                packageLost += ticket.amountInDispute || 0;
            }
        });

        totalDelayedOpen = newTicketsData.reduce((acc, ticket) => {
            if (ticket.status === 'new' && ticket.deadlineDate < currentDate) {
                return acc + 1;
            }
            return acc;
        }, 0);

        const totalOpened = courierSummary?.ticket.opened || 0;
        const totalClosed = courierSummary?.ticket.complete || 0;
        const totalTickets = totalOpened + totalClosed;

        const totalDelayed = courierSummary?.ticket.late || 0;
        const totalOnTime = courierSummary?.ticket.onTime || 0;

        const responseData = {
            fitstcard: {
                opened: totalOpened,
                closed: totalClosed,
                total: totalTickets
            },
            secondcard: {
                onTime: totalOnTime,
                delayedOpen: totalDelayedOpen,
                delayed: totalDelayed
            },
            thirdcard: {
                justified: justified,
                denied: denied,
                packageLost: packageLost
            },
            fourthcard: {
                "hours24": within24Hours,
                "hours48": within48Hours,
                "days3": within3Days
            }
        };

        sendApiResponse(res, {
            status: true,
            data: responseData,
            message: "Courier dashboard card data retrieved successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};


export const getOpenedTicketsData = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const tickets = await TicketDriver.find({ courierId: user?._id, status: 'open' });

        const ticketIds = tickets.map(ticket => ticket.ticketId);

        const ticketsData = await Ticket.find({ _id: { $in: ticketIds } });

        const responseData = ticketsData.map(ticket => ({
            id: ticket._id,
            complainNumber: ticket.complainNumber,
            packageNumber: ticket.packageNumber,
            claimType: ticket.claimType,
            problem: ticket.problem,
            amountInDispute: ticket.amountInDispute,
            deadlineDate: ticket.deadlineDate,
            status: tickets.find(driver => driver.ticketId.equals(ticket._id))?.status
        }));

        sendApiResponse(res, {
            status: true,
            data: responseData,
            message: "Opened tickets data retrieved successfully"
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};


export const getGraphFirst = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        const { period } = req.query;
        let results: { [key: string]: { assigned: number; completed: number } } = {};

        const currentDate = new Date();

        if (period === 'days') {
            const eightDaysAgo = new Date();
            eightDaysAgo.setDate(currentDate.getDate() - 12);

            for (let date = new Date(currentDate); date >= eightDaysAgo; date.setDate(date.getDate() - 1)) {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const startDate = startOfDay(date);
                const endDate = endOfDay(date);
                const courierLogs = await CourierLogModel.find({ courierId: user?._id, date: { $gte: startDate, $lte: endDate } });
                const assignedCount = courierLogs.reduce((total, log) => total + log.assigned, 0);
                const completedCount = courierLogs.reduce((total, log) => total + log.completed, 0);
                results[formattedDate] = { assigned: assignedCount, completed: completedCount };
            }
        } else if (period === 'month') {
            for (let i = 0; i <= 11; i++) {
                const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
                const startDate = startOfMonth(date);
                const endDate = endOfMonth(date);
                const monthName = format(startDate, 'MMMM');

                const courierLogs = await CourierLogModel.find({ courierId: user?._id, date: { $gte: startDate, $lte: endDate } });

                const assignedCount = courierLogs.reduce((total, log) => total + log.assigned, 0);
                const completedCount = courierLogs.reduce((total, log) => total + log.completed, 0);
                results[monthName] = { assigned: assignedCount, completed: completedCount };
            }
        } else if (period === 'year') {
            const currentYear = currentDate.getFullYear();

            for (let i = 0; i <= 5; i++) {
                const year = currentYear - i;
                const startDate = startOfYear(new Date(year, 0, 1));
                const endDate = endOfYear(new Date(year, 11, 31));

                const courierLogs = await CourierLogModel.find({ courierId: user?._id, date: { $gte: startDate, $lte: endDate } });

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

export const getGraphSecond = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await verifyLamiCourierAuthorization(req, next);
        // Fetch ticket drivers and their corresponding ticket IDs
        if (!mongoose.Types.ObjectId.isValid(user?._id)) {
            throw new Error('Invalid courierId');
        }
        const ticketDrivers = await TicketDriver.find({ courierId: user?._id }).select('ticketId').exec();
        const ticketIds = ticketDrivers.map(ticketDriver => ticketDriver.ticketId);

        // Fetch tickets, invoices, and insurance data concurrently
        const [ticketsData, invoiceData, insuranceData, paidAmounts] = await Promise.all([
            Ticket.find({ _id: { $in: ticketIds } }).select('_id status amountInDispute SubStatus').exec(),
            TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible').exec(),
            TicketNetLost.aggregate([
                { $match: { courierId: new mongoose.Types.ObjectId(user?._id) } },
                { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } }
            ])
        ]);

        // Extract the total paid amount
        const totalPaidAmount = paidAmounts[0]?.totalPaidAmount || 0;

        // Map invoices and insurance data by ticketId
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

        // Initialize counters
        let successAmount = 0, lostAmount = 0, openAmount = 0, returnedAmount = 0;
        let totalAmount = 0

        // Process tickets data
        ticketsData.forEach(ticket => {
            const ticketIdStr = ticket._id.toString();

            // Calculate amounts based on ticket status
            switch (ticket.status) {
                case 'courier':
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
        });

        // Calculate total counts and amounts
        totalAmount = openAmount + successAmount + lostAmount + returnedAmount;
        const netLostAmount = (lostAmount - totalPaidAmount).toFixed(2);

        // Construct response
        const response = {
            open: openAmount.toFixed(2),
            success: successAmount.toFixed(2),
            lost: lostAmount.toFixed(2),
            returned: returnedAmount.toFixed(2),
            total: totalAmount.toFixed(2),
            amount: {
                netLost: netLostAmount
            }
        };

        sendApiResponse(res, {
            status: true,
            data: response,
            message: "Percentage of ticket statuses retrieved successfully"
        });

    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode || 500));
    }
};

export const getUpCommingTickets = async (userId: string) => {
    try {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

        const tickets = await TicketDriver.find({
            courierId: userId,
            status: { $in: ['open', 're-open'] }
        });

        const ticketIds = tickets.map(ticket => ticket.ticketId);

        const ticketsData = await Ticket.find({
            _id: { $in: ticketIds },
            deadlineDate: { $lte: threeDaysFromNow }
        });

        return ticketsData;
    } catch (e: any) {
        throw e;
    }
};

export const getTicketStatusCounts = async (courierId: string) => {
    try {
        const openAndReopenCount = await TicketDriver.countDocuments({ courierId, status: { $in: ['open', 're-open'] } });
        const customerAcceptedCount = await TicketDriver.countDocuments({ courierId, status: 'Customer_Accepted' });
        const customerDeniedCount = await TicketDriver.countDocuments({ courierId, status: 'Customer_Denied' });
        const courierReturnedCount = await TicketDriver.countDocuments({ courierId, status: 'Courier_Returned' });
        const successCount = await TicketDriver.countDocuments({ courierId, status: 'success' });
        const lostCount = await TicketDriver.countDocuments({ courierId, status: 'lost' });
        const totalReturnedCount = customerAcceptedCount + customerDeniedCount + courierReturnedCount;

        return {
            openAndReopen: openAndReopenCount,
            returned: {
                customerAccepted: customerAcceptedCount,
                customerDenied: customerDeniedCount,
                courierReturned: courierReturnedCount,
                total: totalReturnedCount
            },
            success: successCount,
            lost: lostCount
        };
    } catch (e: any) {
        throw e;
    }
};