import * as React from 'react';
import HomePage from '@pages/HomePage';
import RestaurantPage from '@pages/RestaurantPage';
import DishPage from '@pages/DishPage';
import { RouteMatch } from 'react-router';
import CategoriesPage from '@pages/CategoriesPage';
import NewRestaurantPage from '@pages/NewRestaurantPage';
import SearchPage from '@pages/SearchPage';

export type Route = {
    path: string;
    component: React.ComponentType<any>;
    getKey: (route: RouteMatch, query: Record<string, string>) => string;
};

/**
 * Описание роутинга в проекте
 * Прокидывается на серверном рендеринге и в клиентский.
 * НЕ КЛАСТЬ СЮДА СЕРВЕРНЫЙ КОД
 */
const routes: Route[] = [
    {
        path: '/',
        component: HomePage,
        getKey: () => 'home',
    },
    {
        path: '/restaurant/new',
        component: NewRestaurantPage,
        getKey: () => `new_rest`,
    },
    {
        path: '/restaurant/:restaurantId',
        component: RestaurantPage,
        getKey: route => `rest${route.params.restaurantId}`,
    },
    {
        path: '/restaurant/:restaurantId/dish/:dishId',
        component: DishPage,
        getKey: route => `dish${route.params.dishId}`,
    },
    // /restaurant/:restaurantId/branch/:branchId(\d+)
    {
        path: '/categories',
        component: CategoriesPage,
        getKey: () => 'categories',
    },
    {
        path: '/search',
        component: SearchPage,
        getKey: (route, query) => `search_${query.query}_${query.offset || 0}`,
    },
    // /map
    // /page/:name
];

export default routes;
