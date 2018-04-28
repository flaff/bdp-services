const
    fs = require('fs'),
    chalk = require('chalk'),
    moment = require('moment'),

    TIME_FORMAT = 'HH:mm:ss',
    DEFAULT_DELIMITER = '/',
    GIT_EXTENSION = 'git',

    shortenRevision = (fullRevision) => fullRevision.split('').filter((e, i) => i < 7).join(''),

    createLogger = (name) => (message) => console.log(chalk.gray(`${moment().format(TIME_FORMAT)} [${name}] `) + message),

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

    getFolders = (path) => new Promise((resolve, reject) => {
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
            .then(folders => {
                awaitPromiseMap(
                    arraysToMap(
                        folders,
                        folders.map(folder => isARepository(folder)
                            ? instantPromise(folder)
                            : deepList(toFullPath(path, folder))
                        )
                    )
                )
                    .then(resolve)
                    .catch(reject)
            })
    ),

    flattenObjectToArray = (object, delimiter, prefix) => {
        return [].concat.apply([], Object.keys(object).map(key =>
            object[key].constructor === Object
                ? flattenObjectToArray(object[key], delimiter, (prefix ? `${prefix}${delimiter || DEFAULT_DELIMITER}` : '') + key)
                : (prefix ? `${prefix}/` : '') + key
        ));
    },

    filterArray = (fn) => (array) => array.filter(fn),

    removeExtension = (string) => string.slice(0, -(GIT_EXTENSION.length + 1)),
    removeExtensionsFromArray = (array) => array.map(removeExtension);


module.exports = {
    deepList,
    shortenRevision,
    createLogger,
    isARepository,
    removeExtension,
    removeExtensionsFromArray,
    filterArray,
    flattenObjectToArray
};
