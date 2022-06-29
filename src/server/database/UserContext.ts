import { Op } from 'sequelize';
import type { IList } from '@typings';
import type { ICategory, IDish, IRegion, IRestaurant, IReview, IUser } from '@typings/objects.js';
import Auth from '@database/models/auth';
import User from '@database/models/user';
import Category from '@database/models/category';
import Restaurant, { RestaurantType } from '@database/models/restaurant';
import Dish from '@database/models/dish';
import Review from '@database/models/review';
import Branch from '@database/models/branch';
import Region from '@database/models/region';
import sequelize from '@database';
import { createAuthHash } from '@database/createAuthHash';
import createOffsetObject from '@server/utils/createOffsetObject';
import type { AuthorizationServiceName, IUserInfo } from '@frontend/external/authorize/typings';
import type { IUserStatistics } from '@typings/synthetic';

const attributesTimestamps = ['createdAt', 'updatedAt'];

const excludedAttributes = {
    __timestamps: attributesTimestamps,
    user: [...attributesTimestamps, 'vkId', 'googleId', 'telegramId', 'regionCode'] as (keyof User)[],
    restaurant: [...attributesTimestamps, 'instagram', 'vk'] as (keyof Restaurant)[],
    branch: [...attributesTimestamps, 'regionId', 'restaurantId'] as (keyof Branch)[],
    dish: [...attributesTimestamps, 'description'] as (keyof Dish)[],
};

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
                    exclude: excludedAttributes.user,
                },
            }],
            where: { hash },
            attributes: {
                exclude: attributesTimestamps,
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
     *
     * Категории
     *
     */
    /**
     * Возвращает список категорий
     */
    public async getCategories(): Promise<IList<ICategory>> {
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
     * Удаляет категорию по её идентификатору
     * @param categoryId Идентификатор категории
     */
    public async deleteCategory(categoryId: number): Promise<boolean> {
        if (!this.user) throw new Error('Access denied');

        const result = await Category.destroy({ where: { id: categoryId } });

        return result > 0;
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
     *
     * Пользователи
     *
     */
    /**
     * Возвращает информацию о пользователе по идентификатору
     * @param userId Идентификатор пользователя
     */
    public getUserById(userId: number): Promise<User | null> {
        return User.findOne({
            include: {
                model: Region,
                as: 'region',
            },
            attributes: {
                exclude: excludedAttributes.user,
            },
            where: { id: userId },
        });
    }

    public async getUserStatistics(userId: number): Promise<IUserStatistics | null> {
        const visitedRestaurants = await Review.findOne({
            attributes: [
                [sequelize.fn('count', (sequelize.fn('distinct', sequelize.col('restaurantId')))), 'rateCount'],
            ],
            where: { userId },
            include: {
                attributes: [],
                model: Dish,
                as: 'dish',
                required: true,
            },
            raw: true,
        });

        const countOfTestedDishes = await Review.count({ where: { userId } });

        const avg = await Review.findOne({
            attributes: [
                [sequelize.fn('round', sequelize.fn('avg', sequelize.col('review.rate')), 2), 'rate'],
            ],
            where: { userId },
        });

        if (!avg || !visitedRestaurants) return null;

        const countOfVisitedRestaurants = Number(visitedRestaurants.rateCount); // чтобы не добавлять новое поле
        const averageRating = Number(avg.rate);

        return {
            countOfVisitedRestaurants,
            countOfTestedDishes,
            averageRating,
        };
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
            include: {
                model: User,
                as: 'user',
            },
            limit,
            offset,
            raw: true,
            nest: true,
        });

        return {
            count,
            items: rows as unknown as IReview[],
            offset: createOffsetObject(offset, count, limit),
        };
    }

    /**
     *
     * Заведения
     *
     */
    /**
     * Возвращает список заведений
     * @param limit Максимальное количество, которое нужно вернуть
     * @param offset Сдвиг выборки
     */
    public async getRestaurants(limit: number, offset = 0): Promise<IList<Restaurant>> {
        const { count, rows } = await Restaurant.findAndCountAll({
            limit,
            offset,
            attributes: {
                exclude: excludedAttributes.restaurant,
            },
        });

        return {
            count,
            items: rows,
            offset: createOffsetObject(offset, count, limit),
        };
    }

    /**
     * Создаёт заведение
     * @param params Информация о заведении
     */
    public async addRestaurant(params: {
        title: string;
        type: RestaurantType;
        description: string;
        instagram: string;
        vk: string;
    }): Promise<Restaurant> {
        if (!this.user) throw new Error('Access denied');

        return Restaurant.create(params);
    }

    /**
     * Возврщает заведение по его идентификатору
     * @param restaurantId Идентификатор заведения, информацию о котором нужно вернуть
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
            raw: true,
        });

        if (!result) return { count: 0, value: 0 };

        const { rateValue, rateCount } = result;

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
     * Возвращает заведения для подсказок
     * @param query Поисковый запрос
     * @param limit Максимальное количество элементов
     */
    public suggestRestaurants(query: string, limit: number): Promise<IRestaurant[]> {
        return Restaurant.findAll({
            where: {
                title: {
                    [Op.like]: `%${query.toLowerCase()}%`,
                },
            },
            limit,
            attributes: {
                exclude: [...excludedAttributes.restaurant, 'description'],
            },
        });
    }

    /**
     *
     * Филиалы заведений
     *
     */
    /**
     * Возвращает информацию о филиалах ресторана/кафе
     * @param restaurantId Идентификатор заведения, филиалы которого нужно вернуть
     */
    public async getBranches(restaurantId: number): Promise<IList<Branch>> {
        const { count, rows } = await Branch.findAndCountAll({
            attributes: {
                exclude: excludedAttributes.branch,
            },
            include: {
                model: Region,
                as: 'region',
            },
            where: { restaurantId },
        });

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
     * @param regionCode Региональный код
     */
    public async createBranch(restaurantId: number, address: string, latitude: number, longitude: number, regionCode: string): Promise<Branch> {
        if (!this.auth) throw new Error('Access denied');

        return Branch.create({ restaurantId, address, latitude, longitude, regionCode });
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
            raw: true,
            nest: true,
        });

        const items = rows as unknown as IDish[];

        return { count, items };
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
            raw: true,
            nest: true,
        });

        return dish
            ? dish as unknown as IDish
            : null;

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
     * Возвращает блюда для подсказок
     * @param query Поисковый запрос
     * @param limit Максимальное количество элементов
     */
    public suggestDishes(query: string, limit: number): Promise<Dish[]> {
        return Dish.findAll({
            where: {
                title: {
                    [Op.like]: `%${query.toLowerCase()}%`,
                },
            },
            limit,
            attributes: {
                include: [
                    [sequelize.fn('get_avg_rate_by_dish', sequelize.col('dish.id')), 'rateValue'],
                    [sequelize.fn('get_count_rate_by_dish', sequelize.col('dish.id')), 'rateCount'],
                ],
                exclude: excludedAttributes.dish,
            },
            include: {
                model: Category,
                as: 'category',
            },
        });
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
                    exclude: excludedAttributes.user,
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
                    exclude: excludedAttributes.user,
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
                    exclude: excludedAttributes.user,
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

    /**
     *
     * Регионы
     *
     */
    /**
     * Попытка добавить регион в БД. Игнорируем ошибки, поскольку регион уже может существовать.
     * TODO: Передать как-то более нормально
     * @param code Код региона в ISO-3166-2. Например, Санкт-Петербург: RU-SPE; Москва - RU-MOW; Ленобласть - RU-LEN.
     * @param country Название страны
     * @param region Название области
     * @param city Название города
     */
    public async tryPushRegion(code: string, country: string, region: string, city: string): Promise<void> {
        try {
            await Region.create({ code, country, region, city });
        } catch (e) { console.info(`Region ${code} already exists`) }
    }

    /**
     * Возвращает список регионов
     * @param limit Требуемое количество элементов
     * @param offset Сдвиг выборки
     */
    public async getRegions(limit: number = 100, offset: number = 0): Promise<IList<IRegion>> {
        const { count, rows } = await Region.findAndCountAll({ limit, offset });

        return { count, items: rows };
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
