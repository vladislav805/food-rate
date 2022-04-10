import type { Endpoint } from '@frontend/api';

export const addBranch: Endpoint = (context, request) => {
    const user = context.getUser();

    if (!user) throw new Error('Access denied');

    const body = request.body;

    // Parameters
    const restaurantId = Number(body.restaurantId);
    const address = String(body.address ?? '').trim();
    const regionCode = String(body.regionCode ?? '').trim();
    const lat = Number(body.lat);
    const lng = Number(body.lng);

    // Checks
    if (!address || !regionCode || !lat || !lng) throw new Error('Some data is invalid');

    return context.createBranch(restaurantId, address, lat, lng, regionCode);
};
