import 'dotenv/config';
import * as path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { matchRoutes } from 'react-router';
import { StaticRouter } from 'react-router-dom/server';

import { getUserContextByHash, UserContext } from '@database/UserContext';

import { handleApiRequest } from '@frontend/api';
import routes, { Route } from '@frontend/routes';
import { getDataByRoute } from '@frontend/pages@server';
import authorize from '@frontend/external/authorize';
import { renderFullPage } from '@utils/renderFullPage';

import Root from '@components/Root';
import type { IGlobalContext } from '@components/GlobalContext';
import { DataProviderContext } from '@components/DataProviderContext';
import { COOKIE_NAME_AUTH_HASH } from '@frontend/const';
import ServerDataProvider from '@frontend/provider/server';
import { getUserIpLocation } from '@frontend/external/geoip';

const getUserContext = (request: express.Request): UserContext => {
    return (request as unknown as { ctx: UserContext }).ctx;
};

const service = express();

service.use(cookieParser());
service.use(express.json());
service.use('/static', express.static(path.join(__dirname, 'static')));

/**
 * Добавление информации о пользователе перед использованием в роутере
 */
service.use(async(req, res, next) => {
    // @ts-ignore
    req.ctx = await getUserContextByHash(req.cookies[COOKIE_NAME_AUTH_HASH]);
    next();
});

service.all('/api/v1/:method', (req, res) => {
    res.setHeader('Content-type', 'application/json; charset=utf-8');
    const context = getUserContext(req);

    handleApiRequest(req, context).then(result => {
        res.send(result);
    });
});

service.get('/auth/:provider', authorize);

service.get('/*', async(req, res) => {
    const activeRoutes = matchRoutes(routes, req.url!);

    if (!activeRoutes) {
        res.send('unknown route');
        return;
    }

    const context = getUserContext(req);

    const ipAddress = req.headers['x-real-ip'] as string ?? req.socket.remoteAddress!;

    const globalContext: IGlobalContext = {
        user: null,
        title: 'Main',
        location: await getUserIpLocation(ipAddress, context),
    };

    const [activeRoute] = activeRoutes;

    const auth = context.getAuth();
    if (auth) {
        globalContext.user = auth.user;
    }

    const provider = new ServerDataProvider(context);

    let initialData;

    try {
        initialData = await getDataByRoute({ provider, route: activeRoute, context, globalContext });
    } catch (e) {
        res.send(`error occurred while handle your request ${e && (e as Error).message}`);
        return;
    }

    if (req.query.ajax) {
        res.send(initialData);
        return;
    }

    const key = (activeRoute.route as Route).getKey(activeRoute, req.query as Record<string, string>);

    const renderedHtml = ReactDOM.renderToString(
        <DataProviderContext.Provider value={provider}>
            <StaticRouter location={req.url!}>
                <Root global={globalContext} />
            </StaticRouter>
        </DataProviderContext.Provider>
    );

    res.setHeader('Content-type', 'text/html; charset=utf-8');
    res.write(renderFullPage(renderedHtml, {
        documentTitle: 'Main',
        key,
        initialData,
        globalContext,
    }));
    res.end();
});

    service.listen(1112, () => {
    console.log('Express started');
});
