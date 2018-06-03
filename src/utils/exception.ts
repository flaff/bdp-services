import {ServiceException} from './promise';

export const
    createServiceException = (message: string, details?: any, code: number = 400) => {
        const error: ServiceException = new Error(message);
        error.code = code;
        error.details = details;
        return error;
    };
