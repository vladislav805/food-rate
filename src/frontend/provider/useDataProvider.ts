import * as React from 'react';
import type { IDataProvider } from '@frontend/provider/typings';
import { DataProviderContext } from '@components/DataProviderContext';

export function useDataProvider(): IDataProvider {
    return React.useContext(DataProviderContext);
}
