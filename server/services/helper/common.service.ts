import CourierLogModel from "../../models/courierTicketSummery.model";
import LamiLogModel from "../../models/lamilog.model";


interface ILogUpdateData {
    id: string;
    date: Date;
    open: number;
    loco: number;
    locosuccess: number;
    locolost: number;
}

// Service functions for updating logs
export async function updateLamiLog(logData: ILogUpdateData): Promise<void> {
    const { id, date, open, loco, locosuccess, locolost } = logData;
    const existingLog = await LamiLogModel.findOne({ userId: id, date });
    if (existingLog) {
        existingLog.open += open;
        existingLog.loco += loco;
        existingLog.locosuccess += locosuccess;
        existingLog.locolost += locolost;
        await existingLog.save();
    } else {
        const newLog = new LamiLogModel({
            userId: id,
            date,
            open,
            loco,
            locosuccess,
            locolost
        });
        await newLog.save();
    }
}

export async function updateCourierLog(courierId: string, date: Date, assigned: number): Promise<void> {
    const existingCourierLog = await CourierLogModel.findOne({ courierId, date });
    if (existingCourierLog) {
        existingCourierLog.assigned += assigned;
        await existingCourierLog.save();
    } else {
        const newCourierLog = new CourierLogModel({
            courierId,
            date,
            assigned,
            completed: 0
        });
        await newCourierLog.save();
    }
}
