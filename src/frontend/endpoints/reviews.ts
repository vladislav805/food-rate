import { Endpoint } from '@frontend/api';

export const reviews: Endpoint = (context, request) => {
    const { dishId, offset, limit } = request.query;

    return context.getReviewsByDishId(
        Number(dishId),
        Number(limit),
        Number(offset),
    );
};
