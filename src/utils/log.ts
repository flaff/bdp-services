import chalk, {Chalk} from 'chalk';
import fs from 'fs';
import moment from 'moment';
import {ServiceException} from './promise';

interface Logger {
    (message: string): void;
    error: ((error: string) => void);
    warn: ((warning: string) => void);
}

const
    TIME_FORMAT = 'HH:mm:ss',
    DEFAULT_DELIMITER = '/',
    EMPTY_STRING = '',
    GIT_EXTENSION = 'git',

    shortenRevision = (fullRevision) => fullRevision.split('').filter((e, i) => i < 7).join(''),

    accentReplaceRegex = /{{([^}]*)}}/g,
    curlyBracesRegex = /[{}]/g,

    createLogger = (name: string, accent = chalk.cyan): Logger => {
        const colorizer = (value: string) => accent(value.replace(curlyBracesRegex, EMPTY_STRING));

        const logger = (message: string) => console.log(
            chalk.gray(`${moment().format(TIME_FORMAT)} [${name}] `) + message.replace(accentReplaceRegex, colorizer)
        );

        (logger as Logger).error = (error: string) => logger(`${chalk.red`[!]`} ${error}`);
        (logger as Logger).warn = (error: string) => logger(`${chalk.yellow`/!\\`} ${error}`);

        return logger as Logger;
    },

    awaitPromiseMap = (promiseMap) => new Promise((resolve, reject) => {
        const
            awaitResults = {},
            promiseNames = Object.keys(promiseMap);

        promiseNames.forEach(name =>
            promiseMap[name]
                .then(result => {
                    awaitResults[name] = result;
                    (Object.keys(awaitResults).length === promiseNames.length) && resolve(awaitResults);
                })
                .catch(reject)
        )
    }),

    getLastThreeChars = (string) => string.substring(string.length - 3, string.length),
    isARepository = (folder) => getLastThreeChars(folder) === 'git',

    getFolders = (path): Promise<Array<string>> => new Promise((resolve, reject) => {
        fs.readdir(path, (error, results) => {
            error && reject(error);
            results && resolve(results);
        });
    }),

    toFullPath = (path, folder) => `${path}\\${folder}`,

    arraysToMap = (keysArray, valuesArray) => {
        const map = {};
        keysArray.forEach((key, i) => map[key] = valuesArray[i]);
        return map;
    },

    instantPromise = (resolveValue) => new Promise(resolve => resolve(resolveValue)),

    deepList = (path) => new Promise((resolve, reject) =>
        getFolders(path)
            .then((folders) => {
                const folderPromises = folders.map(folder =>
                    isARepository(folder) ? instantPromise(folder) : deepList(toFullPath(path, folder))
                );

                Promise.all(folderPromises)
                    .then((values) => arraysToMap(folders, values))
                    .then(resolve)
                    .catch(reject);
            })
    ),

    flattenObjectToArray = (object, delimiter?, prefix?) => {
        return [].concat.apply([], Object.keys(object).map(key =>
            object[key].constructor === Object
                ? flattenObjectToArray(object[key], delimiter, (prefix ? `${prefix}${delimiter || DEFAULT_DELIMITER}` : '') + key)
                : (prefix ? `${prefix}/` : '') + key
        ));
    },

    filterArray = (fn) => (array) => array.filter(fn),

    removeExtension = (string) => string.slice(0, -(GIT_EXTENSION.length + 1)),
    removeExtensionsFromArray = (array) => array.map(removeExtension),

    finalizeResponse = <T = any>(response) => (data: T) => response.json(data),

    finalizeException = (response, log?) => (error: ServiceException) => {
        response.status(error.code).json({message: error.message, details: error.details});
        log ? log(error) : console.log('ERROR', error);
    };


export {
    deepList as deepDirectoryList,
    shortenRevision,
    createLogger,
    isARepository,
    removeExtension,
    removeExtensionsFromArray,
    filterArray,
    flattenObjectToArray,
    finalizeResponse,
    finalizeException
};
