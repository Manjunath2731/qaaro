import userModel, { IUSer, UserRole } from "../../models/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { generateRandomPassword } from "../../utils/randpassword";
import sendMail from "../../utils/sendMail";
import ErrorHandler from "../../utils/ErrorHandler";
import { ClientPlanUsage } from "../../models/subscriptions/subscription.model";

export const login = async (identifier: string, password: string) => {
    try {
        const emailRegexPattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        const query = emailRegexPattern.test(identifier) ? { email: identifier } : { mobile: identifier };
        const user = await userModel.findOne(query).select('+password +status');
        if (!user) {
            throw new ErrorHandler("Invalid email/mobile number or password", 401);
        }
           
        if(user.role !== UserRole.PLUGO_ADMIN && user.role !== UserRole.CLIENT_ADMIN){
            let currentDate = new Date();
            const activePlan = await ClientPlanUsage.findOne({
                clientId: user.clientAdminId,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
            });

            if (!activePlan) {
                throw new ErrorHandler("no active plan.", 402);
            }
        }

        if (user.status !== 'active') {
            throw new ErrorHandler('User is not active', 403);
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw new ErrorHandler("Invalid email/mobile number or password", 401);
        }

        const tokenPayload = { id: user._id, role: user.role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, { expiresIn: '60d' });

        return { id: user._id, token };
    } catch (e) {
        throw e;
    }
};


export const mobilelogin = async (identifier: string, password: string) => {
    try {
        const emailRegexPattern: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const query = emailRegexPattern.test(identifier) ? { email: identifier } : { mobile: identifier };
        const user = await userModel.findOne(query).select('+password');
        if (!user) throw new Error("Invalid email/mobile number or password");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) throw new Error("Invalid email/mobile number or password");
        if (user.role !== 'LaMi_Courier') {
            throw new ErrorHandler('Unauthorized', 400);
        }

        if(user.role ===  UserRole.LAMI_COURIER){
            let currentDate = new Date();
            const activePlan = await ClientPlanUsage.findOne({
                clientId: user.clientAdminId,
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate },
            });

            if (!activePlan) {
                throw new ErrorHandler("no active plan.", 402);
            }
        }

        const tokenPayload = { id: user._id, role: user.role };
        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY!, { expiresIn: '60d' });

        // Return the user ID and token
        return { id: user._id, token };
    } catch (e) {
        throw e;
    }
};


export const forgotPassword = async (email: string) => {
    const user = await userModel.findOne({ email });
    if (!user) throw new Error("User not found");

    const newPassword = generateRandomPassword();
    if (newPassword.length < 6) throw new Error("Generated password does not meet requirements");

    user.password = newPassword;
    await user.save();
    await sendMail({
        email: user.email,
        subject: "new Password",
        template: "new-password.ejs",
        data: {
            user: user,
            newPassword: newPassword,
            language: user.language,
        },
        cc: [],
        bcc: []
    });

    return {};
};

export const resetPassword = async (userId: string, currentPassword: string, newPassword: string) => {
    const user = await userModel.findById(userId).select('+password');
    if (!user) throw new Error("User not found");

    const isPasswordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordMatch) throw new Error("Incorrect current password");

    if (!newPassword) throw new Error("New password cannot be empty");

    user.password = newPassword;
    await user.save();
};

export const getUserDataByToken = async (tokenString: string) => {
    // Verify JWT token and extract user ID
    const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_KEY!) as { id: string };
    const user = await userModel.findById(decodedToken.id).select('-createdAt -updatedAt -__v -plugoAdminId');
    if (!user) throw new Error("User not found");
    return user;
};

// Function to update user data based on role
export const updateUserData = async (userId: string, role: string, data: Partial<IUSer>) => {
    const user = await userModel.findById(userId);
    if (!user) throw new Error("User not found");

    switch (role) {
        case 'LaMi_Admin':
            updateAdminFields(user, data);
            break;
        case 'LaMi_Courier':
            updateCourierFields(user, data);
            break;
        default:
            throw new Error('Invalid user role');
    }

    await user.save();
};

// Helper function to update admin fields
function updateAdminFields(user: IUSer, data: Partial<IUSer>): void {
    const { name, email, mobile, address, status, designation, language } = data;
    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (status) user.status = status;
    if (designation) user.designation = designation;
    if (language) user.language = language;
}

// Helper function to update courier fields
function updateCourierFields(user: IUSer, data: Partial<IUSer>): void {
    const { name, mobile, address, status, designation } = data;
    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (address) user.address = address;
    if (status) user.status = status;
    if (designation) user.designation = designation;
}