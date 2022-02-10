import 'dotenv/config';
import * as restana from 'restana';
import * as cookieParser from 'cookie-parser';
import * as React from 'react';
import * as ReactDOM from 'react-dom/server';
import { matchRoutes } from 'react-router';
import { StaticRouter } from 'react-router-dom/server';

import { getUserContextByHash, UserContext } from '@database/UserContext';
import { ITelegramAuthResult } from '@utils/telegram.typings';
import isValidTelegramHash from '@utils/isValidTelegramHash';
import { setCookie } from '@utils/setCookie';
import { MONTH } from '@utils/date';

import { handleApiRequest } from '@frontend/api';
import routes, { Route } from '@frontend/routes';
import { getDataByRoute } from '@frontend/pages@server';
import { baseTemplate } from '@frontend/base-template';

import Root from '@components/Root';
import type { IGlobalContext } from '@components/GlobalContext';
import { ServerInitialDataContext } from '@components/ServerInitialDataContext';

const getUserContext = (request: restana.Request<restana.Protocol.HTTP>): UserContext => {
    return (request as unknown as { ctx: UserContext }).ctx;
};

const COOKIE_NAME_AUTH_HASH = 'auth_hash';

const service = restana();

// @ts-ignore Несовпадение типов между express и restana
service.use(cookieParser());

/**
 * Добавление информации о пользователе перед использованием в роутере
 */
service.use(async(req, res, next) => {
    // @ts-ignore
    req.ctx = await getUserContextByHash(req.cookies[COOKIE_NAME_AUTH_HASH]);
    next();
});

service.get('/api/v1/:method', (req, res) => {
    res.setHeader('Content-type', 'application/json; charset=utf-8');
    res.send(handleApiRequest(req, getUserContext(req)));
});

const supportedProviders: string[] = ['telegram'];

service.get('/auth/:provider', async(req, res) => {
    const provider = req.params.provider;

    if (!supportedProviders.includes(provider)) {
        res.send('not supported provider');
        return;
    }

    const query = req.query as unknown as ITelegramAuthResult;

    if (!isValidTelegramHash(query, process.env.BOT_SECRET as string)) {
        res.send('invalid hash');
        return;
    }

    const context = getUserContext(req);

    const auth = await context.createAuth({ telegramId: Number(query.id), name: `${query.first_name} ${query.last_name ?? ''}`.trim() });

    res.statusCode = 302;
    setCookie(res, COOKIE_NAME_AUTH_HASH, auth.hash, {
        HttpOnly: true,
        Path: '/',
        Expires: Date.now() + 4 * MONTH,
    });
    res.setHeader('Location', '/');
    res.end();
});

service.get('/*', async(req, res) => {
    const activeRoutes = matchRoutes(routes, req.url!);

    if (!activeRoutes) {
        res.send('unknown route');
        return;
    }

    const [activeRoute] = activeRoutes;
    const context = getUserContext(req);
    const initialData = getDataByRoute(context, activeRoute);

    if (req.query.ajax) {
        res.send(initialData);
        return;
    }

    const key = (activeRoute.route as Route).getKey(activeRoute);

    const globalContext: IGlobalContext = {
        user: context.getAuth()?.user ?? null,
    };

    const renderedHtml = ReactDOM.renderToString(
        <ServerInitialDataContext.Provider value={initialData}>
            <StaticRouter location={req.url!}>
                <Root global={globalContext} />
            </StaticRouter>
        </ServerInitialDataContext.Provider>
    );

    res.write(baseTemplate(renderedHtml, {
        documentTitle: 'Main',
        key,
        initialData,
        globalContext,
    }));
    res.end();
});


service.start(1112);