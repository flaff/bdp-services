const
    util = require('../../util'),
    git = require('../../git');

const
    MODEL_REGEX = /[^\\/]*[\\/]model[\\/]/,
    VIEW_REGEX = /[^\\/]*[\\/]view[\\/]/,
    PROJECT_REGEX = /[^\\/]*[\\/]project[\\/]/,

    isAModel = (string) => MODEL_REGEX.test(string),
    isAView = (string) => VIEW_REGEX.test(string),
    isAProject = (string) => PROJECT_REGEX.test(string),
    isARepositoryOfThisUser = (userName) => (repository) => repository.split('/').shift() === userName,


    listRepositories = () =>
        util.deepDirectoryList(git.dirMap())
            .then(util.flattenObjectToArray)
            .then(util.removeExtensionsFromArray)
    ,

    listProjects = () =>
        listRepositories()
            .then(util.filterArray(isAProject))
    ,

    listViews = () =>
        listRepositories()
            .then(util.filterArray(isAView))
    ,

    listModels = () =>
        listRepositories()
            .then(util.filterArray(isAModel))
    ,


    GETListRepositories = (request, response) =>
        listRepositories()
            .then(util.finalizeResponse(response))
    ,

    GETListModels = (request, response) =>
        listModels()
            .then(util.finalizeResponse(response))
    ,

    GETListProjects = (request, response) =>
        listProjects()
            .then(util.finalizeResponse(response))
    ,

    GETListViews = (request, response) =>
        listViews()
            .then(util.finalizeResponse(response))
    ;


module.exports = {
    isAView,
    isAModel,
    isAProject,
    isARepositoryOfThisUser,

    listRepositories,
    listViews,
    listModels,
    listProjects,

    GETListModels,
    GETListProjects,
    GETListRepositories,
    GETListViews
};
