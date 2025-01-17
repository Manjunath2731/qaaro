import TicketDriver, { ITicketDriver } from "../../../models/tickets/ticketdriver.model";
import Ticket from "../../../models/tickets/tickets.model";
import TicketAudit, { ITicketAudit } from "../../../models/tickets/ticketsaudit.model";
import userModel from "../../../models/user.model";
import ErrorHandler from "../../../utils/ErrorHandler";

//Service function for ticketTracker
export const ticketTackerService = async (userId: string): Promise<any> => {
    try {
        // Fetch tickets belonging to the user
        const ticketList = await Ticket.find({ lamiAdminId: userId });
        const ticketIds = ticketList.map(ticket => ticket._id);

        if (!ticketIds.length) {
            throw new ErrorHandler('No tickets found for this user', 404);
        }

        // Fetch tracking details for all tickets
        const trackingDetails = await TicketAudit.find({ ticketId: { $in: ticketIds } }).sort({ createdAt: -1 });

        if (!trackingDetails.length) {
            throw new ErrorHandler('No tracking details found', 404);
        }

        // Group tracking details by ticketId
        const groupedTrackingDetails: { [ticketId: string]: ITicketAudit[] } = {};
        trackingDetails.forEach(entry => {
            const ticketIdString = entry.ticketId.toString();
            if (!groupedTrackingDetails[ticketIdString]) {
                groupedTrackingDetails[ticketIdString] = [];
            }
            groupedTrackingDetails[ticketIdString].push(entry);
        });

        // Prepare response data
        const responseData = ticketList.map(ticket => {
            const ticketIdString = ticket._id.toString();
            let status = ticket.status;
            if (status === 'locolost') {
                status = 'LOCO LOST';
            } else if (status === 'locosuccess') {
                status = 'LOCO SUCCESS';
            }
            const capitalizedStatus = status.toUpperCase();

            const statusPresence = {
                new: false,
                courier: false,
                preloco: false,
                loco: false,
                locosuccess: false,
                locolost: false,
                invoiced: false,
                noinsu: false,
                insurance: false,
                insuokay: false,
                insureject: false
            };
            groupedTrackingDetails[ticketIdString]?.forEach(entry => {
                statusPresence[entry.status] = true;
            });
            return {
                ticketId: ticketIdString,
                status: capitalizedStatus,
                complaintNumber: ticket.complainNumber,
                statusPresence
            };
        });

        return responseData;
    } catch (e) {
        throw e
    }
};


//Service function for ticketTrackerDetails
export const ticketTackerDetailsService = async (user: any, ticketId: string): Promise<any> => {
    try {

        // Fetch tracking details with selective projection
        const trackingDetails: ITicketAudit[] = await TicketAudit.find({ ticketId }).select('status descpription date');

        if (!trackingDetails || trackingDetails.length === 0) {
            throw new ErrorHandler('Ticket tracking details not found', 404);
        }

        // Fetch ticket data with selective projection
        const ticketData = await Ticket.findById(ticketId).select('complainNumber');

        // Fetch courier data
        const ticketDriver: ITicketDriver | null = await TicketDriver.findOne({ ticketId });
        const courierId = ticketDriver?.courierId;
        const driverData = await userModel.findById(courierId).select('avatar');

        // Initialize status details
        const statusDetails: { [status: string]: { present: boolean; description?: string; date?: Date } } = {
            new: { present: false },
            courier: { present: false },
            preloco: { present: false },
            loco: { present: false },
            locosuccess: { present: false },
            locolost: { present: false },
            invoiced: { present: false },
            noinsu: { present: false },
            insurance: { present: false },
            insuokay: { present: false },
            insureject: { present: false }
        };

        // Populate status details
        trackingDetails.forEach((detail) => {
            if (statusDetails.hasOwnProperty(detail.status)) {
                statusDetails[detail.status].present = true;
                statusDetails[detail.status].description = detail.descpription || '';
                statusDetails[detail.status].date = detail.date;
            }
        });

        // Update responseData with avatar based on status
        let responseData: any = {
            complainNumber: ticketData?.complainNumber,
            statusDetails
        };

        if (statusDetails.courier.present === true) {
            responseData.statusDetails.courier.avatar = driverData?.avatar;
        }

        if (statusDetails.loco.present === true) {
            responseData.statusDetails.loco.avatar = user?.avatar;
        }
        if (statusDetails.locosuccess.present === true) {
            responseData.statusDetails.locosuccess.avatar = user?.avatar;
        }
        if (statusDetails.locolost.present === true) {
            responseData.statusDetails.locolost.avatar = user?.avatar;
        }

        return responseData;
    } catch (e) {
        throw e
    }
};