import { __initial__ } from '../window';

export const getInitialData = <T>(key: string): T | undefined => {
    if (__initial__?.key === key) {
        __initial__.key = undefined;
        return __initial__.data;
    }
    return undefined;
};
