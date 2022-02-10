import type { IDish } from '@typings/objects';

export enum SortType {
    ID_ASC = 'ID_ASC', // по возрастанию
    ID_DESC = 'ID_DESC', // по убыванию
    RATING_DESC = 'RATING_DESC', // по убыванию
    RATING_ASC = 'RATING_ASC', // по возрастанию
}

type DishSortFunction = (a: IDish, b: IDish) => number;

export const dishSort: Record<SortType, DishSortFunction> = {
    [SortType.ID_ASC]: (a, b) => b.id - a.id,
    [SortType.ID_DESC]: (a, b) => a.id - b.id,
    [SortType.RATING_ASC]: (a, b) => a.rateValue! - b.rateValue!,
    [SortType.RATING_DESC]: (a, b) => b.rateValue! - a.rateValue!,
};
