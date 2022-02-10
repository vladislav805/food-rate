import { Endpoint } from '@frontend/api';

export const addReview: Endpoint = (context, request) => {
    const { query } = request;
    const dishId = Number(query.dishId);
    const branchId = Number(query.branchId);
    const rate = Number(query.rate);
    const text = String(query.text ?? '');

    return context.createReview(dishId, branchId, rate, text);
};
