import * as React from 'react';
import { useParams } from 'react-router';
import type { IList } from '@typings';
import { fetchers } from '@frontend/pages@client';
import type { IBranch, ICategory, IDish, IRestaurant } from '@typings/objects';
import StarRatingStatic from '@components/StarRatingStatic';
import CategoryList from '@components/CategoryList';
import DishList from '@components/DishList';
import { useFetch } from '@utils/useFetch';
import { withNumericParams } from '@utils/withNumericParams';
import BranchList from '@components/BranchList';

export type IRestaurantPageData = {
    restaurant: IRestaurant;
    dishes: IList<IDish>;
    categories: ICategory[];
    branches: IList<IBranch>;
    average: { count: number; value: number };
};

const RestaurantPage: React.FC = (props) => {
    const { restaurantId } = useParams();
    const { result, loading } = useFetch<IRestaurantPageData>(`rest${restaurantId}`, fetchers.restaurant, { restaurantId: restaurantId! });

    if (!result) return <>loading...</>;

    const { restaurant, dishes, categories, average, branches } = result;

    return (
        <div>
            <h1>{restaurant.title}</h1>
            <div>
                <StarRatingStatic
                    value={average.value}
                    count={average.count}
                />
            </div>
            <BranchList branches={branches.items} />
            <DishList
                restaurant={restaurant}
                dishes={dishes}
                categories={categories}
            />
        </div>
    );
};


export default withNumericParams(RestaurantPage, ['restaurantId']);
