import mongoose from "mongoose";

export interface IRegistrationBody {
    name: string;
    email: string;
    role: string;
    mobile?: number;
    address?: string;
    company: string;
    status?: string;
    language: string;
    designation: string;
    state: string;
    country: string;
    zipcode: number;
    plugoAdminId?: string;
    lamiAdminId?: string;
    clientAdminId?: string;
    depoAdminId?: string;
    otp?: number;
    password?: number;
};

export interface IUpdateUserBody extends Partial<IRegistrationBody> {
    clientAdminId?: string;
    lamiAdminId?: string;
    status?: 'active' | 'inactive';
};

export interface IDeleteUserBody {
    lamiAdminId: string;
};

export interface IFinalTicketBody {
    status: 'locolost' | 'locosuccess';
    description: string;
};

export interface IreturnToLocoBody {
    to: string;
    cc: string[];
    bcc: string[];
    message?: string;
    subject?: string;
    description?: string;
    signature?: string;
    attachment?: string[];
    newsignature?: string;
};

export interface IAttachment {
    mailHeaderNumber: string;
    dpdInvoiceNumber: string;
    date: Date;
    packageNumber: string;
    complainNumber: string;
    finalLostAmmount: number;
    attachment?: string;
    notes: string;
}

export interface IInsurance {
    insuClaimNumber: string;
    insuOurSign: string;
    insuDate: Date;
    insuTransferAmount: number;
    insuCompensationAmount: number;
    insuDeductible: number;
    notes: string;
}

export interface INetLost {
    date: Date;
    paidAmount: number;
}

export interface IRejectInsurance {
    insuClaimNumber: string;
    insuOurSign: string;
    insuDate: Date;
    notes: string;
}

export interface IMailSend {
    to: string;
    cc: string[];
    bcc: string[];
    message?: string;
    subject?: string;
    notes?: string;
    attachment?: string[];
}

export interface ITicketCreationBody {
    dpdTicketNumber: string;
    complainNumber: string;
    packageNumber: string;
    claimType: string;
    problem: string;
    amountInDispute: number;
    dpdReferenceNumber: string;
    packageDetails: {
        item: string;
        category: string;
        amount: number;
        manufacturer: string;
        article: string;
        furtherInformation: string;
        serialNumber: string;
        ean: string;
        id: string;
    };
    sellerDetails: {
        email: string;
    };
    recipientDetails: {
        name: string;
        address: string;
    };
    parcelLabelAddress: {
        name: string;
        address: string;
    };
    deadlineDate: Date;
    locoContacts: {
        name: string;
        email: string;
        address: string;
    };
    attachment: {
        files: string[];
    };
    status: string;
    lamiAdminId: string;
    subject: string;
};

export interface IUpdateUserDataBody {
    description?: string;
    files?: Express.Multer.File[];
}

export interface IcreatePdf {
    description?: string;
}


export interface Lami {
    _id: mongoose.Types.ObjectId;
    lamiId: mongoose.Types.ObjectId;
    emailServer: {
        user: string;
        password: string;
        host: string;
        port: number;
    };
    lastRun: string;
}


export interface IEmail {
    email: string[];
    role: string
};