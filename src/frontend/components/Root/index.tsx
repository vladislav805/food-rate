import * as React from 'react';
import { Route, Routes } from 'react-router';
import GlobalContext from '@components/GlobalContext';
import type { IGlobalContext } from '@components/GlobalContext';
import Header from '@components/Header';
import SiteMenu from '@components/SiteMenu';
import { ISearchSuggestContext, SearchSuggestContext } from '@components/SearchSuggest/context';
import SearchSuggest from '@components/SearchSuggest';
import routes from '@frontend/routes';

import './Root.scss';

type IRootProps = {
    global: IGlobalContext;
};

const Root: React.FC<IRootProps> = ({ global }) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);
    const [searchVisible, setSearchVisible] = React.useState<boolean>(false);

    const toggleMenu = React.useCallback(
        () => setMenuVisible(!menuVisible),
        [menuVisible],
    );

    const openSuggest = React.useCallback(() => setSearchVisible(true), []);

    const suggestContextValue = React.useMemo<ISearchSuggestContext>(() => ({
        visible: searchVisible,
        setVisible: setSearchVisible,
    }), [searchVisible, setSearchVisible]);

    return (
        <GlobalContext.Provider value={global}>
            <SiteMenu
                visible={menuVisible}
                setVisible={setMenuVisible}
            />
            <SearchSuggestContext.Provider value={suggestContextValue}>
                <Header
                    title={global.title}
                    toggleMenu={toggleMenu}
                    openSearch={openSuggest}
                />
                <SearchSuggest
                    visible={searchVisible}
                    setVisible={setSearchVisible}
                />
            </SearchSuggestContext.Provider>
            <Routes>
                {routes.map(({ path, component: C }) => (
                    <Route
                        key={path}
                        path={path}
                        element={<C />}
                    />
                ))}
            </Routes>

        </GlobalContext.Provider>
    );
};

export default Root;
