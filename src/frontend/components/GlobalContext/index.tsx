import * as React from 'react';
import type { IUser } from '@typings/objects';
import type { IUserIpLocation } from '@frontend/external/geoip';

export type IGlobalContext = {
    user: IUser | null;
    title: string;
    location: IUserIpLocation | null;
};

export const GlobalContext = React.createContext<IGlobalContext>({} as IGlobalContext);

export default GlobalContext;
