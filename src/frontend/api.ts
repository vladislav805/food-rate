import * as express from 'express';
import type { UserContext } from '@database/UserContext';
import { addCategory } from '@frontend/endpoints/addCategory';
import { addReview } from '@frontend/endpoints/addReview';

export type Endpoint = (context: UserContext, req: express.Request) => Promise<any>;

const endpoints: Record<string, Endpoint> = {
    addCategory,
    addReview,
};

export const handleApiRequest = async(req: express.Request, context: UserContext): Promise<any> => {
    const method = req.params.method;

    if (!(method in endpoints)) {
        return { error: 'no such method' };
    }

    try {
        return endpoints[method](context, req);
    } catch (e) {
        return { error: (e as Error).message };
    }
};
