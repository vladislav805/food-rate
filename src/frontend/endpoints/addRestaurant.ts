import type { Endpoint } from '@frontend/api';
import { isRestaurantType } from '@utils/guardFunctions/restaurant';

export const addRestaurant: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user) throw new Error('Access denied');

    const body = request.body;

    // Parameters
    const title = String(body.title ?? '').trim();
    const description = String(body.description ?? '').trim();
    const type = String(body.type).trim();
    const vk = String(body.vk).trim();
    const instagram = String(body.instagram).trim();

    // Checks
    if (!title) throw new Error('Title cannot be empty');

    if (!isRestaurantType(type)) throw new Error('Invalid restaurant type');

    return context.addRestaurant({ title, description, type, vk, instagram });
};
