import mongoose, { Document, Schema } from 'mongoose';

export interface ILink extends Document {
  email: string;
  link: string;
  expiresAt: Date;
  active: boolean;
  pdfData?: Buffer;
  ticketId?: mongoose.Types.ObjectId;
}

const LinkSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, default: mongoose.Types.ObjectId },
  email: { type: String, required: true },
  link: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  active: { type: Boolean, required: true, default: true },
  pdfData: { type: Buffer },
  ticketId: {
    type: mongoose.Types.ObjectId,
    ref: 'Ticket'
}
});

export const Link = mongoose.model<ILink>('Link', LinkSchema);