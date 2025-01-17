require('dotenv').config();
import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const emailRegexPattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export enum UserRole {
    PLUGO_ADMIN = "Plugo_Admin",
    LAMI_ADMIN = "LaMi_Admin",
    LAMI_COURIER = "LaMi_Courier",
    CLIENT_ADMIN = 'Client_Admin',
    DEPO_ADMIN = 'Depo_Admin'
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

interface IAvatar {
    publicId: string;
    url: string;
}

interface ICompany extends Document {
    companyName: string;
}


export interface IUSer extends Document {
    name: string;
    email?: string;
    password: string;
    mobile: Number;
    address: string;
    state: string;
    country: string;
    zipcode: Number;
    role: UserRole;
    company: mongoose.Types.ObjectId | ICompany;
    status: UserStatus;
    language: string;
    designation: string;
    avatar: IAvatar;

    // //Relation ship
    plugoAdminId?: mongoose.Types.ObjectId;
    lamiAdminId?: mongoose.Types.ObjectId;
    clientAdminId?: mongoose.Types.ObjectId;
    depoAdminId?: mongoose.Types.ObjectId;
    comparePassword: (password: string) => Promise<boolean>;
}

const userSchema: Schema<IUSer> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter name']
    },
    email: {
        type: String
        // validate: {
        //     validator: function (value: string) {
        //         return emailRegexPattern.test(value);
        //     },
        //     message: "Please enter a valid email",
        // },
        // unique: true,
    },
    password: {
        type: String,
        // required: [true, "Please enter password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    mobile: {
        type: Number,
        required: [true, 'Please enter mobile number']
    },
    address: {
        type: String,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE
    },
    language: {
        type: String,
    },
    designation: {
        type: String,
    },
    zipcode: {
        type: Number,
    },
    state: {
        type: String,
    },
    country: {
        type: String,

    },
    avatar: {
        type: {
            publicId: String,
            url: String
        },
        default: { publicId: "", url: "" }
    },
    plugoAdminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    lamiAdminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    clientAdminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    depoAdminId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

userSchema.index({ email: 1 });

//hash passowrd bedore saving
userSchema.pre<IUSer>('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password)
};

const userModel: Model<IUSer> = mongoose.model("User", userSchema);

export default userModel;