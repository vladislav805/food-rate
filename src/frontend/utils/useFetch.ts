import * as React from 'react';
import { getInitialData } from '@utils/initialData';
import { ServerInitialDataContext } from '@components/ServerInitialDataContext';

type FetchFunction<T> = (args: Record<string, string>) => Promise<T>;

type FetchHookState<T> =
    | { loading: false; result: T }
    | { loading: true; result: undefined };

type FetchHookResult<T> = FetchHookState<T> & {
    reload: () => void;
    setResult: (result: T) => void;
};

export const useFetch = <T>(key: string, fetch: FetchFunction<T>, args: Record<string, string> = {}): FetchHookResult<T> => {
    const result = React.useContext(ServerInitialDataContext);

    const makeRequest = React.useMemo(() => () => {
        setState({ result: undefined, loading: true })

        fetch(args).then(result => {
            setState({ result, loading: false });
        });
    }, [fetch, key]);

    const [state, setState] = React.useState<FetchHookState<T>>({
        result: result ?? getInitialData(key),
        loading: false,
    });

    const setResult = React.useCallback((result: T) => setState({ result, loading: false }), []);

    React.useEffect(() => {
        if (state.result !== undefined) return;

        makeRequest();
    }, [key]);

    return {
        loading: state.loading,
        result: state.result,
        reload: makeRequest,
        setResult,
    } as FetchHookResult<T>;
};
