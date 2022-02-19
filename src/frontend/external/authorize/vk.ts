import axios from 'axios';
import config from '%config';

import AuthorizeService from './AuthorizeService';
import type { IUserInfo, AuthorizationServiceName } from './typings';

export interface IVkAuthorizationResult {
    access_token: string;
    expires_in: number;
    user_id: number;
}

export interface IVkResponse<T> {
    response: T;
}

export interface IVkError {
    error: {
        error_code: number;
        error_msg: string;
    };
}

export type IVkApiResult<T> = IVkResponse<T> | IVkError;

export interface IVkUser {
    id: number;
    first_name: string;
    last_name: string;
    photo_100: string;
    photo_200: string;
}

export default class AuthorizeServiceVK extends AuthorizeService {
    serviceName: AuthorizationServiceName = 'vk';

    protected auth?: IVkAuthorizationResult;

    public override getAuthorizeUrl(): string {
        const params = new URLSearchParams({
            display: 'page',
            client_id: config.VK_APP_ID,
            redirect_uri: config.AUTH_URL_VK_REDIRECT,
            scope: 'offline',
            response_type: 'code',
            v: config.VK_API_VERSION,
        });

        return `https://oauth.vk.com/authorize?${params.toString()}`;
    }

    public override isEmptyRequest(): boolean {
        return !this.request.query.code;
    }

    public override async getServiceUserId(): Promise<string> {
        const code = this.request.query.code as string;

        const params = new URLSearchParams({
            client_id: config.VK_APP_ID,
            client_secret: config.VK_APP_SECRET,
            redirect_uri: config.AUTH_URL_VK_REDIRECT,
            code,
        });

        const url = `https://oauth.vk.com/access_token?${params.toString()}`;

        const { status, data } = await axios.get<IVkAuthorizationResult>(url, {
            responseType: 'json',
            validateStatus: () => true,
        });

        if (status !== 200 || !('access_token' in data)) {
            throw new Error(`Unknown error: ${status}`);
        }

        this.auth = data;

        return String(data.user_id);
    }

    public override async getUserInfo(): Promise<IUserInfo> {
        if (!this.auth) throw new Error('No auth');

        const params = new URLSearchParams({
            access_token: this.auth.access_token,
            v: config.VK_API_VERSION,
            fields: 'photo_100,photo_200'
        });

        const url = `https://api.vk.com/method/users.get?${params.toString()}`;

        const { status, data } = await axios.get<IVkApiResult<IVkUser[]>>(url, {
            responseType: 'json',
            validateStatus: () => true,
        });

        if (status !== 200 || 'error' in data) {
            throw new Error((data as IVkError).error.error_msg);
        }

        const { response } = data;

        if (!Array.isArray(response) || !response.length) {
            throw new Error('Unknown error (no user)');
        }

        const [user] = response;

        return {
            service: 'vk',
            id: String(user.id),
            name: `${user.first_name} ${user.last_name}`,
            photoSmall: user.photo_100,
            photoLarge: user.photo_200,
        };
    }
}
