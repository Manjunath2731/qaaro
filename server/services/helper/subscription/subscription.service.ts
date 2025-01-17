import mongoose from "mongoose";
import { ClientPlanUsage, IClientPlanUsage } from "../../../models/subscriptions/subscription.model";
import ErrorHandler from "../../../utils/ErrorHandler";
import { ISubscriptionRequest, SubscriptionReqTypes, SubscriptionRequest, SubscriptionStatus } from "../../../models/subscriptions/subscriptionReq.model";
import { QaaroPlans } from "../../../models/subscriptions/plans.model";


export const createOrRenewSubscriptionRequestService = async (
    clientId: mongoose.Types.ObjectId,
    planId: mongoose.Types.ObjectId,
    type: 'NEW' | 'RENEW'
): Promise<ISubscriptionRequest> => {

    const requestType = type === 'NEW'
        ? SubscriptionReqTypes.NEW
        : SubscriptionReqTypes.RENEW;

    const requestData = {
        clientId,
        planId,
        requestDate: new Date(),
        requestType,
        status: SubscriptionStatus.PENDING
    };

    const subscriptionRequest = new SubscriptionRequest(requestData);
    return await subscriptionRequest.save();
};

export const getSubscriptionsService = async (clientId: mongoose.Types.ObjectId): Promise<any> => {
    let currentDate = new Date();
    
    // Check for pending subscription requests
    const pendingRequest = await SubscriptionRequest.findOne({
        clientId,
        status: SubscriptionStatus.PENDING
    });

    // Fetch active subscriptions
    const subscriptions = await ClientPlanUsage.find({
        clientId,
        startDate: { $lte: currentDate },
        endDate: { $gte: currentDate },
    })
    .populate('planId');

    const pendingRequestCount = pendingRequest ? 1 : 0;

    return { subscriptions, pendingRequestCount };
};



export const approveSubscriptionService = async (requestId: string): Promise<IClientPlanUsage> => {
    const subscriptionRequest = await SubscriptionRequest.findById(requestId);

    if (!subscriptionRequest) {
        throw new ErrorHandler('Subscription request not found.', 404);
    }

    if (subscriptionRequest.status !== SubscriptionStatus.PENDING) {
        throw new ErrorHandler('Subscription request has already been processed.', 400);
    }

    // Find the associated plan
    const plan = await QaaroPlans.findById(subscriptionRequest.planId);
    if (!plan) {
        throw new ErrorHandler('Plan not found.', 404);
    }

    let subscription;

    if (subscriptionRequest.requestType === SubscriptionReqTypes.NEW) {
        // Calculate start and end dates for a new subscription
        const startDate = subscriptionRequest.requestDate;
        let endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + plan.duration);

        // Create the new subscription in the ClientPlanUsage model
        subscription = new ClientPlanUsage({
            clientId: subscriptionRequest.clientId,
            planId: subscriptionRequest.planId,
            startDate,
            endDate,
            availableCount: plan.userLimit
        });

        await subscription.save();
    } else if (subscriptionRequest.requestType === SubscriptionReqTypes.RENEW) {
        // Find the existing active subscription for the client
        subscription = await ClientPlanUsage.findOne({
            clientId: subscriptionRequest.clientId
        });

        if (!subscription) {
            throw new ErrorHandler('Active subscription not found for this client.', 404);
        }

        // Update the end date and available count for the renewal
        subscription.endDate.setMonth(subscription.endDate.getMonth() + plan.duration);
        subscription.availableCount += plan.userLimit;

        await subscription.save();
    } else {
        throw new ErrorHandler('Invalid subscription request type.', 400);
    }

    // Update the subscription request status to 'approved'
    subscriptionRequest.status = SubscriptionStatus.APPROVED;
    await subscriptionRequest.save();

    return subscription;
};

export const rejectSubscriptionService = async (requestId: string): Promise<any> => {
    // Find the subscription request by ID
    const subscriptionRequest = await SubscriptionRequest.findById(requestId);

    if (!subscriptionRequest) {
        throw new Error('Subscription request not found.');
    }

    if (subscriptionRequest.status !== SubscriptionStatus.PENDING) {
        throw new Error('Subscription request has already been processed.');
    }

    // Update the status to 'rejected'
    subscriptionRequest.status = SubscriptionStatus.REJECTED;
    await subscriptionRequest.save();

    return subscriptionRequest;
};


export const subscriptionReqService = async (): Promise<any> => {
    // Find the subscription by ID

    const subscription = await SubscriptionRequest.aggregate([
        {
            $lookup: {
                from: 'qaaroplans',
                localField: 'planId',
                foreignField: '_id',
                as: 'planId'
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'clientId',
                foreignField: '_id',
                as: 'clientId'
            }
        },
        {
            $addFields: {
                sortOrder: {
                    $cond: {
                        if: { $eq: ['$status', SubscriptionStatus.PENDING] },
                        then: 0,
                        else: 1
                    }
                }
            }
        },
        { $sort: { sortOrder: 1, createdAt: -1 } },
        {
            $project: {
                sortOrder: 0
            }
        }
    ]);


    if (!subscription) {
        throw new Error('Subscription requset not found.');
    }

    return subscription;
};


export const updateSubscriptionService = async (id: string, data: Partial<IClientPlanUsage>): Promise<IClientPlanUsage | null> => {
    return await ClientPlanUsage.findByIdAndUpdate(id, data, { new: true });
};


export const deleteSubscriptionService = async (id: string): Promise<IClientPlanUsage | null> => {
    return await ClientPlanUsage.findByIdAndDelete(id);
};
