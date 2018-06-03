import {
    deepDirectoryList,
    filterArray,
    finalizeResponse,
    flattenObjectToArray,
    removeExtensionsFromArray
} from '../../utils/log';
import git from '../../git';

const
    MODEL_REGEX = /[^\\/]*[\\/]model[\\/]/,
    VIEW_REGEX = /[^\\/]*[\\/]view[\\/]/,
    PROJECT_REGEX = /[^\\/]*[\\/]project[\\/]/,

    isAModel = (string) => MODEL_REGEX.test(string),
    isAView = (string) => VIEW_REGEX.test(string),
    isAProject = (string) => PROJECT_REGEX.test(string),
    isARepositoryOfThisUser = (userName) => (repository) => repository.split('/').shift() === userName,


    listRepositories = () =>
        deepDirectoryList(git.dirMap())
            .then(flattenObjectToArray)
            .then(removeExtensionsFromArray),

    listProjects = () =>
        listRepositories()
            .then(filterArray(isAProject)),

    listViews = () =>
        listRepositories()
            .then(filterArray(isAView)),

    listModels = () =>
        listRepositories()
            .then(filterArray(isAModel)),


    GETListRepositories = (request, response) =>
        listRepositories()
            .then(finalizeResponse(response)),

    GETListModels = (request, response) =>
        listModels()
            .then(finalizeResponse(response)),

    GETListProjects = (request, response) =>
        listProjects()
            .then(finalizeResponse(response)),

    GETListViews = (request, response) =>
        listViews()
            .then(finalizeResponse(response))
    ;


export {
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
