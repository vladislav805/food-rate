import type { IOffsetObject } from '@typings';

export default function createOffsetObject(current: number, count: number, limit: number): IOffsetObject {
    const next = current + limit < count ? current + limit : undefined;
    return { current, next };
}