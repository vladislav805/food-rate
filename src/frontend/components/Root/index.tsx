import * as React from 'react';
import { Route, Routes } from 'react-router';
import GlobalContext from '@components/GlobalContext';
import type { IGlobalContext } from '@components/GlobalContext';
import Header from '@components/Header';

import routes from '../../routes';

import './Root.scss';

type IRootProps = {
    global: IGlobalContext;
};

const Root: React.FC<IRootProps> = ({ global }) => {
    return (
        <GlobalContext.Provider value={global}>
            <Header title={global.title} />
            <Routes>
                {routes.map(({ path, component: C }) => (
                    <Route key={path} path={path} element={<C />} />
                ))}
            </Routes>
        </GlobalContext.Provider>
    );
};

export default Root;
