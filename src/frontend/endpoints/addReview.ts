import type { Endpoint } from '@frontend/api';

export const addReview: Endpoint = (context, request) => {
    const { body } = request;
    const dishId = Number(body.dishId);
    const rate = Number(body.rate);
    const text = String(body.text ?? '');

    return context.createReview(dishId, rate, text);
};
