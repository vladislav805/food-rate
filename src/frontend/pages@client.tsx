import * as React from 'react';
import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';

async function request<T>(url: string): Promise<T> {
    const request = await fetch(`${url}?ajax=1`, {
        mode: 'cors',
        method: 'get',

    });

    return request.json();
}

export const fetchers = {
    home: async() => {
        return request<IHomePageData>('/');
    },

    restaurant: async(params: Record<string, string>) => {
        return request<IRestaurantPageData>(`/restaurant/${params.restaurantId}`);
    },

    dish: async(params: Record<string, string>) => {
        return request<IDishPageData>(`/restaurant/${params.restaurantId}/dish/${params.dishId}`);
    },

    categories: async() => {
        return request<ICategoriesPageData>(`/categories`);
    },
};
