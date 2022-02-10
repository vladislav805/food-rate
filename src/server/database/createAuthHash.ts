import * as crypto from 'crypto';

export const createAuthHash = (userId: number): string => {
    return crypto.createHash('md5').update(`${userId}_${Date.now()}_${Math.random()}`).digest().toString('hex');
};
