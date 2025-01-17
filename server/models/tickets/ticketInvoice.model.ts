import mongoose, { Document, Schema } from 'mongoose';

interface IAttachment {
    files: string[];
}

export interface ITicketInvoice extends Document {
    ticketId: mongoose.Types.ObjectId;
    lamiAdminId: mongoose.Types.ObjectId;
    mailHeaderNumber: string;
    dpdInvoiceNumber: string;
    date: Date;
    packageNumber: string;
    complainNumber: string;
    finalLostAmmount: number;
    attachment?: IAttachment;
    notes: string;
}

const TicketInvoiceSchema = new Schema<ITicketInvoice>({
    ticketId: {
        type: Schema.Types.ObjectId,
        ref: 'Ticket',
        required: true
    },
    lamiAdminId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mailHeaderNumber: {
        type: String
    },
    dpdInvoiceNumber: {
        type: String
    },
    date : {
        type: Date,
        required: true
    },
    packageNumber: {
        type: String
    },
    complainNumber: {
        type: String
    },
    finalLostAmmount: {
        type: Number
    },
    notes: {
        type: String
    },
    attachment: {
        type: { files: [String] }
    },
}, {
    timestamps: true
});

const TicketInvoice = mongoose.model<ITicketInvoice>('TicketInvoice', TicketInvoiceSchema);

export default TicketInvoice;
