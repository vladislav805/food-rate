import type { RouteMatch } from 'react-router';
import type { UserContext } from '@database/UserContext';
import type { IGlobalContext } from '@components/GlobalContext';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IHomePageData } from '@pages/HomePage';
import type { IDishPageData } from '@pages/DishPage';
import type { IDataProvider } from '@frontend/provider';
import type { IUserPageData } from '@pages/UserPage';

type RouteFetcherParams = {
    provider: IDataProvider;
    route: RouteMatch;
    context: UserContext;
    globalContext: IGlobalContext;
};

type RouteFetcher = (params: RouteFetcherParams) => Promise<any>;

const fetchers: Record<string, RouteFetcher> = {
    '/': async({ provider }): Promise<IHomePageData> => provider.getHome(),

    '/restaurant/:restaurantId': async({ provider, route }): Promise<IRestaurantPageData> => {
        const restaurantId = Number(route.params.restaurantId);

        return provider.getRestaurantById(restaurantId);
    },

    '/restaurant/:restaurantId/dish/new': async({ provider, route }) => {
        const params = route.params;
        const restaurantId = Number(params.restaurantId);

        return provider.preCreateDishData(restaurantId);
    },

    '/restaurant/:restaurantId/dish/:dishId': async({ provider, route }): Promise<IDishPageData | {}> => {
        const params = route.params;
        const restaurantId = Number(params.restaurantId);
        const dishId = Number(params.dishId);

        return provider.getDishById(restaurantId, dishId);
    },

    '/restaurant/:restaurantId/branch/new': async({ provider, route }) => {
        const params = route.params;
        const restaurantId = Number(params.restaurantId);

        return provider.preCreateBranchData(restaurantId);
    },

    '/categories': async({ provider }) => provider.getCategories(),

    '/user/:userId': async({ provider, route }): Promise<IUserPageData> => {
        const userId = Number(route.params.userId);

        return provider.getUserById(userId);
    },
};

/**
 * Возвращает данные из базы данных для серверного рендера страницы
 * @param params.provider Провайдер данных
 * @param params.route Сработавший маршрут
 * @param params.context Контекст запроса пользователя
 * @param params.globalContext Глобальный контекст запроса
 */
export const getDataByRoute = (params: RouteFetcherParams): Promise<any> => {
    const path = params.route.route.path!;

    return path in fetchers
        ? fetchers[path](params)
        : Promise.resolve({});
};
