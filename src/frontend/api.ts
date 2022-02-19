import * as express from 'express';
import type { UserContext } from '@database/UserContext';
import type { IApiResponse } from '@frontend/typings/api';
import {
    addCategory,
    addDish,
    addRestaurant,
    addReview,
    deleteCategory,
    deleteReview,
    getCategories,
    reviews,
} from './endpoints';

export type Endpoint = (context: UserContext, req: express.Request) => Promise<any>;

const endpoints: Record<string, Endpoint> = {
    addRestaurant,
    getCategories,
    addCategory,
    deleteCategory,
    addDish,
    addReview,
    deleteReview,
    reviews,
};

export const handleApiRequest = async(req: express.Request, context: UserContext): Promise<IApiResponse<any>> => {
    const method = req.params.method;

    if (!(method in endpoints)) {
        return { error: 'no such method' };
    }

    try {
        const result = await endpoints[method](context, req);
        return { result };
    } catch (e) {
        let error: string;

        if (typeof e === 'string') {
            error = e;
        } else if (e instanceof Error) {
            error = e.message;

            if (process.env.DEV) {
                error += `\n\t${e.stack}\n\t${e.name}`;
            }
        } else {
            error = 'unknown error';
        }

        return { error };
    }
};
