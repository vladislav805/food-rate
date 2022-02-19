import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IReview } from '@typings/objects';
import DateFormat from '@components/DateFormat';
import StarRatingStatic from '@components/StarRatingStatic';
import withIntersection from '@components/Image/_withIntersection';
import Image from '@components/Image';

import { cnReview, reviewAuthorCn, reviewAvatarCn, reviewFooterCn, reviewTextCn } from './const';

import './Review.scss';

const Avatar = withIntersection(Image);

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
            <Avatar
                className={reviewAvatarCn}
                url={user.photoSmall as string}
                alt={`Photo of ${user.name}`}
                cover
                circle
            />
            <div className={reviewAuthorCn}>
                <Link to={`/user/${user.id}`}>{user.name}</Link>
            </div>
            <StarRatingStatic value={review.rate} />
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
