import { Request, NextFunction } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import jwt from 'jsonwebtoken';
import userModel from "../models/user.model";

interface DecodedToken {
    id: string;
}

// Reusable function to verify token and fetch user
const verifyTokenAndGetUser = async (req: Request, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    const tokenString = authorizationHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(tokenString, process.env.JWT_SECRET_KEY!) as DecodedToken;
        const user = await userModel.findById(decodedToken.id);
        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        return user;
    } catch (error) {
        return next(new ErrorHandler('Unauthorized', 400));
    }
};

// Function to verify general authorization
export const verifyAuthorization = async (req: Request, next: NextFunction) => {
    return await verifyTokenAndGetUser(req, next);
};

// Function to verify Plugo_Admin role
export const verifyPlugoAuthorization = async (req: Request, next: NextFunction) => {
    const user = await verifyTokenAndGetUser(req, next);
    if (user && user.role !== 'Plugo_Admin') {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    return user;
};

// Function to verify LaMi_Admin role
export const verifyLamiAuthorization = async (req: Request, next: NextFunction) => {
    const user = await verifyTokenAndGetUser(req, next);
    if (user && user.role !== 'LaMi_Admin') {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    return user;
};

// Function to verify LaMi_Courier role
export const verifyLamiCourierAuthorization = async (req: Request, next: NextFunction) => {
    const user = await verifyTokenAndGetUser(req, next);
    if (user && user.role !== 'LaMi_Courier') {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    return user;
};

// Function to verify Client_Admin role
export const verifyClientAdminAuthorization = async (req: Request, next: NextFunction) => {
    const user = await verifyTokenAndGetUser(req, next);
    if (user && user.role !== 'Client_Admin') {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    return user;
};

// Function to verify Depo_Admin role
export const verifyDepoAdminAuthorization = async (req: Request, next: NextFunction) => {
    const user = await verifyTokenAndGetUser(req, next);
    if (user && user.role !== 'Depo_Admin') {
        return next(new ErrorHandler('Unauthorized', 400));
    }
    return user;
};