import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IReview } from '@typings/objects';
import DateFormat from '@components/DateFormat';
import StarRatingStatic from '@components/StarRatingStatic';

import { cnReview, reviewAuthorCn, reviewFooterCn, reviewHeaderCn, reviewTextCn } from './const';

import './Review.scss';

type IReviewProps = {
    review: IReview;
};

const Review: React.FC<IReviewProps> = ({ review }: IReviewProps) => {
    const { user } = review;

    return (
        <div className={cnReview()}>
            <div className={reviewHeaderCn}>
                <div className={reviewAuthorCn}>
                    <Link to={`/user/${user.id}`}>{user.name}</Link>
                </div>
                <StarRatingStatic value={review.rate} />
            </div>
            <div className={reviewTextCn}>{review.text}</div>
            <div className={reviewFooterCn}>
                <DateFormat date={review.createdAt} />
            </div>
        </div>
    );
};

export default Review;
