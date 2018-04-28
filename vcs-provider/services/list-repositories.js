const
    util = require('../util'),
    git = require('../git');

const
    MODEL_REGEX = /[^\\/]*[\\/]model[\\/]/,
    VIEW_REGEX = /[^\\/]*[\\/]view[\\/]/,
    PROJECT_REGEX = /[^\\/]*[\\/]project[\\/]/,

    isAModel = (string) => MODEL_REGEX.test(string),
    isAView = (string) => VIEW_REGEX.test(string),
    isAProject = (string) => PROJECT_REGEX.test(string),


    listRepositories = (request, response) =>
        util.deepList(git.dirMap())
            .then(util.flattenObjectToArray)
            .then(util.removeExtensionsFromArray)
            .then(JSON.stringify)
            .then((string) => response.send(string))
    ,

    listModels = (request, response) =>
        util.deepList(git.dirMap())
            .then(util.flattenObjectToArray)
            .then(util.removeExtensionsFromArray)
            .then(util.filterArray(isAModel))
            .then(JSON.stringify)
            .then((string) => response.send(string))
    ,

    listProjects = (request, response) =>
        util.deepList(git.dirMap())
            .then(util.flattenObjectToArray)
            .then(util.removeExtensionsFromArray)
            .then(util.filterArray(isAProject))
            .then(JSON.stringify)
            .then((string) => response.send(string))
    ,

    listViews = (request, response) =>
        util.deepList(git.dirMap())
            .then(util.flattenObjectToArray)
            .then(util.removeExtensionsFromArray)
            .then(util.filterArray(isAView))
            .then(JSON.stringify)
            .then((string) => response.send(string))
    ;


module.exports = {
    listModels,
    listProjects,
    listRepositories,
    listViews
};
