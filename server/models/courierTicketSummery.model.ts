import mongoose, { Schema, Model, Document } from 'mongoose';

interface CourierLog extends Document {
    courierId: mongoose.Types.ObjectId;
    date: Date;
    assigned: number;
    completed: number;
}

const CourierLogSchema = new Schema<CourierLog>({
    courierId: { type: Schema.Types.ObjectId, ref: 'TicketDriver', required: true },
    date: { type: Date, required: true },
    assigned: { type: Number, default: 0 },
    completed: { type: Number, default: 0 }
});

//const CourierLogModel = mongoose.model<CourierLog>('CourierLog', CourierLogSchema);
const CourierLogModel: Model<CourierLog> = mongoose.model("CourierLog", CourierLogSchema);

export default CourierLogModel;