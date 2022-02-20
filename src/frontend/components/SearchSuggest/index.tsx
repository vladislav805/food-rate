import * as React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import type { IDish, IRestaurant } from '@typings/objects';
import { SearchSuggestContext } from '@components/SearchSuggest/context';
import Input from '@components/Input';
import Button from '@components/Button';
import withAnimateVisibility from '@components/withAnimateVisibility';
import { fetchers } from '@frontend/pages@client';

import {
    searchSuggestCloseCn,
    searchSuggestCn,
    searchSuggestFormCn,
    searchSuggestItemCn,
    searchSuggestItemsCn,
    searchSuggestTextCn
} from './const';

import './SearchSuggest.scss';

const SearchSuggest: React.FC = () => {
    const suggestContext = React.useContext(SearchSuggestContext);
    const closeSuggest = React.useCallback(() => {
        suggestContext.setVisible(false);
    }, [suggestContext]);

    const [text, setText] = React.useState<string>('');
    const [restaurants, setRestaurants] = React.useState<IRestaurant[]>([]);
    const [dishes, setDishes] = React.useState<IDish[]>([]);

    const onInput = React.useCallback((event: React.FormEvent<HTMLInputElement>) => {
        const value = (event.target as HTMLInputElement).value;

        fetchers.suggest(value).then(result => {
            setRestaurants(result.restaurants);
            setDishes(result.dishes);
        });
    }, [text]);

    const hasResults = restaurants.length > 0 || dishes.length > 0;

    return (
        <div className={searchSuggestCn}>
            <form className={searchSuggestFormCn}>
                <Input
                    type="search"
                    className={searchSuggestTextCn}
                    name="text"
                    value={text}
                    setValue={setText}
                    onInput={onInput}
                />
                <Button
                    type="button"
                    className={searchSuggestCloseCn}
                    onClick={closeSuggest}
                >
                    <Icon path={mdiClose} color={null} />
                </Button>
            </form>
            {restaurants.length > 0 && (
                <ul className={searchSuggestItemsCn}>
                    {restaurants.map(restaurant => (
                        <Link
                            className={searchSuggestItemCn}
                            key={restaurant.id}
                            to={`/restaurant/${restaurant.id}`}
                        >
                            {restaurant.title}
                        </Link>
                    ))}
                </ul>
            )}

            {dishes.length > 0 && (
                <ul className={searchSuggestItemsCn}>
                    {dishes.map(dish => (
                        <Link
                            className={searchSuggestItemCn}
                            key={dish.id}
                            to={`/restaurant/${dish.restaurantId}/dish/${dish.id}`}
                        >
                            {dish.title}
                        </Link>
                    ))}
                </ul>
            )}

            {!hasResults && text && (
                <h3>Ничего не найдено</h3>
            )}
        </div>
    );
};

export default withAnimateVisibility(SearchSuggest, {
    hard: true,
    inName: 'fadeIn',
    outName: 'fadeOut',
    duration: 600,
});
