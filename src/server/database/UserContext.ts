import { Op } from 'sequelize';
import type { IList } from '@typings';
import type { IDish, IReview, IUser } from '@typings/objects';
import Auth from '@database/models/auth';
import User from '@database/models/user';
import Category from '@database/models/category';
import Restaurant from '@database/models/restaurant';
import Dish from '@database/models/dish';
import Review from '@database/models/review';
import Branch from '@database/models/branch';
import sequelize from '@database';
import { createAuthHash } from '@database/createAuthHash';
import createOffsetObject from '@server/utils/createOffsetObject';
import type { AuthorizationServiceName, IUserInfo } from '@frontend/external/authorize/typings';

export class UserContext {
    protected readonly user?: User;

    public constructor(
        protected readonly auth: Auth | undefined,
    ) {
        this.user = auth?.user;
    }

    /**
     * Авторизован ли?
     */
    public isAuthorized(): boolean {
        return Boolean(this.user);
    }

    /**
     * Возвращает информацию о текущей авторизации
     */
    public getAuth(): Auth | undefined {
        return this.auth;
    }

    public getUser(): IUser | undefined {
        return this.user;
    }

    public async findUserByService(service: AuthorizationServiceName, id: string): Promise<IUser | null> {
        return User.findOne({
            where: { [`${service}Id`]: id },
        });
    }

    /**
     * Создаёт пользователя
     */
    public async createUser(info: IUserInfo): Promise<IUser> {
        if (this.auth) throw new Error('Already authorized');

        let user = await this.findUserByService(info.service, info.id);

        if (!user) {
            user = await User.create({
                [`${info.service}Id`]: info.id,
                name: info.name,
                photoLarge: info.photoLarge,
                photoSmall: info.photoSmall,
                role: 'user',
            });
        }

        return user;
    }

    public async createAuth(user: IUser): Promise<Auth> {
        if (this.auth) throw new Error('Already authorized');

        const hash = createAuthHash(user.id);

        return Auth.create({
            userId: user.id,
            hash,
        });
    }

    /**
     * Возвращает авторизацию по авторизационному ключу
     * @param hash Авторизационный ключ
     */
    public async getAuthByHash(hash: string): Promise<Auth | null> {
        return Auth.findOne({
            include: [{
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            }],
            where: { hash },
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
        });
    }

    /**
     * Завершает текущую авторизационную сессию
     */
    public async killAuth(): Promise<void> {
        if (!this.auth) throw new Error('Access denied');

        const hash = this.auth.hash;

        contexts.set(hash, defaultContext);
        await Auth.destroy({ where: { hash } });
    }

    /**
     * Возвращает список категорий
     */
    public async getCategories(): Promise<IList<Category>> {
        const { count, rows } = await Category.findAndCountAll();

        return { count, items: rows };
    }

    /**
     * Создаёт категорию
     * @param title Название категории
     */
    public createCategory(title: string): Promise<Category> {
        if (!this.user) throw new Error('Access denied');

        return Category.create({ title });
    }

    /**
     * Возвращает список из категорий, блюда которых представлены в конкретном ресторане/кафе
     * @param restaurantId Идентификатор ресторана, для которого нужно вернуть категории
     */
    public getCategoriesOfRestaurant(restaurantId: number): Promise<Category[]> {
        return Category.findAll({
            include: {
                model: Dish,
                attributes: [],
                as: 'dish',
                where: { restaurantId },
            },
        });
    }

    /**
     * Возвращает информацию о пользователе по идентификатору
     * @param userId Идентификатор пользователя
     */
    public getUserById(userId: number): Promise<User | null> {
        return User.findOne({ where: { id: userId } });
    }

    /**
     * Возвращает отзывы от конкретного пользователя
     * @param userId Идентификатор пользователя, отзывы которого нужно получить
     * @param limit Количество отзывов сколько нужно вернуть
     * @param offset Сдвиг выборки
     */
    public async getReviewsByUser(userId: number, limit: number, offset = 0): Promise<IList<IReview>> {
        const { count, rows } = await Review.findAndCountAll({
            where: { userId },
            limit,
            offset,
        });

        return {
            count,
            items: rows.map(review => review.toJSON()),
            offset: createOffsetObject(offset, count, limit),
        };
    }

    public async getReviewedRestaurantsByUser(userId: number, limit: number, offset = 0): Promise<IList<IReview>> {
        return { count: 0, items: [] };
    }

    /**
     * Возвращает список ресторанов/кафе
     * @param limit Максимальное количество, которое нужно вернуть
     * @param offset Сдвиг выборки
     */
    public async getRestaurants(limit: number, offset = 0): Promise<IList<Restaurant>> {
        const { count, rows } = await Restaurant.findAndCountAll({
            limit,
            offset,
        });

        return {
            count,
            items: rows,
            offset: createOffsetObject(offset, count, limit),
        };
    }

    /**
     * Создаёт ресторан/кафе
     * @param title Название ресторана/кафе
     * @param description Описание
     */
    public async addRestaurant(title: string, description: string): Promise<Restaurant> {
        if (!this.user) throw new Error('Access denied');

        return Restaurant.create({ title, description });
    }

    /**
     * Возврщает ресторан/кафе по его идентификатору
     * @param restaurantId Идентификатор ресторана/кафе, информацию о котором нужно вернуть
     */
    public getRestaurantById(restaurantId: number): Promise<Restaurant | null> {
        return Restaurant.findOne({ where: { id: restaurantId } });
    }

    /**
     * Возвращает количество отзывов и среднее значение оценок по всем блюдам конкретного ресторана/кафе
     * @param restaurantId Идентификатор заведения, отзывы о котором нужно вернуть
     */
    public async getRestaurantAverageRating(restaurantId: number): Promise<{ count: number; value: number }> {
        const result = await Review.findOne({
            attributes: [
                [sequelize.fn('round', sequelize.fn('avg', sequelize.col('review.rate')), 2), 'rateValue'],
                [sequelize.fn('count', sequelize.col('review.id')), 'rateCount'],
            ],
            include: {
                model: Dish,
                attributes: [],
                where: { restaurantId },
                as: 'dish',
            },
        });

        if (!result) return { count: 0, value: 0 };

        const { rateValue, rateCount } = result.toJSON<IReview>();

        const value = Number(rateValue);
        const count = Number(rateCount);

        return { count, value };
    }

    /**
     * Пытается найти рестораны/кафе по подстроке
     * @param query Поисковый запрос
     * @param limit Максимальное количество элементов, которое нужно вернуть
     * @param offset Сдвиг выборки
     */
    public async findRestaurants(query: string, limit: number, offset = 0): Promise<IList<Restaurant>> {
        const { count, rows } = await Restaurant.findAndCountAll({
            where: {
                [Op.or]: [sequelize.where(sequelize.fn('lower', sequelize.col('title')), query.toLowerCase())],
            },
            limit,
            offset,
        });

        return {
            count,
            items: rows,
            offset: createOffsetObject(offset, count, limit),
        };
    }

    /**
     * Возвращает информацию о филиалах ресторана/кафе
     * @param restaurantId Идентификатор заведения, филиалы которого нужно вернуть
     */
    public async getBranches(restaurantId: number): Promise<IList<Branch>> {
        const { count, rows } = await Branch.findAndCountAll({ where: { restaurantId } });

        return { count, items: rows };
    }

    /**
     * Возвращает информацию о филиале ресторана/кафе по идентификатору
     * @param restaurantId Идентификатор заведения, которому принадлежит филиал
     * @param branchId Идентификатор филиала
     */
    public async getBranchById(restaurantId: number, branchId: number): Promise<Branch | null> {
        return Branch.findOne({ where: { restaurantId, id: branchId } });
    }

    /**
     * Создаёт филиал заведения
     * @param restaurantId Идентификатор заведения, которому принадлежит филиал
     * @param address Адрес в свободной форме
     * @param latitude Координаты: широта
     * @param longitude Координаты: долгота
     */
    public async createBranch(restaurantId: number, address: string, latitude: number, longitude: number): Promise<Branch> {
        if (!this.auth) throw new Error('Access denied');

        return Branch.create({ restaurantId, address, latitude, longitude });
    }


    /**
     * Возвращает блюда заведения
     * @param restaurantId Идентификатор заведения, блюда которого нужно вернуть
     */
    public async getDishes(restaurantId: number): Promise<IList<IDish>> {
        const userId = this.user?.id ?? 0;
        const { count, rows } = await Dish.findAndCountAll({
            where: { restaurantId },
            include: [
                {
                    model: Category,
                    as: 'category',
                },
            ],
            attributes: {
                include: [
                    [sequelize.fn('get_avg_rate_by_dish', sequelize.col('dish.id')), 'rateValue'],
                    [sequelize.fn('get_count_rate_by_dish', sequelize.col('dish.id')), 'rateCount'],
                    [userId ? sequelize.fn('get_dish_rate_of_user', sequelize.col('dish.id'), sequelize.literal(String(userId))) : sequelize.literal('0'), 'rateMine'],
                ],
            },
        });

        return {
            count,
            items: rows.map(item => item.toJSON()),
        };
    }

    /**
     * Возвращает блюдо ресторана по его идентификатору
     * @param restaurantId Идентификатор заведения, в котором есть это блюдо
     * @param dishId Идентификатор блюда
     */
    public async getDishById(restaurantId: number, dishId: number): Promise<IDish | null> {
        const dish = await Dish.findOne({
            where: {restaurantId, id: dishId},
            include: {
                model: Category,
                as: 'category',
            },
            attributes: {
                include: [
                    [sequelize.fn('get_avg_rate_by_dish', sequelize.col('dish.id')), 'rateValue'],
                    [sequelize.fn('get_count_rate_by_dish', sequelize.col('dish.id')), 'rateCount'],
                ],
            },
        });

        if (!dish) return null;

        return dish.toJSON();
    }

    /**
     * Создаёт блюдо в заведении
     * @param restaurantId Идентификатор заведения
     * @param title Название блюда
     * @param description Описание блюда
     * @param categoryId Идентификатор категории, к которому относится блюдо
     */
    public createDish(restaurantId: number, title: string, description: string, categoryId: number): Promise<Dish> {
        if (!this.user) throw new Error('Access denied');

        return Dish.create({ restaurantId, categoryId, title, description });
    }

    /**
     * Возвращает список отзывов на блюдо в заведении
     * @param dishId Идентификатор блюда
     * @param limit Максимальное количество отзывов, которое нужно вернуть
     * @param offset Сдвиг выборки
     */
    public async getReviewsByDishId(dishId: number, limit: number, offset = 0): Promise<IList<IReview>> {
        const { count, rows } = await Review.findAndCountAll({
            where: { dishId },
            limit,
            offset,
            include: {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
        });

        return {
            count,
            items: rows.map(row => row.toJSON()),
            offset: createOffsetObject(offset, count, limit),
        };
    }

    /**
     * Возвращает отзыв на блюда от конкретного пользователя или null
     * @param dishId Идентификатор блюда
     * @param userId Идентификатор пользователя
     */
    public async getReviewOfDishByUser(dishId: number, userId: number | undefined = this.user?.id): Promise<IReview | null> {
        if (userId === undefined) return null;

        const review = await Review.findOne({
            where: { dishId, userId },
            include: {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
        });

        return review as IReview | null;
    }

    /**
     * Создаёт отзыв на блюдо в ресторане
     * @param dishId Идентификатор блюда
     * @-param branchId Идентификатор филиала заведения
     * @param rate Оценка (1-10)
     * @param text Текст отзыва
     */
    public async createReview(dishId: number, rate: number, text: string): Promise<IReview> {
        if (!this.user) throw new Error('Access denied');
console.log({userId: this.user.id, dishId, rate, text});
        const review = await Review.create({
            userId: this.user.id,
            dishId,
            branchId: null,
            rate,
            text,
        }, {
            include: {
                model: User,
                as: 'user',
                attributes: {
                    exclude: ['createdAt', 'updatedAt'],
                },
            },
        });

        return review as unknown as IReview;
    }

    /**
     * Удаляет отзыв на блюдо в заведении
     * @param dishId Идентификатор блюда
     * @param reviewId Идентификатор отзыва
     */
    public async deleteReview(dishId: number, reviewId: number): Promise<boolean> {
        if (!this.user) throw new Error('Access denied');

        const affected = await Review.destroy({ where: { id: reviewId, userId: this.user.id } });

        return affected > 0;
    }
}

const contexts = new Map<string | undefined, UserContext>();
const defaultContext = new UserContext(undefined);
contexts.set(undefined, defaultContext);

export async function getUserContextByHash(hash: string | undefined): Promise<UserContext> {
    if (!hash) return defaultContext;

    if (!contexts.has(hash)) {
        const auth = await defaultContext.getAuthByHash(hash);
        contexts.set(hash, new UserContext(auth!));
    }

    return contexts.get(hash) ?? defaultContext;
}
