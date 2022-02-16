import AuthorizeService from './AuthorizeService';
import type { IUserInfo, AuthorizationServiceName } from './typings';
import VkClient from '@external/vk/client';
import VkServer from '@external/vk/server';
import type { IVkAuthorizationResult } from '@external/vk/typings';

export default class AuthorizeServiceVK extends AuthorizeService {
    serviceName: AuthorizationServiceName = 'vk';

    protected auth?: IVkAuthorizationResult;

    public override getAuthorizeUrl(): string {
        return VkClient.getAuthorizationUrl();
    }

    public override isEmptyRequest(): boolean {
        return !this.request.query.code;
    }

    public override async getServiceUserId(): Promise<string> {
        this.auth = await VkServer.getAuthorizationInfoByCode(this.request.query.code as string);
        return String(this.auth.user_id);
    }

    public override async getUserInfo(): Promise<IUserInfo> {
        if (!this.auth) throw new Error('No auth');

        const user = await VkServer.getUserInfo(this.auth.access_token);

        return {
            service: 'vk',
            id: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            photoSmall: user.photo_100,
            photoLarge: user.photo_200,
        };
    }
}
