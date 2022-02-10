import * as express from 'express';

type ISetCookieOptions = Partial<{
    Expires: Date | string | number;
    MaxAge: number;
    Domain: string;
    Path: string;
    Secure: boolean;
    HttpOnly: boolean;
    SameSite: 'Strict' | 'Lax' | 'None';
}>;

export function setCookie(res: express.Response, name: string, value: string, options: ISetCookieOptions = {}): void {
    const headerValue: string[] = [`${name}=${decodeURIComponent(value)}`];

    if (options.Expires) {
        let date: string;
        if (typeof options.Expires === 'string') {
            date = options.Expires;
        } else if (typeof options.Expires === 'number') {
            date = new Date(options.Expires).toUTCString();
        } else {
            date = options.Expires.toUTCString();
        }

        headerValue.push(`Expires=${date}`);
    }

    if (options.MaxAge) {
        headerValue.push(`Max-Age=${options.MaxAge}`);
    }

    if (options.Domain) {
        headerValue.push(`Domain=${options.Domain}`);
    }

    if (options.Path) {
        headerValue.push(`Path=${decodeURIComponent(options.Path)}`);
    }

    if (options.Secure) headerValue.push('Secure');

    if (options.HttpOnly) headerValue.push('HttpOnly');

    if (options.SameSite) headerValue.push(`SameSite=${options.SameSite}`);

    res.setHeader('Set-Cookie', headerValue.join('; '));
}
