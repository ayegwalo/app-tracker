import { Router } from 'express';
import protect from '../middleware/auth.middleware.js';
import {
    createSubscription, getAllSubscriptions,
    getUserSubscriptions
} from '../controllers/subscription.controller.js';

const subscriptionRouter = Router();

// subscriptionRouter.get('/', (req, res) => res.send({ title: 'GET all subscriptions' }));

subscriptionRouter.get('/', protect, getAllSubscriptions);

subscriptionRouter.get('/:id', (req, res) => res.send({ title: 'GET subscriptions details' }));

subscriptionRouter.post('/', protect, createSubscription);

subscriptionRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE subscriptions' }));

subscriptionRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE subscription' }));

subscriptionRouter.get('/user/:id', protect, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', protect);

subscriptionRouter.get('/upcoming-renewals', protect);


export default subscriptionRouter;