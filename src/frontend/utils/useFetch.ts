import * as React from 'react';
import { useDataProvider } from '@frontend/provider';
import { __initial__ } from '@frontend/window';

type FetchHookState<T> =
    | { loading: false; result: T }
    | { loading: true; result: undefined };

type FetchHookResult<T> = FetchHookState<T> & {
    reload: () => void;
    setResult: (result: T) => void;
};

type ProviderFunction<T = any> = (...args: any) => Promise<T>;
type ProviderFunctionResult<F extends ProviderFunction> = F extends ProviderFunction<infer R> ? R : never;

function getInitialData() {
    const provider = useDataProvider();

    return React.useMemo(() => {
        if (typeof window === 'undefined') return provider.getInitialData();
        if (!__initial__.data) return undefined;

        const { data } = __initial__;
        __initial__.data = undefined;
        return data;
    }, []);
}

export const useFetch = <
    F extends ProviderFunction = ProviderFunction,
    A extends Parameters<F> = Parameters<F>,
    R extends ProviderFunctionResult<F> = ProviderFunctionResult<F>,
>(key: string, fetch: F, ...args: A): FetchHookResult<R> => {
    const initialData = getInitialData();

    const makeRequest = React.useMemo(() => () => {
        setState({ result: undefined, loading: true })

        fetch(...args as any[]).then(result => {
            setState({ result, loading: false });
        });
    }, [fetch, key]);

    const [state, setState] = React.useState<FetchHookState<R>>({
        result: initialData,
        loading: !initialData,
    });

    const setResult = React.useCallback((result: R) => setState({ result, loading: false }), []);

    React.useEffect(() => {
        if (state.result !== undefined) return;

        makeRequest();
    }, [key]);

    return {
        loading: state.loading,
        result: state.result,
        reload: makeRequest,
        setResult,
    } as FetchHookResult<R>;
};
