import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketAudit extends Document {
    ticketId: mongoose.Types.ObjectId;
    status: 'new' | 'courier' | 'preloco' | 'loco' | 'locosuccess' | 'locolost' | 'insurance';
    date: Date;
    descpription?: string;
    updatedAt?: Date;
}

const TicketAuditSchema = new Schema<ITicketAudit>({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    status: {
        type: String,
        enum: ['new', 'courier', 'preloco', 'loco', 'locosuccess', 'locolost', 'insurance', 'invoiced', 'insuokay', 'insureject', 'noinsu'],
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    descpription: {
        type: String,
        // required: true
    }
}, {
    timestamps: true
});

const TicketAudit = mongoose.model<ITicketAudit>('TicketAudit', TicketAuditSchema);

export default TicketAudit;
