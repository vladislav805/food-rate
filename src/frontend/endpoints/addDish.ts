import type { Endpoint } from '@frontend/api';

export const addDish: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user) throw new Error('Access denied');

    const body = request.body;

    // Parameters
    const restaurantId = Number(body.restaurantId);
    const title = String(body.title ?? '').trim();
    const description = String(body.description ?? '').trim();
    const categoryId = Number(body.categoryId);

    // Checks
    if (!title) throw new Error('Title cannot be empty');

    return context.createDish(restaurantId, title, description, categoryId);
};
