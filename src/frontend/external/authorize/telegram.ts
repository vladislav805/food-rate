import AuthorizeService from './AuthorizeService';
import type { IUserInfo, AuthorizationServiceName } from './typings';

export default class AuthorizeServiceTelegram extends AuthorizeService {
    serviceName: AuthorizationServiceName = 'telegram';

    public override getAuthorizeUrl(): string {
        return '/static/telegram';
    }

    public override isEmptyRequest(): boolean {
        return !this.request.query.hash;
    }

    public override async getServiceUserId(): Promise<number> {
        return Promise.reject();
    }

    public override async getUserInfo(): Promise<IUserInfo> {
        return Promise.reject();
    }
}
