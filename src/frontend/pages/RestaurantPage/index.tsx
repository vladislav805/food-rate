import * as React from 'react';
import { useParams } from 'react-router';
import type { IList } from '@typings';
import { fetchers } from '@frontend/pages@client';
import type { IBranch, ICategory, IDish, IRestaurant } from '@typings/objects';
import StarRatingStatic from '@components/StarRatingStatic';
import DishList from '@components/DishList';
import BranchList from '@components/BranchList';
import Tabs from '@components/Tabs';
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
    const { restaurantId } = useParams();
    const { result, loading } = useFetch<IRestaurantPageData>(`rest${restaurantId}`, fetchers.restaurant, { restaurantId: restaurantId! });

    const [selectedTab, setSelectedTab] = React.useState<number>(0);

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
                <DishList
                    restaurant={restaurant}
                    dishes={dishes}
                    categories={categories}
                />
                <BranchList branches={branches.items} />
            </Tabs>
        </div>
    );
};


export default withNumericParams(RestaurantPage, ['restaurantId']);
