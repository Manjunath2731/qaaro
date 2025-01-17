import express from 'express';
import { createPlan, getPlans } from '../controllers/subscription/plan.controller';
import { approveSubscriptionReq, createSubscriptionRequest, getSubscriptions, rejectSubscriptionReq, subscriptionReq } from '../controllers/subscription/subscription.controller';

const subscription = express.Router();

//Plan crud
subscription.post('/plans', createPlan);
subscription.get('/plans', getPlans);

//subscription crud for courier admin
subscription.get('/get', getSubscriptions);
subscription.post('/create-req', createSubscriptionRequest);

subscription.post('/approve', approveSubscriptionReq);
subscription.post('/reject', rejectSubscriptionReq);
subscription.get('/sub-req', subscriptionReq);


export default subscription;
