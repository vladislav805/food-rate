import * as React from 'react';
import { Route, Routes } from 'react-router';
import GlobalContext from '@components/GlobalContext';
import type { IGlobalContext } from '@components/GlobalContext';
import Header from '@components/Header';
import SiteMenu from '@components/SiteMenu';
import routes from '@frontend/routes';

import './Root.scss';

type IRootProps = {
    global: IGlobalContext;
};

const Root: React.FC<IRootProps> = ({ global }) => {
    const [menuVisible, setMenuVisible] = React.useState<boolean>(false);

    const toggleMenu = React.useCallback(
        () => setMenuVisible(!menuVisible),
        [menuVisible],
    );

    return (
        <GlobalContext.Provider value={global}>
            <SiteMenu
                visible={menuVisible}
                setVisible={setMenuVisible}
            />
            <Header
                title={global.title}
                toggleMenu={toggleMenu}
            />
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
