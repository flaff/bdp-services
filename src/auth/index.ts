import {promisify} from 'util';
import {verify} from 'jsonwebtoken';

import {registerUser, authorizeUser, getUserById, getUserByName} from '../database/operations';
import {finalizeException, finalizeResponse, reject} from '../utils';
import {UserLoginModel} from '../database/models';
import {JWT_SALT} from '../config';

const
    UNAUTHORIZED_ERROR = 'UNAUTHORIZED',

    asyncVerify = promisify<string, string>(verify),
    getToken = (headers) =>
        headers['auth-token'];

export const
    CheckAuthorization = (request, response, next) =>
        asyncVerify(getToken(request.headers), JWT_SALT)
            .then((user) => request.user = user)
            .then(() => next())
            .catch(() => reject(UNAUTHORIZED_ERROR, void 0, 403))
            .catch(finalizeException(response)),

    POSTRegisterUser = (request, response) =>
        registerUser(request.body)
            .then(finalizeResponse(response))
            .catch(finalizeException(response)),

    POSTLoginUser = (request, response) =>
        authorizeUser(request.body as UserLoginModel)
            .then(finalizeResponse(response))
            .catch(finalizeException(response)),

    POSTRestoreUser = (request, response) =>
        getUserByName(request.user.name)
            .then((user) => user || reject(UNAUTHORIZED_ERROR, void 0, 403))
            .then(finalizeResponse(response))
            .catch(() => reject(UNAUTHORIZED_ERROR, void 0, 403))
            .catch(finalizeException(response))

;
