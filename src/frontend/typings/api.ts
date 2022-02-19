export interface IApiResult<T> {
    result: T;
}

export interface IApiError {
    error: string;
}

export type IApiResponse<T> = IApiResult<T> | IApiError;
