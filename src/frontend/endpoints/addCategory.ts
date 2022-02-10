import type { Endpoint } from '@frontend/api';
import hasUserRights from '@server/utils/hasUserRights';

export const addCategory: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user || !hasUserRights(user, 'admin')) throw new Error('Access denied');

    const title = String(request.query.title ?? '').trim();

    if (!title) throw new Error('Title cannot be empty');

    return context.createCategory(title as string);
};
