import type { Endpoint } from '@frontend/api';

export const deleteReview: Endpoint = (context, request) => {
    const { body } = request;
    const dishId = Number(body.dishId);
    const reviewId = Number(body.reviewId);

    return context.deleteReview(dishId, reviewId);
};
