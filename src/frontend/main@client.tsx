import './scss/reset.scss';
import './scss/themes/default.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Root from '@components/Root';
import { __context__ } from './window';

const root = document.getElementById('Root')!;

ReactDOM.hydrateRoot(
    root,
    (
        <BrowserRouter>
            <Root global={__context__} />
        </BrowserRouter>
    ),
);

