import * as React from 'react';
import type { IUser } from '@typings/objects';

export type IGlobalContext = {
    user: IUser | null;
};

export const GlobalContext = React.createContext<IGlobalContext>({} as IGlobalContext);

export default GlobalContext;
