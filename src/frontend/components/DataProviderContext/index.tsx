import * as React from 'react';
import type { IDataProvider } from '@frontend/provider';

export const DataProviderContext = React.createContext<IDataProvider>({} as IDataProvider);
