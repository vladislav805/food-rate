/**
 * Статистика по активности пользователя
 */
export interface IUserStatistics {
    /** Количество посещённых заведений */
    countOfVisitedRestaurants: number;

    /** Количество опробованных блюд */
    countOfTestedDishes: number;

    /** Средняя оценка всех отзывов пользователя */
    averageRating: number;
}
