import type { RouteMatch } from 'react-router';
import type { UserContext } from '@database/UserContext';
import { IRestaurantPageData } from '@pages/RestaurantPage';
import { IHomePageData } from '@pages/HomePage';
import { IDishPageData } from '@pages/DishPage';
import { IDataProvider } from '@frontend/provider';

type RouteFetcher = (provider: IDataProvider, route: RouteMatch, context: UserContext) => Promise<any>;

const fetchers: Record<string, RouteFetcher> = {
    '/': async(provider): Promise<IHomePageData> => provider.getHome(),

    '/restaurant/:restaurantId': async(provider, route): Promise<IRestaurantPageData> => {
        const restaurantId = Number(route.params.restaurantId);

        return provider.getRestaurantById(restaurantId);
    },

    '/restaurant/:restaurantId/dish/:dishId': async(provider, route): Promise<IDishPageData> => {
        const params = route.params;
        const restaurantId = Number(params.restaurantId);
        const dishId = Number(params.dishId);

        return provider.getDishById(restaurantId, dishId);
    },

    '/categories': async(provider) => provider.getCategories(),
};

/**
 * Возвращает данные из базы данныз для серверного рендера страницы
 * @param provider Провайдер данных
 * @param context Контекст запроса пользователя
 * @param route Сработавший маршрут
 */
export const getDataByRoute = (provider: IDataProvider, route: RouteMatch, context: UserContext): Promise<any> => {
    const path = route.route.path!;

    return path in fetchers
        ? fetchers[path](provider, route, context)
        : Promise.resolve({});
};
