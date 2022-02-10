import * as React from 'react';
import { getInitialData } from '@utils/initialData';
import { ServerInitialDataContext } from '@components/ServerInitialDataContext';

type FetchFunction<T> = (args: Record<string, string>) => Promise<T>;

type FetchHookResult<T, L extends boolean = boolean> =
    | { loading: L; result: L extends true ? undefined : T };

export const useFetch = <T>(key: string, fetch: FetchFunction<T>, args: Record<string, string> = {}): FetchHookResult<T> => {
    const result = React.useContext(ServerInitialDataContext);
    const [state, setState] = React.useState<FetchHookResult<T>>({ result: result ?? getInitialData(key), loading: false });

    React.useEffect(() => {
        if (state.result !== undefined) return;
        console.log('loading hook', key, args);

        setState({ result: undefined, loading: true })

        fetch(args).then(result => {
            setState({ result, loading: false });
        });
    }, [key]);

    return state;
};
