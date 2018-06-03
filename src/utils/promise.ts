import {createServiceException} from './exception';

export interface ServiceException<T = any> extends Error {
    code?: number;
    details?: T;
}

export const
    reject = (message: string, details?: any, code: number = 400) => {
        throw createServiceException(message, details, code);
    },

    ensureParams = (obj: any, params: Array<string>) => {
        for (let i = 0; i < params.length; i++) {
            obj[params[i]] === undefined && reject(`MISSING_PARAM`, {
                name: params[i]
            });
        }
        return true;
    },

    asyncEnsureParams = (obj: any, params: Array<string>): Promise<void> =>
        new Promise((resolve, reject) => ensureParams(obj, params) && resolve()),

    message = (message: string) => ({
        message
    }),

    rejectIfExistsWith = <T>(e: any, returnInstead: T) => (result: any): T =>
        result ? reject(e) : (returnInstead || result),

    rejectIfExists = (e: any) => (result: any) =>
        result ? reject(e) : result,

    rejectIfNoneWith = <T>(e: any, returnInstead: T) => (result: any): T => {
        !result && reject(e);
        return returnInstead;
    },

    rejectIfNone = (e: any) => (result: any) =>
        result ? result : reject(e);

