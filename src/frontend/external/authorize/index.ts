import type * as express from 'express';
import { setCookie } from '@utils/setCookie';
import { MONTH } from '@utils/date';
import AuthorizeServiceVK from '@frontend/external/authorize/vk';
import AuthorizeServiceTelegram from '@frontend/external/authorize/telegram';
import { UserContext } from '@database/UserContext';

import { AuthorizationServiceName, IAuthorizeServiceCtr } from './typings';
import AuthorizeService from '@frontend/external/authorize/AuthorizeService';
import Auth from '@database/models/auth';
import { COOKIE_NAME_AUTH_HASH } from '@frontend/const';
import redirect from '@utils/redirect';

const supportedProviders = new Set<AuthorizationServiceName>(['telegram', 'vk']);

const services: Record<AuthorizationServiceName, IAuthorizeServiceCtr> = {
    vk: AuthorizeServiceVK,
    telegram: AuthorizeServiceTelegram,
};

/**
 * Получение созданного контекста для запроса
 */
const getUserContext = (request: express.Request): UserContext => (request as unknown as { ctx: UserContext }).ctx;

/**
 * Проверка на поддержанность сервиса
 */
const isSupportedService = (name: string): name is AuthorizationServiceName => supportedProviders.has(name as AuthorizationServiceName);

async function createSession(authService: AuthorizeService, context: UserContext): Promise<Auth> {
    // Получаем идентификатор пользователя в сервисе
    const serviceUserId = await authService.getServiceUserId();

    // Пытаемся такого найти
    let user = await context.findUserByService(authService.serviceName, serviceUserId);

    // Если не находим - создаём
    if (!user) {
        // Получаем подробную информацию о пользователе
        const info = await authService.getUserInfo();
        // Создаём в БД
        user = await context.createUser(info);
    }

    // Создаём сессию/авторизацию
    return context.createAuth(user);
}

export default function(request: express.Request, response: express.Response) {
    const provider = request.params.provider;

    if (!isSupportedService(provider)) {
        response.send('not supported provider');
        return;
    }

    const authService = new services[provider](request);
    const context = getUserContext(request);

    if (authService.isEmptyRequest()) {
        redirect(response, authService.getAuthorizeUrl());
        return;
    }

    createSession(authService, context).then(auth => {
        setCookie(response, COOKIE_NAME_AUTH_HASH, auth.hash, {
            HttpOnly: true,
            Path: '/',
            Expires: Date.now() + (4 * MONTH * 1000),
        });
        redirect(response, '/');
    }).catch((error: Error) => {
        response.write(`error occurred ${error?.message}`);
        response.end();
    });
};
