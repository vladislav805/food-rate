import type { RouteMatch } from 'react-router';
import type { UserContext } from '@database/UserContext';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IHomePageData } from '@pages/HomePage';
import type { IDishPageData } from '@pages/DishPage';
import type { IDataProvider } from '@frontend/provider';
import type { IUserPageData } from '@pages/UserPage';

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

    '/user/:userId': async(provider, route): Promise<IUserPageData> => {
        const userId = Number(route.params.userId);

        return provider.getUserById(userId);
    },
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
