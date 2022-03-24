import * as React from 'react';
import { Link } from 'react-router-dom';

import type { IList } from '@typings';
import type { IRestaurant } from '@typings/objects';
import { useDataProvider } from '@frontend/provider';
import { useFetch } from '@utils/useFetch';

export type IHomePageData = {
    restaurants: IList<IRestaurant>;
};

const HomePage: React.FC = () => {
    const provider = useDataProvider();
    const { result, loading } = useFetch('home', provider.getHome);

    if (!result || loading) return <>loading...</>;

    return (
        <div>
            <p>Home page</p>
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
