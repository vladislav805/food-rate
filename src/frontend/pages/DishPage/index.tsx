import * as React from 'react';
import { useParams } from 'react-router';
import { Link } from 'react-router-dom';

import type { IList } from '@typings';
import type { IDish, IRestaurant, IReview } from '@typings/objects';
import ReviewList from '@components/ReviewList';
import StarRatingStatic from '@components/StarRatingStatic';
import GlobalContext from '@components/GlobalContext';
import ReviewForm from '@components/ReviewForm';
import Modal from '@components/Modal';
import Button from '@components/Button';
import { fetchers } from '@frontend/pages@client';
import { useFetch } from '@utils/useFetch';
import { withNumericParams } from '@utils/withNumericParams';

import {
    dishPageCn,
    dishPageDescriptionCn,
    dishPageHeaderCn,
    dishPageMetaCn, dishPageRatingCn,
    dishPageTitleCn
} from './const';

import './DishPage.scss';

export type IDishPageData = {
    restaurant: IRestaurant;
    dish: IDish;
    reviews: IList<IReview>;
    myReview: IReview | null;
};

const DishPage: React.FC = () => {
    const globalContext = React.useContext(GlobalContext);
    const { restaurantId, dishId } = useParams() as Record<string, string>;
    const { result, loading, reload } = useFetch<IDishPageData>(`dish${dishId}`, fetchers.dish, { restaurantId, dishId });

    const [visibleReviewForm, setVisibleReviewForm] = React.useState<boolean>(false);

    const onReviewPublished = React.useCallback((_review: IReview) => {
        reload();
    }, [result]);

    if (!result || loading) return <>loading...</>;

    const { restaurant, dish, reviews, myReview } = result;

    return (
        <div className={dishPageCn}>
            <div className={dishPageHeaderCn}>
                <h1 className={dishPageTitleCn}>{dish.title}</h1>
                <p className={dishPageDescriptionCn}>{dish.description}</p>
                <p className={dishPageMetaCn}>
                    {dish.category?.title}
                    {dish.category ? ', ' : ''}
                    <Link to={`/restaurant/${restaurant.id}`}>{restaurant.title}</Link>
                </p>
                <div className={dishPageRatingCn}>
                    <StarRatingStatic
                        value={dish.rateValue!}
                        count={dish.rateCount}
                        large
                        centered
                        showValue
                    />
                    {globalContext.user && (
                        myReview ? (
                            <p>Вы оценили на {myReview.rate}</p>
                        ) : (
                            <Button
                                type="button"
                                onClick={() => setVisibleReviewForm(true)}
                                text="Оценить"
                            />
                        )
                    )}
                </div>
            </div>
            <ReviewList
                dishId={dish.id}
                reviews={reviews}
            />
            <Modal
                visible={visibleReviewForm}
                setVisible={setVisibleReviewForm}
            >
                <ReviewForm
                    dishId={dish.id}
                    onReviewPublished={onReviewPublished}
                />
            </Modal>
        </div>
    );
};


export default withNumericParams(DishPage, ['restaurantId', 'dishId']);
