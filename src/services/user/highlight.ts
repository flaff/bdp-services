import {getUserByName} from '../../database/operations';

const
    util = require('../../utils/log'),
    repos = require('../repositories/list');


const
    areReposOfUser = (userName) => (repos) => repos.filter(repos.isARepositoryOfThisUser(userName)),

    addReposToHighlight = (highlightResponse, repositories) => {
    },

    GETUserHighlight = (request, response) => {
        getUserByName(request.params.userName)
            .then(util.finalizeResponse(response));
    };

export {
    GETUserHighlight
};
