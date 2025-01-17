import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketDriver extends Document {
    ticketId: mongoose.Types.ObjectId;
    courierId: mongoose.Types.ObjectId;
    status: string;
    description?: string;
    createdAt: Date;
}

const TicketDriverSchema = new Schema<ITicketDriver>({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    courierId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['open', 'Customer_Accepted', 'Customer_Denied', 'Courier_Returned', 're-open', 'success', 'lost'],
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const TicketDriver = mongoose.model<ITicketDriver>('TicketDriver', TicketDriverSchema);

export default TicketDriver;
