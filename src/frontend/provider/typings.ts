import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';

export interface IDataProvider {
    /**
     * Возвращает начальные данные для гидрации страницы
     */
    getInitialData(): unknown;

    /**
     * Информация на главной странице
     */
    getHome(): Promise<IHomePageData>;

    /**
     * Информация о заведении
     * @param restaurantId
     */
    getRestaurantById(restaurantId: number): Promise<IRestaurantPageData>;

    /**
     * Информация о блюде в заведении
     * @param restaurantId
     * @param dishId
     */
    getDishById(restaurantId: number, dishId: number): Promise<IDishPageData>;

    /**
     * Список категорий
     */
    getCategories(): Promise<ICategoriesPageData>;
}
