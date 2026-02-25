/**
 * Seed script for SubscriptionPlans
 *
 * Run:  node src/scripts/seedPlans.js
 *
 * Idempotent — uses upsert so it can be re-run safely.
 */
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const SubscriptionPlan = require('../models/SubscriptionPlan');

const plans = [
    {
        name: 'free',
        price: 0,
        limits: {
            maxUsers: 1,
            maxPipelines: 3,
            maxRowsPerMonth: 1000,
            aiRequestsPerMonth: 25,
        },
    },
    {
        name: 'starter',
        price: 29,
        limits: {
            maxUsers: 5,
            maxPipelines: 10,
            maxRowsPerMonth: 25000,
            aiRequestsPerMonth: 200,
        },
    },
    {
        name: 'pro',
        price: 99,
        limits: {
            maxUsers: 25,
            maxPipelines: 50,
            maxRowsPerMonth: 250000,
            aiRequestsPerMonth: 2000,
        },
    },
    {
        name: 'enterprise',
        price: 499,
        limits: {
            maxUsers: 9999,
            maxPipelines: 9999,
            maxRowsPerMonth: 10000000,
            aiRequestsPerMonth: 50000,
        },
    },
];

async function seed() {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/nexusai';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    for (const plan of plans) {
        await SubscriptionPlan.findOneAndUpdate(
            { name: plan.name },
            plan,
            { upsert: true, new: true }
        );
        console.log(`Upserted plan: ${plan.name} ($${plan.price}/mo)`);
    }

    console.log('\n✅ All subscription plans seeded successfully');
    await mongoose.disconnect();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
