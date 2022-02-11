import * as React from 'react';
import type { IUser } from '@typings/objects';

export type IGlobalContext = {
    user: IUser | null;
    title: string;
};

export const GlobalContext = React.createContext<IGlobalContext>({} as IGlobalContext);

export default GlobalContext;
