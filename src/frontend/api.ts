import * as express from 'express';
import type { UserContext } from '@database/UserContext';
import { addCategory, addReview, deleteReview, reviews } from '@frontend/endpoints';

export type Endpoint = (context: UserContext, req: express.Request) => Promise<any>;

const endpoints: Record<string, Endpoint> = {
    addCategory,
    addReview,
    deleteReview,
    reviews,
};

type IApiResponse =
    | { result: any }
    | { error: string };

export const handleApiRequest = async(req: express.Request, context: UserContext): Promise<IApiResponse> => {
    const method = req.params.method;

    if (!(method in endpoints)) {
        return { error: 'no such method' };
    }

    try {
        const result = await endpoints[method](context, req);
        return { result };
    } catch (e) {
        return { error: (e as Error).message };
    }
};
