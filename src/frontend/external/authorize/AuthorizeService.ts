import type * as express from 'express';
import type { AuthorizationServiceName, IUserInfo } from './typings';

export default abstract class AuthorizeService {
    public readonly abstract serviceName: AuthorizationServiceName;

    public constructor(
        protected readonly request: express.Request,
    ) {

    }

    /**
     * Проверка на то, что пользователь только перешёл по пустому адресу, чтобы его редиректнули на страницу авторизации
     */
    public abstract isEmptyRequest(): boolean;

    /**
     * Возвращает адрес, на который нужно отправить пользователя для авторизации
     */
    public abstract getAuthorizeUrl(): string;

    public abstract getServiceUserId(): Promise<number>;

    public abstract getUserInfo(): Promise<IUserInfo>;
}
