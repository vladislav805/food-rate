import * as React from 'react';
import { useParams } from 'react-router';
import type { IList } from '@typings';
import type { IReview, IUser } from '@typings/objects';
import type { IUserStatistics } from '@typings/synthetic';
import Spinner from '@components/Spinner';
import Image from '@components/Image';
import withIntersection from '@components/Image/_withIntersection';
import Review from '@components/Review';
import { useFetch } from '@utils/useFetch';
import { withNumericParams } from '@utils/withNumericParams';
import { useDataProvider } from '@frontend/provider';

import Statistics from './UserPage.components/Statistics';
import { userPageCn, userPageHeaderCn, userPageHeaderContentCn, userPageNameCn, userPagePhotoCn } from './const';

import './UserPage.scss';

const Avatar = withIntersection(Image);

export type IUserPageData = {
    user: IUser;
    statistics: IUserStatistics | null;
    reviews: IList<IReview>;
};

const UserPage: React.FC = () => {
    const provider = useDataProvider();
    const { userId } = useParams();

    const { result, loading } = useFetch(`user${userId}`, provider.getUserById, +userId!);

    if (!result || loading) return <Spinner />;

    const { user, statistics, reviews } = result;

    return (
        <div className={userPageCn}>
            <div className={userPageHeaderCn}>
                <div className={userPageHeaderContentCn}>
                    <h2 className={userPageNameCn}>{user.name}</h2>
                    <Statistics statistics={statistics} />
                </div>
                {user.photoSmall && (
                    <Avatar
                        className={userPagePhotoCn}
                        url={user.photoSmall}
                        alt="user photo"
                        circle
                        cover
                        imageWidth={100}
                        imageHeight={100}
                    />
                )}
            </div>
            <div>
                {reviews.items.map(review => (
                    <Review key={review.id} review={review} />
                ))}
            </div>
        </div>
    );
};

export default withNumericParams(UserPage, ['userId']);
