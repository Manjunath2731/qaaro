import mongoose, { Document, Model, Schema } from 'mongoose';

interface ICompany extends Document {
    companyName: string;
}

const CompanySchema: Schema<ICompany> = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    }
});

const Company: Model<ICompany> = mongoose.model<ICompany>("Company", CompanySchema);

export default Company;