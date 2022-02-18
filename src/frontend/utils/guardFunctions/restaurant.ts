import type { RestaurantType } from '@database/models/restaurant';

const restaurantTypes = new Set(['place', 'delivery', 'mixed']);

export const isRestaurantType = (str: string): str is RestaurantType => restaurantTypes.has(str);
