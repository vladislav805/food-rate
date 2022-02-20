import * as React from 'react';
import type { IList } from '@typings';
import type { ICategory, IDish, IRestaurant, IReview } from '@typings/objects';
import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';
import { RestaurantType } from '@database/models/restaurant';

type Params = Record<string, string | number | boolean>;
type TrueParams = Record<string, string>;

async function request<T>(url: string, params: Params = {}): Promise<T> {
    params.ajax = '1';
    const queryString = new URLSearchParams(params as TrueParams);

    const request = await fetch(`${url}?${queryString}`, {
        mode: 'cors',
        method: 'get',
    });

    return request.json();
}

async function apiRequest<T>(method: string, params: Params = {}): Promise<T> {
    const request = await fetch(`/api/v1/${method}`, {
        mode: 'cors',
        method: 'post',
        cache: 'no-cache',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    const result = await request.json();

    if ('error' in result) {
        throw result.error;
    }

    return result.result as T;
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


    /**
     *
     * API
     *
     */

    getCategories: async() => apiRequest<IList<ICategory>>('getCategories'),

    addCategory: async(params: { title: string }) => apiRequest<ICategory>('addCategory', params),

    deleteCategory: async(params: { categoryId: number }) => apiRequest<boolean>('deleteCategory', params),

    addDish: async(params: { restaurantId: number; title: string; description: string; categoryId: number }) => {
        return apiRequest<IDish>('addDish', params);
    },

    getReviews: async(params: Record<string, number>) => {
        return apiRequest<IList<IReview>>('reviews', params);
    },

    addReview: async(params: { dishId: number; text: string; rate: number }) => {
        return apiRequest<IReview>('addReview', params);
    },

    deleteReview: async(params: { dishId: number, reviewId: number}) => {
        return apiRequest<boolean>('deleteReview', params);
    },

    addRestaurant: async(params: { title: string; description: string; type: RestaurantType; vk: string; instagram: string }) => {
        return apiRequest<IRestaurant>('addRestaurant', params);
    },

    suggest: async(text: string) => apiRequest<{ restaurants: IRestaurant[]; dishes: IDish[] }>('suggest', { text }),
};
