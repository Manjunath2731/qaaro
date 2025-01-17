import mongoose, { Document, Model, Schema } from 'mongoose';

interface IPackageDetails {
    item: string;
    category: string;
    amount: string;
    manufacturer: string;
    article: string;
    furtherInformation: string;
    serialNumber: string;
    ean: string;
    id: string;
}

interface ISellerDetails {
    email: string;
}

interface ILoCoContacts {
    name: string;
    email: string;
    address: string;
}

interface IAttachment {
    files: string[];
}

interface IRecipientDetails {
    name: string;
    address: string;
}

interface IPackageLableNumber extends IRecipientDetails{}

interface Isignedoc extends IAttachment {}

export interface ITicket extends Document {
    dpdTicketNumber: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    dpdReferenceNumber: string;
    packageDetails: IPackageDetails;
    sellerDetails: ISellerDetails;
    recipientDetails: IRecipientDetails;
    parcelLabelAddress: IPackageLableNumber;
    deadlineDate: Date;
    locoContacts: ILoCoContacts;
    status: string;
    SubStatus: string;
    attachment?: IAttachment;
    returnDescLami?: string;
    returnDescCouri?: string;
    signedoc?: Isignedoc;
    subject?: string;
    description?: string;
    updatedAt?: Date;

    //Relationship's
    lamiAdminId?: mongoose.Types.ObjectId;
}

const TicketSchema: Schema<ITicket> = new mongoose.Schema({
    dpdTicketNumber: {
        type: String
    },
    complainNumber: {
        type: String,
        required: true
    },
    packageNumber: {
        type: String,
    },
    claimType: {
        type: String,
    },
    problem: {
        type: String,
    },
    amountInDispute: {
        type: Number,
    },
    dpdReferenceNumber: {
        type: String
    },
    packageDetails: {
        type: Schema.Types.Mixed,
    },
    sellerDetails: {
        type: Schema.Types.Mixed,
    },
    recipientDetails: {
        type: Schema.Types.Mixed,
    },
    parcelLabelAddress: {
        type: Schema.Types.Mixed,
    },
    deadlineDate: {
        type: Date,
    },
    locoContacts: {
        type: Schema.Types.Mixed,
    },
    status:{
        type: String,
        enum: ['new', 'courier', 'preloco', 'loco', 'locosuccess', 'locolost', 'insurance', 'invoiced', 'insuokay', 'insureject', 'noinsu'],
    },
    SubStatus:{
        type: String,
        enum: ['LaMi_Returned','Courier_Returned','Customer_Accepted','Customer_Denied', '']
    },
    returnDescLami: {
        type :String
    },
    returnDescCouri: {
        type: String
    },
    signedoc: {
        type: { files: [String] },
    },
    attachment: {
        type: { files: [String] }
    },
    subject: {
        type: String
    },
    description: {
        type: String
    },
    lamiAdminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Ticket: Model<ITicket> = mongoose.model("Ticket", TicketSchema);

export default Ticket;