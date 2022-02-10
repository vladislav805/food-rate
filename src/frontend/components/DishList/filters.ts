import type { IDish } from '@typings/objects';

export type DishFilter = (dish: IDish, value: any) => boolean;

export enum RateState {
    RATED = 'RATED',
    NOT_RATED = 'NOT_RATED',
}

type DishFilterKey =
    | 'category'
    | 'minRating'
    | 'minMineRating'
    | 'rateStatus';

export const dishFilters: Record<DishFilterKey, DishFilter> = {
    category: (dish, value: number) => dish.categoryId === value,
    minRating: (dish, value: number) => dish.rateValue! >= value,
    minMineRating: (dish, value: number) => dish.rateMine! >= value,
    rateStatus: (dish, value: RateState) => {
        const hasRate = Boolean(dish.rateMine);
        return value === RateState.RATED && hasRate || value === RateState.NOT_RATED && !hasRate;
    },
};
