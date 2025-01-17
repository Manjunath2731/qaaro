import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketNetLost extends Document {
    lamiAdminId: mongoose.Types.ObjectId;
    courierId: mongoose.Types.ObjectId;
    date: Date;
    paidAmount: number;
}

const TicketNetLostSchema = new Schema<ITicketNetLost>({
    lamiAdminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    courierId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date : {
        type: Date,
        required: true
    },
    paidAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const TicketNetLost = mongoose.model<ITicketNetLost>('TicketNetLost', TicketNetLostSchema);

export default TicketNetLost;
