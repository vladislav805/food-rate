/**
 * Описание списка с количеством элементов
 */
export type IList<T> = {
    count: number;
    items: T[];
    offset?: IOffsetObject;
};

/**
 * Описание сдвига
 */
export type IOffsetObject = {
    current: number;
    next?: number;
};
