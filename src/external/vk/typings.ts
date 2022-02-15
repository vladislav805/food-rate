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
