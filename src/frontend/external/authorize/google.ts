import AuthorizeService from './AuthorizeService';
import type { IUserInfo, AuthorizationServiceName } from './typings';
import config from '%config';
import axios from 'axios';

interface IGoogleOAuth2Result {
    access_token: string;
    id_token: string;
    expires_in: number;
    token_type: 'Bearer';
    scope: string;
    refresh_token?: string;
}

interface IGoogleOAuth2UserInfoResult {
    id: string; // id
    name: string; // vlad veluga
    family_name: string; // veluga
    given_name: string; // vlad
    picture: string; // url
    locale: string; // locale
}

export default class AuthorizeServiceGoogle extends AuthorizeService {
    serviceName: AuthorizationServiceName = 'google';

    protected static readonly SCOPE = 'https://www.googleapis.com/auth/userinfo.profile openid';

    protected user?: IGoogleOAuth2UserInfoResult;

    public override getAuthorizeUrl(): string {
        const params = new URLSearchParams({
            client_id: config.GOOGLE_CLIENT_ID,
            redirect_uri: config.GOOGLE_REDIRECT_URI,
            response_type: 'code',
            scope: AuthorizeServiceGoogle.SCOPE,
            access_type: 'online',
        });

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    }

    public override isEmptyRequest(): boolean {
        return !this.request.query.code;
    }

    public override async getServiceUserId(): Promise<string> {
        const authorization = await this.getToken(this.request.query.code as string);

        const user = await this.getUser(authorization.access_token);

        this.user = user;

        return user.id;
    }

    protected async getToken(code: string): Promise<IGoogleOAuth2Result> {
        const { status, data } = await axios.post<IGoogleOAuth2Result>(`https://oauth2.googleapis.com/token`, {
            client_id: config.GOOGLE_CLIENT_ID,
            client_secret: config.GOOGLE_CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: config.GOOGLE_REDIRECT_URI,
        }, {
            responseType: 'json',
        });

        if (status !== 200 || !data) throw new Error('Google get token error');

        return data;
    }

    protected async getUser(token: string): Promise<IGoogleOAuth2UserInfoResult> {
        const { status, data } = await axios.get<IGoogleOAuth2UserInfoResult>(`https://www.googleapis.com/userinfo/v2/me`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            responseType: 'json',
        });

        if (status !== 200 || !data) throw new Error('Google get userinfo error');

        return data;
    }

    public override async getUserInfo(): Promise<IUserInfo> {
        const user = this.user;
        if (!user) {
            throw new Error('wtf');
        }

        return {
            service: 'google',
            id: user.id,
            name: user.name,
            photoSmall: this.getPhotoBySize(user.picture, 100),
            photoLarge: this.getPhotoBySize(user.picture, 200),
        };
    }

    protected getPhotoBySize(url: string, size: number): string {
        return url.replace(/=s(\d+)-c/, `=s${size}-c`);
    }
}
