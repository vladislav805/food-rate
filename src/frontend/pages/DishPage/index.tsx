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
import ImageBase from '@components/Image';
import withIntersection from '@components/Image/_withIntersection';
import { useFetch } from '@utils/useFetch';
import { withNumericParams } from '@utils/withNumericParams';
import { useDataProvider } from '@frontend/provider';

import {
    dishPageCn,
    dishPageDescriptionCn,
    dishPageHeaderCn,
    dishPageImageCn,
    dishPageMetaCn,
    dishPageRateButtonCn,
    dishPageRatingCn,
    dishPageTitleCn
} from './const';

import './DishPage.scss';

const Image = withIntersection(ImageBase);

export type IDishPageData = {
    restaurant: IRestaurant;
    dish: IDish;
    reviews: IList<IReview>;
    myReview: IReview | null;
};

const DishPage: React.FC = () => {
    const provider = useDataProvider();
    const globalContext = React.useContext(GlobalContext);
    const { restaurantId, dishId } = useParams() as Record<string, string>;
    const { result, loading, reload } = useFetch(`dish${dishId}`, provider.getDishById, +restaurantId, +dishId);

    const [visibleReviewForm, setVisibleReviewForm] = React.useState<boolean>(false);

    const onReviewListUpdated = React.useCallback(() => {
        setVisibleReviewForm(false);
        reload();
    }, [result]);

    if (!result || loading) return <>loading...</>;

    const { restaurant, dish, reviews, myReview } = result;

    return (
        <div className={dishPageCn}>
            <div className={dishPageHeaderCn}>
                <Image
                    className={dishPageImageCn}
                    url="https://placeimg.com/640/480/nature"
                    alt="Picture"
                    imageWidth={64}
                    imageHeight={64}
                    cover
                    circle
                />
                <h1 className={dishPageTitleCn}>{dish.title}</h1>
                <p className={dishPageDescriptionCn}>{dish.description}</p>
                <p className={dishPageMetaCn}>
                    <Link to={`/restaurant/${restaurant.id}`}>{restaurant.title}</Link>
                    {dish.category && ', '}
                    {dish.category?.title}
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
                            <p>???? ?????????????? ???? {myReview.rate}</p>
                        ) : (
                            <Button
                                className={dishPageRateButtonCn}
                                type="button"
                                onClick={() => setVisibleReviewForm(true)}
                                text="??????????????"
                            />
                        )
                    )}
                </div>
            </div>
            <ReviewList
                dishId={dish.id}
                reviews={reviews}
                onReviewListUpdated={onReviewListUpdated}
            />
            <Modal
                visible={visibleReviewForm}
                setVisible={setVisibleReviewForm}
            >
                <ReviewForm
                    dishId={dish.id}
                    onReviewPublished={onReviewListUpdated}
                />
            </Modal>
        </div>
    );
};


export default withNumericParams(DishPage, ['restaurantId', 'dishId']);
