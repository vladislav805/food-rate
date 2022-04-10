import type { Endpoint } from '@frontend/api';
import { isRestaurantType } from '@utils/guardFunctions/restaurant';
import { extractSubstring } from '@utils/extractSubstring';

const vkRegExp = /https?:\/\/(m\.)?vk\.com\/([A-Za-z0-9._]+)(\?|$)/i;
const instagramRegExp = /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9._]+)(\/|\?|$)/i;

export const addRestaurant: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user) throw new Error('Access denied');

    const body = request.body;

    // Parameters
    const title = String(body.title ?? '').trim();
    const description = String(body.description ?? '').trim();
    const type = String(body.type).trim();
    const vk = extractSubstring(body.vk, vkRegExp, 2) || '';
    const instagram = extractSubstring(body.instagram, instagramRegExp, 2) || '';

    // Checks
    if (!title) throw new Error('Title cannot be empty');

    if (!isRestaurantType(type)) throw new Error('Invalid restaurant type');

    return context.addRestaurant({ title, description, type, vk, instagram });
};
