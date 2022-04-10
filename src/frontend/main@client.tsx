import './scss/reset.scss';
import './scss/themes/default.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Root from '@components/Root';
import { DataProviderContext } from '@components/DataProviderContext';
import ClientDataProvider from '@frontend/provider/client';
import { __context__ } from './window';

import 'animate.css';

const root = document.getElementById('Root')!;

const provider = new ClientDataProvider();

ReactDOM.hydrateRoot(
    root,
    (
        <DataProviderContext.Provider value={provider}>
            <BrowserRouter>
                <Root global={__context__} />
            </BrowserRouter>
        </DataProviderContext.Provider>
    ),
);

