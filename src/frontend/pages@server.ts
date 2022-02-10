import type { RouteMatch } from 'react-router';
import type { UserContext } from '@database/UserContext';
import { IRestaurantPageData } from '@pages/RestaurantPage';
import { IHomePageData } from '@pages/HomePage';
import { IDishPageData } from '@pages/DishPage';

type RouteFetcher = (context: UserContext, route: RouteMatch) => Promise<any>;

const fetchers: Record<string, RouteFetcher> = {
    '/': async(context): Promise<IHomePageData> => {
        const restaurants = await context.getRestaurants(50, 0);

        return { restaurants };
    },

    '/restaurant/:restaurantId': async(context, route): Promise<IRestaurantPageData> => {
        const restaurantId = Number(route.params.restaurantId);
        const restaurant = await context.getRestaurantById(restaurantId);

        if (!restaurant) throw new Error('Restaurant not found');

        const categories = await context.getCategoriesOfRestaurant(restaurant.id);
        const dishes = await context.getDishes(restaurant.id);
        const average = await context.getRestaurantAverageRating(restaurant.id);
        const branches = await context.getBranches(restaurant.id);

        return { restaurant, dishes, categories, average, branches };
    },

    '/restaurant/:restaurantId/dish/:dishId': async(context, route): Promise<IDishPageData> => {
        const params = route.params;
        const restaurantId = Number(params.restaurantId);
        const dishId = Number(params.dishId);

        const restaurant = await context.getRestaurantById(restaurantId);

        if (!restaurant) throw new Error('Restaurant not found');

        const dish = await context.getDishById(restaurant.id, dishId);

        if (!dish) throw new Error('Dish not found');

        const reviews = await context.getReviewsByDishId(dish.id, 50, 0);

        return { restaurant, dish, reviews };
    },

    '/categories': async(context) => {
        const categories = await context.getCategories();
        return { categories };
    },
};

/**
 * Возвращает данные из базы данныз для серверного рендера страницы
 * @param context Контекст запроса пользователя
 * @param route Сработавший маршрут
 */
export const getDataByRoute = (context: UserContext, route: RouteMatch) => {
    const path = route.route.path!;

    return path in fetchers
        ? fetchers[path](context, route)
        : {};
};
