import mongoose, { Schema,Model, Document } from 'mongoose';

interface TicketObject {
    opened: number;
    complete: number;
    lostAmount: number;
    onTime: number;
    late: number;
}

interface DriverCourierSummary extends Document {
    courierId: mongoose.Types.ObjectId;
    ticket: TicketObject;
    completed: Number;
}

const TicketObjectSchema = new Schema<TicketObject>({
    opened: { type: Number, default: 0 },
    complete: { type: Number, default: 0 },
    lostAmount: { type: Number, default: 0 },
    onTime: { type: Number, default: 0 },
    late: { type: Number, default: 0 }
});

const DriverCourierSummarySchema = new Schema<DriverCourierSummary>({
    courierId: { type: Schema.Types.ObjectId, ref: 'TicketDriver', required: true },
    ticket: { type: TicketObjectSchema, required: true },
    completed: { type: Number, default: 0 }
});



const DriverCourierSummaryModel: Model<DriverCourierSummary> = mongoose.model("DriverCourierSummary", DriverCourierSummarySchema);
//const DriverCourierSummaryModel = mongoose.model<DriverCourierSummary>('DriverCourierSummary', DriverCourierSummarySchema);

export default DriverCourierSummaryModel;