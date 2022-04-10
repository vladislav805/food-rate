import * as React from 'react';
import HomePage from '@pages/HomePage';
import RestaurantPage from '@pages/RestaurantPage';
import DishPage from '@pages/DishPage';
import { RouteMatch } from 'react-router';
import CategoriesPage from '@pages/CategoriesPage';
import NewRestaurantPage from '@pages/NewRestaurantPage';
import SearchPage from '@pages/SearchPage';
import UserPage from '@pages/UserPage';
import NewDishPage from '@pages/NewDishPage';
import NewBranchPage from '@pages/NewBranchPage';

export type Route = {
    path: string;
    component: React.ComponentType<any>;
    getKey: (route: RouteMatch, query: Record<string, string>) => string;
};

/**
 * Описание роутинга в проекте
 * Прокидывается на серверном рендеринге и в клиентский.
 * НЕ КЛАСТЬ СЮДА СЕРВЕРНЫЙ КОД
 *
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * !! ПРИ ДОБАВЛЕНИИ НОВОГО ПУТИ НЕ ЗАБЫТЬ ДОБАВИТЬ ЕГО В /pages@server.ts !!
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
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
        getKey: () => `r/n`,
    },
    {
        path: '/restaurant/:restaurantId',
        component: RestaurantPage,
        getKey: route => `r${route.params.restaurantId}`,
    },
    {
        path: '/restaurant/:restaurantId/dish/new',
        component: NewDishPage,
        getKey: route => `r${route.params.restaurantId}/new`,
    },
    {
        path: '/restaurant/:restaurantId/dish/:dishId',
        component: DishPage,
        getKey: route => `r${route.params.restaurantId}/d${route.params.dishId}`,
    },
    {
        path: '/restaurant/:restaurantId/branch/new',
        component: NewBranchPage,
        getKey: route => `r/${route.params.restaurantId}/b/new`,
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
    {
        path: '/user/:userId',
        component: UserPage,
        getKey: route => `u${route.params.userId}`,
    },
    // /map
    // /page/:name
];

export default routes;
