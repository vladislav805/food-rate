import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';
import type { IUserPageData } from '@pages/UserPage';
import type { IDishCreatePageData } from '@pages/NewDishPage';
import type { IDish } from '@typings/objects';
import { bind } from '@utils/bind';

import type { IDataProvider } from './typings';

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

    protected async apiCall<T>(method: string, params: Params = {}): Promise<T> {
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
    public preCreateDishData(restaurantId: number): Promise<IDishCreatePageData> {
        return this.request<IDishCreatePageData>(`/restaurant/${restaurantId}/new`);
    }

    public createDish(restaurantId: number, title: string, description: string, categoryId: number): Promise<IDish> {
        return this.apiCall<IDish>('addDish', { restaurantId, title, description, categoryId });
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
