import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IReview } from '@typings/objects';
import DateFormat from '@components/DateFormat';
import StarRatingStatic from '@components/StarRatingStatic';

import { cnReview, reviewAuthorCn, reviewFooterCn, reviewHeaderCn, reviewTextCn } from './const';

import './Review.scss';

type IReviewProps = {
    review: IReview;
    isMine?: boolean;
    onDeleteReview?: (review: IReview) => void;
};

const Review: React.FC<IReviewProps> = (props) => {
    const { review, isMine, onDeleteReview } = props;
    const { user } = review;

    const onClickDelete = React.useMemo(() => !onDeleteReview
        ? undefined
        : (event: React.MouseEvent) => {
            event.preventDefault();

            onDeleteReview(review);
        },
        [review, onDeleteReview],
    );

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
                {isMine && ' | '}
                {isMine && (
                    <a
                        href="#"
                        onClick={onClickDelete}
                    >Удалить</a>
                )}
            </div>
        </div>
    );
};

export default Review;
