import { UserContext } from '@database/UserContext';
import type { IDish } from '@typings/objects';
import type { IDishCreatePageData } from '@pages/NewDishPage';

import type { IDataProvider } from './typings';
import { bind } from '@utils/bind';

export default class ServerDataProvider implements IDataProvider {
    public constructor(
        protected readonly context: UserContext,
    ) {}

    protected initialData: unknown;

    public getInitialData(): unknown {
        return this.initialData;
    }

    protected setAsInitialData<T>(data: T): T {
        this.initialData = data;
        return data;
    }

    @bind
    public async getHome() {
        const restaurants = await this.context.getRestaurants(50, 0);
        return this.setAsInitialData({ restaurants });
    }

    @bind
    public async getRestaurantById(restaurantId: number) {
        const restaurant = await this.context.getRestaurantById(restaurantId);

        if (!restaurant) throw new Error('Restaurant not found');

        const categories = await this.context.getCategoriesOfRestaurant(restaurant.id);
        const dishes = await this.context.getDishes(restaurant.id);
        const average = await this.context.getRestaurantAverageRating(restaurant.id);
        const branches = await this.context.getBranches(restaurant.id);

        return this.setAsInitialData({ restaurant, dishes, categories, average, branches });
    }

    @bind
    public async getDishById(restaurantId: number, dishId: number) {
        const restaurant = await this.context.getRestaurantById(restaurantId);

        if (!restaurant) throw new Error('Restaurant not found');

        const dish = await this.context.getDishById(restaurant.id, dishId);

        if (!dish) throw new Error('Dish not found');

        const reviews = await this.context.getReviewsByDishId(dish.id, 20, 0);

        const myReview = await this.context.getReviewOfDishByUser(dish.id, )

        return this.setAsInitialData({ restaurant, dish, reviews, myReview });
    }

    @bind
    public async preCreateDishData(restaurantId: number): Promise<IDishCreatePageData> {
        const restaurant = await this.context.getRestaurantById(restaurantId);

        if (!restaurant) throw new Error('Restaurant not found');

        const categories = await this.context.getCategories();

        return this.setAsInitialData({ restaurant, categories });
    }

    public createDish(restaurantId: number, title: string, description: string, categoryId: number): Promise<IDish> {
        throw new Error('Only client-side method');
    }

    @bind
    public async getCategories() {
        const categories = await this.context.getCategories();
        return this.setAsInitialData({ categories });
    }

    @bind
    public async getUserById(userId: number) {
        const user = await this.context.getUserById(userId);

        if (!user) throw new Error('User not found');

        const statistics = await this.context.getUserStatistics(userId);

        const reviews = await this.context.getReviewsByUser(userId, 10);

        return this.setAsInitialData({ user, statistics, reviews });
    }
}
