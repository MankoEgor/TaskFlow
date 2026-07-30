export function toError(error: unknown, fallbackMessage = 'Something went wrong'): Error {
    if (error instanceof Error) {
        return error;
    }

    if (typeof error === 'string') {
        return new Error(error);
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        return new Error(error.message);
    }

    return new Error(fallbackMessage);
}
