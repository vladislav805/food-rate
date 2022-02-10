import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IList } from '@typings';
import type { IBranch, IDish, IRestaurant, IReview } from '@typings/objects';
import ReviewList from '@components/ReviewList';
import StarRatingStatic from '@components/StarRatingStatic';
import { useFetch } from '@utils/useFetch';
import { useParams } from 'react-router';
import { fetchers } from '../../pages@client';
import { withNumericParams } from '@utils/withNumericParams';

export type IDishPageData = {
    restaurant: IRestaurant;
    dish: IDish;
    reviews: IList<IReview>;
};

const DishPage: React.FC = () => {
    const { restaurantId, dishId } = useParams() as Record<string, string>;
    const { result, loading } = useFetch<IDishPageData>(`dish${dishId}`, fetchers.dish, { restaurantId, dishId });

    if (!result) return <>loading...</>;

    const { restaurant, dish, reviews } = result;

    return (
        <div>
            <h3><Link to={`/restaurant/${restaurant.id}`}>{restaurant.title}</Link></h3>
            <h1>{dish.title}</h1>
            {dish.rateValue && (
                <StarRatingStatic key="star" value={dish.rateValue} />
            )}
            {dish.category && (
                <h4 key="category">{dish.category.title}</h4>
            )}
            <ReviewList reviews={reviews} />
        </div>
    );
};


export default withNumericParams(DishPage, ['restaurantId', 'dishId']);
