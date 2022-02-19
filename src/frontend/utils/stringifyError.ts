import type { IApiError } from '@frontend/typings/api';

export default function stringifyError(error: Error | IApiError | string | undefined): string {
    if (!error) return '//unknown error (empty)//';

    if (typeof error === 'string') return error;

    if (error instanceof Error) return error.message;

    if ('error' in error) return error.error;

    return '//unknown error (no case)//';
}
