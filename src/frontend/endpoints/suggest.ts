import type { Endpoint } from '@frontend/api';
import type { IDish, IRestaurant } from '@typings/objects';

type ISuggestResult = {
    restaurants: IRestaurant[];
    dishes: IDish[];
};

// Сделать временный кэш
const cache = new Map<string, ISuggestResult>();

export const suggest: Endpoint<ISuggestResult> = async(context, request) => {
    const text = String(request.body.text ?? '').trim();

    if (!text) return { restaurants: [], dishes: [] };

    if (cache.has(text)) {
        return cache.get(text) as ISuggestResult;
    }

    const [restaurants, dishes] = await Promise.all([
        context.suggestRestaurants(text, 7),
        context.suggestDishes(text, 7) as Promise<IDish[]>,
    ]);

    const result = { restaurants, dishes };

    cache.set(text, result);

    return result;
};
