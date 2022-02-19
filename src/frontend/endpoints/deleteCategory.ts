import type { Endpoint } from '@frontend/api';
import hasUserRights from '@server/utils/hasUserRights';

export const deleteCategory: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user || !hasUserRights(user, 'admin')) throw new Error('Access denied');

    if (!request.body.categoryId) throw new Error('ID not passed');

    const categoryId = Number(request.body.categoryId);

    if (categoryId <= 0) throw new Error('Invalid ID');

    return context.deleteCategory(categoryId);
};
