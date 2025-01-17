import { Request, Response, NextFunction } from 'express';
import { sendApiResponse } from '../../utils/apiresponse';
import ErrorHandler from '../../utils/ErrorHandler';
import { createPlanService, getPlansService } from '../../services/helper/subscription/plan.service';


export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plan = await createPlanService(req.body);
        sendApiResponse(res, {
            status: true,
            data: plan,
            message: 'Plan created successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
};

export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const plans = await getPlansService();
        sendApiResponse(res, {
            status: true,
            data: plans,
            message: 'Plans fetched successfully'
        });
    } catch (e: any) {
        return next(new ErrorHandler(e.message, 500));
    }
};

// export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const { name, duration, minPricePerCourier } = req.body;
//         const plan = await updatePlanService(id, req.body);
//         if (!plan) {
//             return next(new ErrorHandler('Plan not found', 404));
//         }
//         sendApiResponse(res, {
//             status: true,
//             data: {},
//             message: 'Plan updated successfully'
//         });
//     } catch (e: any) {
//         return next(new ErrorHandler(e.message, 500));
//     }
// };


// export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { id } = req.params;
//         const plan = await deletePlanService(id);
//         if (!plan) {
//             return next(new ErrorHandler('Plan not found', 404));
//         }
//         sendApiResponse(res, {
//             status: true,
//             data: {},
//             message: 'Plan deleted successfully'
//         });
//     } catch (e: any) {
//         return next(new ErrorHandler(e.message, 500));
//     }
// };