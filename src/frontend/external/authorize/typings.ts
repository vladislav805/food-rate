import * as express from 'express';
import type AuthorizeService from './AuthorizeService';

export type AuthorizationServiceName = 'telegram' | 'vk' | 'google';

export interface IUserInfo {
    service: AuthorizationServiceName;
    id: string;
    name: string;
    photoSmall?: string;
    photoLarge?: string;
}

export interface IAuthorizeServiceCtr {
    new(request: express.Request): AuthorizeService;
}
