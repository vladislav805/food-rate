import * as React from 'react';
import type { IList } from '@typings';
import type { ICategory, IDish, IRestaurant } from '@typings/objects';
import GlobalContext from '@components/GlobalContext';
import Dish from '@components/Dish';
import CategoryList from '@components/CategoryList';
import Select, { ISelectItem, SelectChanger } from '@components/Select';

import { dishListCn, dishListControlsCn, dishListItemsCn, dishListFiltersCn } from './const';
import { DishFilter, dishFilters, RateState } from './filters';
import { dishSort, SortType } from './sort';

type IDishListProps = {
    restaurant: IRestaurant;
    dishes: IList<IDish>;
    categories?: ICategory[];
};

const filterItems: ISelectItem[] = [
    { title: 'Всё', value: '' },
    { title: 'Оценено мной', value: RateState.RATED },
    { title: 'Не оценено мной', value: RateState.NOT_RATED },
];

const minRatingItems: ISelectItem[] = [
    { title: 'Любая оценка', value: 0 },
    { title: '5 и выше', value: 5 },
    { title: '6 и выше', value: 6 },
    { title: '7 и выше', value: 7 },
    { title: '8 и выше', value: 8 },
    { title: '9 и выше', value: 9 },
    { title: '9.5 и выше', value: 9.5 },
];

const sortItems: ISelectItem[] = [
    { title: 'по дате добавления (сначала ранние)', value: SortType.ID_ASC },
    { title: 'по дате добавления (сначала поздние)', value: SortType.ID_DESC },
    { title: 'по рейтингу (сначала худшие)', value: SortType.RATING_ASC },
    { title: 'по рейтингу (сначала лучшие)', value: SortType.RATING_DESC },
];

const DishList: React.FC<IDishListProps> = ({ restaurant, dishes, categories }) => {
    const globalContext = React.useContext(GlobalContext);
    const [category, setCategory] = React.useState<ICategory | undefined>();
    const [mineRating, setMineRating] = React.useState<boolean>(false);
    const [minRating, setMinRating] = React.useState<number>(0);
    const [rateStatus, setRateStatus] = React.useState<RateState | ''>('');
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
        onMineRatingChange,
    } = React.useMemo(() => ({
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
                <div className={dishListFiltersCn}>
                    {globalContext.user && (
                        <Select
                            items={filterItems}
                            value={rateStatus}
                            setValue={setRateStatus as SelectChanger}
                            inline
                        />
                    )}
                    <Select
                        items={minRatingItems}
                        value={minRating}
                        setValue={setMinRating as SelectChanger}
                        inline
                    />
                    <Select
                        items={sortItems}
                        value={sortType}
                        setValue={setSortType as SelectChanger}
                        inline
                    />
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
