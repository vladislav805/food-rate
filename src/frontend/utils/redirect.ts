import type * as express from 'express';

export default function redirect(response: express.Response, location: string): void {
    response.statusCode = 302;
    response.setHeader('Location', location);
    response.end();
}
