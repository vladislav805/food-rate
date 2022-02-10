import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IList } from '@typings';
import type { IRestaurant } from '@typings/objects';
import AuthButton from '@components/AuthButton';
import GlobalContext from '@components/GlobalContext';
import { useFetch } from '@utils/useFetch';
import { fetchers } from '../../pages@client';
import StarRating from '@components/StarRating';

export type IHomePageData = {
    restaurants: IList<IRestaurant>;
};

const HomePage: React.FC = () => {
    const { result, loading } = useFetch<IHomePageData>('home', fetchers.home);

    const globalContext = React.useContext(GlobalContext);

    if (!result) return <>loading...</>;

    return (
        <div>
            <p>Home page</p>
            <StarRating name={"test"} />
            {!globalContext.user ? <AuthButton bot="FoodRateBot" /> : null}
            {result?.restaurants?.items.map(restaurant => (
                <div key={restaurant.id}>
                    <Link to={`/restaurant/${restaurant.id}`}>{restaurant.title}</Link>
                    <p>{restaurant.description}</p>
                </div>
            ))}
        </div>
    );
};

export default HomePage;
