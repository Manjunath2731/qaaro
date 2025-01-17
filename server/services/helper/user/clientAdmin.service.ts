import Company from "../../../models/company/company.model";
import userModel, { UserRole, UserStatus } from "../../../models/user.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import jwt from 'jsonwebtoken';
import { IRegistrationBody, IUpdateUserBody } from "../../../utils/interface/interface"
import { generateRandomPassword } from "../../../utils/randpassword";
import sendMail from "../../../utils/sendMail";
import Ticket from "../../../models/tickets/tickets.model";
import mongoose from "mongoose";
import TicketDriver from "../../../models/tickets/ticketdriver.model";
import TicketInvoice from "../../../models/tickets/ticketInvoice.model";
import TicketInsurance from "../../../models/tickets/ticketInsurance.model";
import TicketNetLost from "../../../models/tickets/ticketnetlost.model";
import { ClientPlanUsage } from "../../../models/subscriptions/subscription.model";


/* 
This is a service function which handles creation of ClientAdmin's
*/
export const createClientAdminService = async (userId: string, body: IRegistrationBody): Promise<any> => {
    try {

        let company = await Company.findOne({ companyName: body.company });
        let companyId: string;
        if (!company) {
            company = await Company.create({ companyName: body.company });
            companyId = company._id;
        } else {
            companyId = company._id;
        }

        const isEmailExists = await userModel.findOne({ email: body.email });
        const isPhoneExists = await userModel.findOne({ mobile: body.mobile })
        if (isEmailExists) {
            throw new ErrorHandler("email_duplicate", 400);
        }
        if (isPhoneExists) {
            throw new ErrorHandler("phone_duplicate", 400);
        }

        const password = generateRandomPassword();

        const newLamiAdmin = new userModel({
            ...body,
            password,
            role: 'Client_Admin',
            company: companyId,
            plugoAdminId: userId,
        });
        const result = await newLamiAdmin.save();
        const resultObject = result.toObject();
        const token = jwt.sign(resultObject, process.env.JWT_SECRET_KEY!);
        try {
            await sendMail({
                email: body.email,
                subject: "Account credentials",
                template: "mailcredentials.ejs",
                data: {
                    newUser: result,
                    UserId: `User Id: ${body.email}`,
                    Password: `Password: ${password}`,
                    language: result.language,
                },
                cc: [],
                bcc: []
            });
        } catch (e: any) {
            throw new ErrorHandler(e.message, 500);
        }
        return result;
    } catch (e) {
        throw e;
    }
}


/* 
This is a service function which handles getting of ClientAdmin's
*/
export const getClientAdminService = async (creatorId: string): Promise<any> => {
    try {
        const clientAdmins = await userModel.find({
            plugoAdminId: creatorId,
            role: "Client_Admin"
        })
            .sort({ updatedAt: -1 })
            .populate('company', 'companyName');

        let currentDate = new Date();

        const result = await Promise.all(clientAdmins.map(async (clientAdmin) => {
            const depoAdmins = await userModel.find({
                clientAdminId: clientAdmin._id,
                role: "Depo_Admin"
            });

            const depoAdminIds = depoAdmins.map(admin => admin._id);

            const lamiAdmins = await userModel.find({
                depoAdminId: { $in: depoAdminIds },
                role: "LaMi_Admin"
            });

            const lamiAdminIds = lamiAdmins.map(admin => admin._id);

            const couriers = await userModel.find({
                lamiAdminId: { $in: lamiAdminIds },
                role: "LaMi_Courier"
            });
            const ticketCount = await Ticket.countDocuments({
                lamiAdminId: { $in: lamiAdminIds }
            });

            const subscription = await ClientPlanUsage.findOne({
                clientId: clientAdmin._id,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
            }).populate('planId', 'planCode duration cost');


            return {
                clientAdmin,
                depoAdminCount: depoAdmins.length,
                lamiAdminCount: lamiAdmins.length,
                courierCount: couriers.length,
                ticketCount,
                currentSubscription: subscription ? {
                    plan: subscription.planId,
                    startDate: subscription.startDate,
                    endDate: subscription.endDate,
                    numOfCouriers: subscription.availableCount
                } : null
            };
        }));

        return result;
    } catch (e: any) {
        throw new ErrorHandler(e.message, 500);
    }
};


/* 
This is a service function which handles update of ClientAdmin's
*/
export const updateClientAdminService = async (clientAdminId: string, updateData: IUpdateUserBody): Promise<any> => {
    try {
        const { company, ...fields } = updateData;
        const user = await userModel.findById(clientAdminId);
        if (!user) {
            throw new ErrorHandler("User not found", 404);
        }
        if (updateData.mobile) {
            const isPhoneExists = await userModel.findOne({ _id: { $ne: clientAdminId }, mobile: updateData.mobile });
            if (isPhoneExists) {
                throw new ErrorHandler("Phone duplicate", 400);
            }
        }

        if (company) {
            let companyEntry = await Company.findOne({ companyName: company });
            if (!companyEntry) {
                companyEntry = await Company.create({ companyName: company });
            }
            user.company = companyEntry._id;
        }

        if (updateData.name) user.name = updateData.name;
        if (updateData.mobile) user.mobile = updateData.mobile;
        if (updateData.address) user.address = updateData.address;
        if (updateData.status) user.status = updateData.status as UserStatus;
        if (updateData.designation) user.designation = updateData.designation;

        await user.save();

        if (updateData.status === UserStatus.INACTIVE) {
            await userModel.updateMany(
                { lamiAdminId: user._id, role: UserRole.CLIENT_ADMIN },
                { status: UserStatus.INACTIVE }
            );
        }

        return user;
    } catch (e) {
        throw e
    }

}


/* 
This is a service function which handles delete of ClientAdmin's or change status from active to inactive
*/
export const deleteClientAdminService = async (clientId: string): Promise<any> => {
    const updatedClientAdmin = await userModel.findByIdAndUpdate(
        clientId,
        { status: UserStatus.INACTIVE },
        { new: true }
    );

    if (!updatedClientAdmin) {
        throw new Error("ClientAdmin not found or could not be updated");
    }

    return updatedClientAdmin;
}


/* 
This is a service function which handles LamiOverView
*/
export const lamiOverViewService = async (lamiId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(lamiId)) {
            throw new Error('Invalid Lami Admin ID');
        }

        const lamiAdmin = await userModel.findById(lamiId);

        // Fetch all couriers under this Lami Admin
        const couriers = await userModel.find({ lamiAdminId: lamiId, role: UserRole.LAMI_COURIER }).exec();

        // Count active and inactive couriers
        let activeCouriers = 0;
        let inactiveCouriers = 0;

        couriers.forEach(courier => {
            if (courier.status === UserStatus.ACTIVE) {
                activeCouriers++;
            } else if (courier.status === UserStatus.INACTIVE) {
                inactiveCouriers++;
            }
        });

        const courierIds = couriers.map(courier => courier._id);

        // Fetch related data for all couriers
        const ticketDrivers = await TicketDriver.find({ courierId: { $in: courierIds } }).select('ticketId').exec();

        const ticketIds = ticketDrivers.map(ticketDriver => ticketDriver.ticketId);


        const [ticketsData, invoiceData, insuranceData, paidAmounts] = await Promise.all([
            Ticket.find({ _id: { $in: ticketIds } }).select('_id status amountInDispute SubStatus courierId').exec(),
            TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec(),
            TicketNetLost.aggregate([
                { $match: { courierId: { $in: courierIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } }
            ]).exec()
        ]);

        // Initialize counters and accumulators
        let open = 0, successAmount = 0, lostAmount = 0, openAmount = 0;
        let returned = 0, customerAccepted = 0, customerDenied = 0, returnedAmount = 0;
        let totalAmount = 0, totalCount = 0;

        // Create maps for invoice and insurance data
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

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

        // Extract the total paid amount (if available)
        const totalPaidAmount = paidAmounts[0]?.totalPaidAmount || 0;
        const netLostAmount = (lostAmount - totalPaidAmount).toFixed(2);

        // Construct response
        const response = {
            _id: lamiAdmin?._id,
            name: lamiAdmin?.name,
            designation: lamiAdmin?.designation,
            activeCouriers,
            inactiveCouriers,
            totalCoureir: couriers.length,
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




export const depoOverViewService = async (depoAdminId: string) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(depoAdminId)) {
            throw new Error('Invalid Depo Admin ID');
        }

        const depoAdmin = await userModel.findById(depoAdminId);

        // Fetch all lamiAdmins under this Depo Admin
        const lamiAdmins = await userModel.find({ depoAdminId: depoAdminId, role: UserRole.LAMI_ADMIN }).exec();

        const lamiId = lamiAdmins.map(lami => lami._id);

        // Fetch all couriers under this Lami Admin
        const couriers = await userModel.find({ lamiAdminId: { $in: lamiId }, role: UserRole.LAMI_COURIER }).exec();

        // Count active and inactive couriers
        let activeLami = 0;
        let inactiveLami = 0;

        lamiAdmins.forEach(lamiAdmin => {
            if (lamiAdmin.status === UserStatus.ACTIVE) {
                activeLami++;
            } else if (lamiAdmin.status === UserStatus.INACTIVE) {
                inactiveLami++;
            }
        });

        const courierIds = couriers.map(courier => courier._id);

        // Fetch related data for all couriers
        const ticketDrivers = await TicketDriver.find({ courierId: { $in: courierIds } }).select('ticketId').exec();

        const ticketIds = ticketDrivers.map(ticketDriver => ticketDriver.ticketId);

        const [ticketsData, invoiceData, insuranceData, paidAmounts] = await Promise.all([
            Ticket.find({ _id: { $in: ticketIds } }).select('_id status amountInDispute SubStatus courierId').exec(),
            TicketInvoice.find({ ticketId: { $in: ticketIds } }).select('ticketId finalLostAmmount').exec(),
            TicketInsurance.find({ ticketId: { $in: ticketIds } }).select('ticketId insuDeductible insuTransferAmount').exec(),
            TicketNetLost.aggregate([
                { $match: { courierId: { $in: courierIds.map(id => new mongoose.Types.ObjectId(id)) } } },
                { $group: { _id: null, totalPaidAmount: { $sum: "$paidAmount" } } }
            ]).exec()
        ]);

        // Initialize counters and accumulators
        let open = 0, successAmount = 0, lostAmount = 0, openAmount = 0;
        let returned = 0, customerAccepted = 0, customerDenied = 0, returnedAmount = 0;
        let totalAmount = 0, totalCount = 0;

        // Create maps for invoice and insurance data
        const invoiceMap = new Map(invoiceData.map(invoice => [invoice.ticketId.toString(), invoice]));
        const insuranceMap = new Map(insuranceData.map(insurance => [insurance.ticketId.toString(), insurance]));

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

        // Extract the total paid amount (if available)
        const totalPaidAmount = paidAmounts[0]?.totalPaidAmount || 0;
        const netLostAmount = (lostAmount - totalPaidAmount).toFixed(2);

        // Construct response
        const response = {
            _id: depoAdmin?._id,
            name: depoAdmin?.name,
            designation: depoAdmin?.designation,
            totalLami: lamiAdmins.length,
            activeLami,
            inactiveLami,
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