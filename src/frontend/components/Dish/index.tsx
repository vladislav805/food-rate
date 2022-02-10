import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IDish, IRestaurant } from '@typings/objects';
import StarRatingStatic from '@components/StarRatingStatic';

import { dishCategoryCn, dishCn, dishDescriptionCn, dishHeaderCn, dishTitleCn } from './const';

import './Dish.scss';

type IDishProps = {
    restaurant: IRestaurant;
    dish: IDish;
    showMineRating?: boolean;
};

const Dish: React.FC<IDishProps> = ({
    restaurant,
    dish,
    showMineRating = false,
}) => {
    return (
        <div className={dishCn} key={dish.id}>
            <div className={dishHeaderCn}>
                <h2 className={dishTitleCn}>
                    <Link to={`/restaurant/${restaurant.id}/dish/${dish.id}`}>{dish.title}</Link>
                </h2>
                <StarRatingStatic
                    value={showMineRating ? dish.rateMine! : dish.rateValue!}
                    count={showMineRating ? undefined : dish.rateCount!}
                />
            </div>
            <p className={dishCategoryCn}>{dish.category?.title}</p>
            <p className={dishDescriptionCn}>{dish.description}</p>
        </div>
    );
};

export default Dish;