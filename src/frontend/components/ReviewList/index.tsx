import * as React from 'react';
import type { IList } from '@typings';
import type { IReview } from '@typings/objects';
import pluralize from '@utils/pluralize';
import type { IPluralizeCases } from '@utils/pluralize';
import Review from '@components/Review';

import { reviewListCn } from './const';

import './ReviewList.scss';

type IReviewListProps = {
    reviews: IList<IReview>;
};

const reviewsPluralize: IPluralizeCases = {
    none: 'Нет отзывов',
    one: '{} отзыв',
    some: '{} отзыва',
    many: '{} отзывов',
};

const ReviewList: React.FC<IReviewListProps> = ({ reviews }) => {
    return (
        <div className={reviewListCn}>
            <h2>{pluralize(reviews.count, reviewsPluralize)}</h2>
            <div>
                {reviews.items.map(review => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
};

export default ReviewList;
