import mongoose, { Schema, Model, Document } from 'mongoose';

interface LamiLog extends Document {
    userId: mongoose.Types.ObjectId;
    date: Date;
    open: number;
    loco: number;
    locosuccess: number;
    locolost: number;
}

const LamiLogSchema = new Schema<LamiLog>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    open: { type: Number, default: 0 },
    loco: { type: Number, default: 0 },
    locosuccess: {type: Number, default: 0},
    locolost: {type: Number, default: 0}
});

const LamiLogModel: Model<LamiLog> = mongoose.model("LamiLog", LamiLogSchema);

export default LamiLogModel;