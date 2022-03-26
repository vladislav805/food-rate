import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';
import { bind } from '@utils/bind';

import type { IDataProvider } from './typings';
import type { IUserPageData } from '@pages/UserPage';

type Params = Record<string, string | number | boolean>;
type TrueParams = Record<string, string>;

export default class ClientDataProvider implements IDataProvider {
    public getInitialData() {
        return null;
    }

    protected async request<T>(url: string, params: Params = {}): Promise<T> {
        params.ajax = '1';
        const queryString = new URLSearchParams(params as TrueParams);

        const request = await fetch(`${url}?${queryString}`, {
            mode: 'cors',
            method: 'get',
        });

        return request.json();
    }

    @bind
    public getHome() {
        return this.request<IHomePageData>('/');
    }

    @bind
    public getRestaurantById(restaurantId: number) {
        return this.request<IRestaurantPageData>(`/restaurant/${restaurantId}`);
    };

    @bind
    public getDishById(restaurantId: number, dishId: number) {
        return this.request<IDishPageData>(`/restaurant/${restaurantId}/dish/${dishId}`);
    }

    @bind
    public getCategories() {
        return this.request<ICategoriesPageData>(`/categories`);
    }

    @bind
    public getUserById(userId: number) {
        return this.request<IUserPageData>(`/user/${userId}`);
    }
}
