import * as React from 'react';
import type { IList } from '@typings';
import type { IReview } from '@typings/objects';
import pluralize from '@utils/pluralize';
import type { IPluralizeCases } from '@utils/pluralize';
import Review from '@components/Review';
import Paginator from '@components/Paginator';
import { fetchers } from '@frontend/pages@client';

import { reviewListCn, reviewListItemsCn, reviewListTitleCn } from './const';

import './ReviewList.scss';

type IReviewListProps = {
    dishId: number;
    reviews?: IList<IReview>;
};

const reviewsPluralize: IPluralizeCases = {
    none: 'Нет отзывов',
    one: '{} отзыв',
    some: '{} отзыва',
    many: '{} отзывов',
};

const REVIEWS_PER_PAGE = 20;

const ReviewList: React.FC<IReviewListProps> = props => {
    const { dishId } = props;
    const [reviews, setReviews] = React.useState<IList<IReview> | undefined>(props.reviews);
    const [offset, setOffset] = React.useState<number>(0);

    React.useEffect(() => {
        if (reviews?.offset?.current === offset) return;

        setReviews(undefined);

        fetchers.getReviews({
            dishId,
            offset,
            limit: REVIEWS_PER_PAGE,
        }).then(result => {
            setReviews(result);
        });
    }, [reviews, offset, dishId]);

    return (
        <div className={reviewListCn}>
            <h2 className={reviewListTitleCn}>
                {reviews ? pluralize(reviews.count, reviewsPluralize) : 'Отзывы'}
            </h2>
            {reviews ? (
                <>
                    <div className={reviewListItemsCn}>
                    {reviews.items.map(review => (
                        <Review key={review.id} review={review} />
                    ))}
                    </div>
                    <Paginator
                        count={reviews.count}
                        limit={REVIEWS_PER_PAGE}
                        offset={offset}
                        setOffset={setOffset}
                        range={2}
                    />
                </>
            ) : (
                <p>loading...</p>
            )}
        </div>
    );
};

export default ReviewList;
