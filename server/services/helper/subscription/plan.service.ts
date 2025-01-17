import { IQaaroPlans, QaaroPlans } from "../../../models/subscriptions/plans.model";


export const createPlanService = async (data: IQaaroPlans): Promise<IQaaroPlans> => {
    const plan = new QaaroPlans(data);
    return await plan.save();
};

export const getPlansService = async (): Promise<IQaaroPlans[]> => {
    return await QaaroPlans.find();
};

// export const updatePlanService = async (id: string, data: Partial<IQaaroPlans>): Promise<IQaaroPlans | null> => {
//     return await QaaroPlans.findByIdAndUpdate(id, data, { new: true });
// };



// export const deletePlanService = async (id: string): Promise<IQaaroPlans | null> => {
//     return await QaaroPlans.findByIdAndDelete(id);
// };