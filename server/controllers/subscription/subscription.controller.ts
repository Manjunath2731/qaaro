import { Request, Response, NextFunction } from 'express';
import { sendApiResponse } from '../../utils/apiresponse';
import ErrorHandler from '../../utils/ErrorHandler';
import { approveSubscriptionService, createOrRenewSubscriptionRequestService, deleteSubscriptionService, getSubscriptionsService, rejectSubscriptionService, subscriptionReqService, updateSubscriptionService } from '../../services/helper/subscription/subscription.service';
import { verifyAuthorization, verifyClientAdminAuthorization, verifyPlugoAuthorization } from '../../middleware/auth';
import mongoose from 'mongoose';
import { CatchAsyncError } from '../../middleware/catchAsyncError';

export const createSubscriptionRequest = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyClientAdminAuthorization(req, next);
        const planId: string = req.query.planId as string;
        const planObjectId = new mongoose.Types.ObjectId(planId);
        const {type} = req.body;
        const subscription = await createOrRenewSubscriptionRequestService(
            user?._id,
            planObjectId,
            type
        );
        sendApiResponse(res, {
            status: true,
            data: {},
            message: 'Subscription created successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const getSubscriptions = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyClientAdminAuthorization(req, next);
        const { subscriptions, pendingRequestCount } = await getSubscriptionsService(user?._id);

        if (pendingRequestCount) {
            return sendApiResponse(res, {
                status: true,
                data: {
                    pendingCount: pendingRequestCount
                },
                message: 'There is a pending subscription request.'
            });
        }

        if (subscriptions.length === 0) {
            return sendApiResponse(res, {
                status: true,
                data: [],
                message: 'No active subscriptions found.'
            });
        }

        sendApiResponse(res, {
            status: true,
            data: subscriptions,
            message: 'Subscriptions fetched successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, e.statusCode));
    }
});


export const approveSubscriptionReq = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyPlugoAuthorization(req, next); // Assuming this is your authorization function
        const requestId: string = req.query.requestId as string;

        const subscription = await approveSubscriptionService(requestId);

        sendApiResponse(res, {
            status: true,
            data: subscription,
            message: 'Subscription approved successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const rejectSubscriptionReq = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyPlugoAuthorization(req, next); // Assuming this is your authorization function
        const requestId: string = req.query.requestId as string;

        const subscriptionRequest = await rejectSubscriptionService(requestId);

        sendApiResponse(res, {
            status: true,
            data: subscriptionRequest,
            message: 'Subscription rejected successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});

export const subscriptionReq = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await verifyPlugoAuthorization(req, next);
        const subscription = await subscriptionReqService();
        sendApiResponse(res, {
            status: true,
            data: subscription,
            message: 'Subscription rejected successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
});


// export const updateSubscription = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const { clientAdminId, planId, startDate, endDate, numOfCouriers, status } = req.body;
//         const subscription = await updateSubscriptionService(id, req.body);
//         if (!subscription) {
//             return next(new ErrorHandler('Subscription not found', 404));
//         }
//         sendApiResponse(res, {
//             status: true,
//             data: {},
//             message: 'Subscription updated successfully'
//         });
//     } catch (e: any) {
//         return next(new ErrorHandler(e.message, 500));
//     }
// };

// export const deleteSubscription = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const subscription = await deleteSubscriptionService(id);
//         if (!subscription) {
//             return next(new ErrorHandler('Subscription not found', 404));
//         }
//         sendApiResponse(res, {
//             status: true,
//             data: {},
//             message: 'Subscription deleted successfully'
//         });
//     } catch (e: any) {
//         return next(new ErrorHandler(e.message, 500));
//     }
// };
