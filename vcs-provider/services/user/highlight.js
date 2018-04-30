const
    util = require('../../util'),
    repos = require('../repositories/list'),
    provider = require('./data.mock');


const
    getUser = provider.getUserData,
    areReposOfUser = (userName) => (repos) => repos.filter(repos.isARepositoryOfThisUser(userName)),

    addReposToHighlight = (highlightResponse, repositories) => {
    },

    GETUserHighlight = (request, response) => {
        getUser(request.params.userName)
            .then(util.finalizeResponse(response));
    };

module.exports = {
    GETUserHighlight
};
