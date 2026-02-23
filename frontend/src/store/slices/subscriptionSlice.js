import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    currentPlan: 'free',
    plans: [
        {
            id: 'free',
            name: 'Free',
            price: 0,
            features: ['5 AI chats/day', '1 CSV upload/day', 'Basic analytics', 'Community support'],
        },
        {
            id: 'starter',
            name: 'Starter',
            price: 19,
            features: ['50 AI chats/day', '10 CSV uploads/day', 'Advanced analytics', 'Email support', 'Custom themes'],
        },
        {
            id: 'professional',
            name: 'Professional',
            price: 49,
            features: ['Unlimited AI chats', 'Unlimited uploads', 'Priority analytics', 'Priority support', 'API access', 'Team collaboration'],
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 99,
            features: ['Everything in Pro', 'Custom AI models', 'Dedicated support', 'SSO', 'SLA', 'On-premise option'],
        },
    ],
    billingHistory: [],
};

const subscriptionSlice = createSlice({
    name: 'subscription',
    initialState,
    reducers: {
        setCurrentPlan: (state, action) => {
            state.currentPlan = action.payload;
        },
        setBillingHistory: (state, action) => {
            state.billingHistory = action.payload;
        },
    },
});

export const { setCurrentPlan, setBillingHistory } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
