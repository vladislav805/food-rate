import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchSuggest from '@components/SearchSuggest';

const SearchPage: React.FC = () => {
    const params = useSearchParams();

    React.useEffect(() => {

    }, []);

    return (
        <div>
            {/*<SearchSuggest />*/}
        </div>
    );
};

export default SearchPage;
