import type { IHomePageData } from '@pages/HomePage';
import type { IRestaurantPageData } from '@pages/RestaurantPage';
import type { IDishPageData } from '@pages/DishPage';
import type { ICategoriesPageData } from '@pages/CategoriesPage';
import type { IUserPageData } from '@pages/UserPage';
import type { IDishCreatePageData } from '@pages/NewDishPage';
import type { IDish } from '@typings/objects';

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
     * Информация, требуемая на форме создания блюда в заведении
     * @param restaurantId
     */
    preCreateDishData(restaurantId: number): Promise<IDishCreatePageData>;

    /**
     * Создание нового блюда в заведении. ТОЛЬКО КЛИЕНТСКАЯ РЕАЛИЗАЦИЯ!
     * @param restaurantId
     * @param title
     * @param description
     * @param categoryId
     */
    createDish(restaurantId: number, title: string, description: string, categoryId: number): Promise<IDish>;

    /**
     * Список категорий
     */
    getCategories(): Promise<ICategoriesPageData>;

    /**
     * Информация о пользователе
     * @param userId
     */
    getUserById(userId: number): Promise<IUserPageData>;
}
