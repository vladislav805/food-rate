import type { Endpoint } from '@frontend/api';

export const addRestaurant: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user) throw new Error('Access denied');

    const body = request.body;

    const title = String(body.title ?? '').trim();
    const description = String(body.title ?? '').trim();

    if (!title) throw new Error('Title cannot be empty');

    return context.addRestaurant(title, description);
};
