import * as React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import type { IList } from '@typings';
import type { IBranch, ICategory, IDish, IRestaurant } from '@typings/objects';
import { useDataProvider } from '@frontend/provider';
import StarRatingStatic from '@components/StarRatingStatic';
import DishList from '@components/DishList';
import BranchList from '@components/BranchList';
import Tabs from '@components/Tabs';
import GlobalContext from '@components/GlobalContext';
import { useFetch } from '@utils/useFetch';
import { withNumericParams } from '@utils/withNumericParams';

import {
    restaurantPageCn,
    restaurantPageDescriptionCn,
    restaurantPageHeaderCn,
    restaurantPageTitleCn
} from './const';

import './RestaurantPage.scss';

export type IRestaurantPageData = {
    restaurant: IRestaurant;
    dishes: IList<IDish>;
    categories: ICategory[];
    branches: IList<IBranch>;
    average: { count: number; value: number };
};

const tabTitles: string[] = ['Блюда', 'Филиалы'];

const RestaurantPage: React.FC = () => {
    const provider = useDataProvider();
    const { restaurantId } = useParams();
    const { result, loading } = useFetch(`rest${restaurantId}`, provider.getRestaurantById, +restaurantId!);

    const [selectedTab, setSelectedTab] = React.useState<number>(0);
    const [visibleNewDishModal, setVisibleNewDishModal] = React.useState<boolean>(false);

    const globalContext = React.useContext(GlobalContext);
    const isAuthorized = Boolean(globalContext.user);

    const openNewDishModal = React.useCallback(() => setVisibleNewDishModal(true), [setVisibleNewDishModal]);

    if (!result || loading) return <>loading...</>;

    const { restaurant, dishes, categories, average, branches } = result;

    return (
        <div className={restaurantPageCn}>
            <div className={restaurantPageHeaderCn}>
                <h1 className={restaurantPageTitleCn}>{restaurant.title}</h1>
                {restaurant.description && (
                    <p className={restaurantPageDescriptionCn}>{restaurant.description}</p>
                )}
            </div>
            <StarRatingStatic
                value={average.value}
                count={average.count}
                large
                centered
                showValue
            />
            <Tabs
                titles={tabTitles}
                selectedIndex={selectedTab}
                setSelectedIndex={setSelectedTab}
            >
                <div>
                    {isAuthorized && (
                        <Link to={`/restaurant/${restaurant.id}/dish/new`}>Добавить блюдо</Link>
                    )}
                    <DishList
                        restaurant={restaurant}
                        dishes={dishes}
                        categories={categories}
                    />
                </div>
                <div>
                    {isAuthorized && (
                        <Link to={`/restaurant/${restaurant.id}/branch/new`}>Добавить филиал</Link>
                    )}
                    <BranchList branches={branches.items} />
                </div>
            </Tabs>
        </div>
    );
};


export default withNumericParams(RestaurantPage, ['restaurantId']);
