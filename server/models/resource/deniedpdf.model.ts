import mongoose, { Schema, Model, Document } from 'mongoose';

interface DeniedPdfDoc extends Document {
    ticketId: mongoose.Types.ObjectId;
    description: string;
    signatureImage: string;
    name: string;
    place: string;
}

const DeniedPdfSchema = new Schema<DeniedPdfDoc>({
    ticketId: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    description: { type: String },
    signatureImage: { type: String },
    name: { type: String },
    place: { type: String }
});

const DeniedPdfModel: Model<DeniedPdfDoc> = mongoose.model<DeniedPdfDoc>("DeniedPdf", DeniedPdfSchema);

export default DeniedPdfModel;