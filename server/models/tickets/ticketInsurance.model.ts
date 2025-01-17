import mongoose, { Document, Schema } from 'mongoose';

export interface ITicketInsurance extends Document {
    ticketId: mongoose.Types.ObjectId;
    lamiAdminId: mongoose.Types.ObjectId;
    insuClaimNumber?: string;
    insuOurSign?: string;
    insuDate?: Date;
    insuTransferAmount?: number;
    insuCompensationAmount?: number;
    insuDeductible?: number;
    notes?: string;
}

const TicketInsuranceSchema = new Schema<ITicketInsurance>({
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
    insuClaimNumber: {
        type: String
    },
    insuOurSign: {
        type: String
    },
    insuDate : {
        type: Date
    },
    insuTransferAmount: {
        type: Number
    },
    insuCompensationAmount: {
        type: Number
    },
    insuDeductible: {
        type: Number
    },
    notes: {
        type: String
    },
}, {
    timestamps: true
});

const TicketInsurance = mongoose.model<ITicketInsurance>('TicketInsurance', TicketInsuranceSchema);

export default TicketInsurance;
