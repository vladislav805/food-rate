import { bind } from '@utils/bind';
import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';
import type { IUserPageData } from '@pages/UserPage';
import type { IDishCreatePageData } from '@pages/NewDishPage';
import type { IBranchCreatePageData } from '@pages/NewBranchPage';
import type { IBranch, IDish } from '@typings/objects';

import type { IDataProvider } from './typings';

type Params = Record<string, string | number | boolean>;
type TrueParams = Record<string, string>;

export default class ClientDataProvider implements IDataProvider {
    public getInitialData() {
        return null;
    }

    /**
     * Запрос данных для полноценной страницы.
     * @param url Адрес, по которому ожидается страница
     * @param params Параметры
     */
    protected async request<T>(url: string, params: Params = {}): Promise<T> {
        params.ajax = '1';
        const queryString = new URLSearchParams(params as TrueParams);

        const request = await fetch(`${url}?${queryString}`, {
            mode: 'cors',
            method: 'get',
        });

        return request.json();
    }

    /**
     * Запрос данных от API для частичного обновления/изменения данных
     * @param method Название метода API
     * @param params Параметры
     * @protected
     */
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
    }

    @bind
    public preCreateBranchData(restaurantId: number) {
        return this.request<IBranchCreatePageData>(`/restaurant/${restaurantId}/branch/new`);
    }

    @bind
    public createBranch(restaurantId: number, address: string, lat: number, lng: number, regionCode: string): Promise<IBranch> {
        return this.apiCall<IBranch>('addBranch', { restaurantId, address, lat, lng, regionCode });
    }

    @bind
    public getDishById(restaurantId: number, dishId: number) {
        return this.request<IDishPageData>(`/restaurant/${restaurantId}/dish/${dishId}`);
    }

    @bind
    public preCreateDishData(restaurantId: number) {
        return this.request<IDishCreatePageData>(`/restaurant/${restaurantId}/new`);
    }

    public createDish(restaurantId: number, title: string, description: string, categoryId: number) {
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
