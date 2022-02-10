import * as React from 'react';
import type { IList } from '@typings';
import type { ICategory, IDish, IRestaurant } from '@typings/objects';
import GlobalContext from '@components/GlobalContext';
import Dish from '@components/Dish';

import { dishListCn, dishListControlsCn, dishListItemsCn } from './const';
import { DishFilter, dishFilters, RateState } from './filters';
import { dishSort, SortType } from './sort';
import CategoryList from '@components/CategoryList';

type IDishListProps = {
    restaurant: IRestaurant;
    dishes: IList<IDish>;
    categories?: ICategory[];
};

const DishList: React.FC<IDishListProps> = ({ restaurant, dishes, categories }) => {
    const globalContext = React.useContext(GlobalContext);
    const [category, setCategory] = React.useState<ICategory | undefined>();
    const [mineRating, setMineRating] = React.useState<boolean>(false);
    const [minRating, setMinRating] = React.useState<number | undefined>();
    const [rateStatus, setRateStatus] = React.useState<RateState | undefined>();
    const [sortType, setSortType] = React.useState<SortType>(SortType.ID_ASC);

    const filters = React.useMemo(() => {
        const filters: [DishFilter, any][] = [];

        if (category) filters.push([dishFilters.category, category.id]);
        if (minRating) filters.push([mineRating ? dishFilters.minMineRating : dishFilters.minRating, minRating]);
        if (rateStatus) filters.push([dishFilters.rateStatus, rateStatus]);

        return filters;
    }, [category, minRating, rateStatus, sortType, mineRating]);

    const readyDishItems = React.useMemo<IDish[]>(() => {
        const filtered = !filters.length
            ? dishes.items
            : dishes.items.filter(dish => filters.every(([filter, value]) => filter(dish, value)));

        return filtered.sort(dishSort[sortType])
    }, [dishes, filters]);

    const {
        onMinRatingChange,
        onRateStatusChange,
        onSortChange,
        onMineRatingChange,
    } = React.useMemo(() => ({
        onMinRatingChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectValue = (event.target as HTMLSelectElement).value;

            setMinRating(!selectValue ? undefined : +selectValue);
        },
        onRateStatusChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
            const selectValue = (event.target as HTMLSelectElement).value;

            setRateStatus(!selectValue ? undefined : selectValue as RateState);
        },
        onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => {
            setSortType((event.target as HTMLSelectElement).value as SortType);
        },
        onMineRatingChange: (event: React.ChangeEvent<HTMLInputElement>) => {
            setMineRating((event.target as HTMLInputElement).checked);
        },
    }), []);

    return (
        <div className={dishListCn}>
            <div className={dishListControlsCn}>
                {categories && (
                    <CategoryList
                        categories={categories}
                        onChange={setCategory}
                        selected={category}
                    />
                )}
                {globalContext.user && (
                    <select onChange={onRateStatusChange}>
                        <option value="">Всё</option>
                        <option value={RateState.RATED}>оценено мной</option>
                        <option value={RateState.NOT_RATED}>не оценено мной</option>
                    </select>
                )}
                <select onChange={onMinRatingChange}>
                    <option value="">Любая оценка</option>
                    <option value={5}>5 и выше</option>
                    <option value={6}>6 и выше</option>
                    <option value={7}>7 и выше</option>
                    <option value={8}>8 и выше</option>
                    <option value={9}>9 и выше</option>
                    <option value={9.5}>9.5 и выше</option>
                </select>
                <select onChange={onSortChange} value={sortType}>
                    <option value={SortType.ID_ASC}>по дате добавления (сначала ранние)</option>
                    <option value={SortType.ID_DESC}>по дате добавления (сначала поздние)</option>
                    <option value={SortType.RATING_ASC}>по рейтингу (сначала худшие)</option>
                    <option value={SortType.RATING_DESC}>по рейтингу (сначала лучшие)</option>
                </select>
                {globalContext.user && (
                    <label>
                        <input
                            type="checkbox"
                            checked={mineRating}
                            onChange={onMineRatingChange}
                        />
                        мои оценки
                    </label>
                )}
            </div>
            <div className={dishListItemsCn}>
                {readyDishItems.length ? readyDishItems.map(dish => (
                    <Dish
                        key={dish.id}
                        restaurant={restaurant}
                        dish={dish}
                        showMineRating={mineRating}
                    />
                )) : (
                    <div>{filters.length ? 'По таким параметрам блюд не найдено' : 'Нет блюд'}</div>
                )}
            </div>
        </div>
    );
};

export default DishList;
