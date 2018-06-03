import {genSalt, hash, compare} from 'bcryptjs';
import {Secret, sign, SignOptions} from 'jsonwebtoken';
import {promisify} from 'util';

import {AuthUserModel, UserDBModel, UserModel, UserLoginModel} from '../models';
import {JWT_SALT, JWT_SETTINGS} from '../../config';
import {asyncEnsureParams, message, reject} from '../../utils';
import {base64Jdenticon} from '../../utils/jdenticon';

const
    USER_QUERY = 'name avatar date',
    USER_NOT_FOUND_ERROR = 'USER_NOT_FOUND',
    USER_ALREADY_EXISTS_ERROR = 'USER_ALREADY_EXISTS',
    USER_REGISTERED_SUCCESS = 'USER_REGISTERED',
    INVALID_PASSWORD_ERROR = 'INVALID_PASSWORD',

    asyncGenSalt = promisify<string>(genSalt),
    asyncHash = promisify<string, string, string>(hash),

    createUser = (user: UserModel) =>
        (new UserDBModel(user)).save(),

    hashPasswordWithSalt = (password: string, salt: string): Promise<string> =>
        asyncHash(password, salt),

    hashPassword = (password: string): Promise<string> =>
        asyncGenSalt()
            .then(hashPasswordWithSalt.bind(this, password)),

    encodeAvatar = (user: UserModel) => ({
        ...user,
        avatar: user.avatar || base64Jdenticon(user.name)
    }),

    hashUserPassword = (user: UserModel): Promise<UserModel> =>
        hashPassword(user.password)
            .then(password => user.password = password)
            .then(() => user),

    compareUserCredentials = (user: UserLoginModel, secondUser: UserModel): Promise<UserLoginModel> =>
        compare(user.password, secondUser.password)
            .then((authorized) => authorized ? user : reject(INVALID_PASSWORD_ERROR)),

    generateToken = (user: any): string =>
        sign({name: user.name, id: user._id}, JWT_SALT, JWT_SETTINGS),

    generateUserWithToken = (user: any): AuthUserModel => ({
        name: user.name,
        id: user._id,
        token: generateToken(user)
    }),

    getUserWithPasswordByName = (name: string) =>
        UserDBModel.findOne({name}).exec(),

    ensureUserDoesNotExist = (userModel: UserModel): Promise<UserModel> =>
        getUserByName(userModel.name)
            .then((found) => found ? reject(USER_ALREADY_EXISTS_ERROR) : userModel);

export const
    getUserByName = (name: string) =>
        UserDBModel.findOne({name}).select(USER_QUERY).exec(),

    getUserById = (_id: number) =>
        UserDBModel.findOne({_id}).select(USER_QUERY).exec(),

    registerUser = (user: UserModel) =>
        asyncEnsureParams(user, ['name', 'password'])
            .then(() => ensureUserDoesNotExist(user))
            .then(hashUserPassword)
            .then(encodeAvatar)
            .then(createUser)
            .then(() => message(USER_REGISTERED_SUCCESS)),

    authorizeUser = (user: UserLoginModel) =>
        asyncEnsureParams(user, ['name', 'password'])
            .then(() => getUserWithPasswordByName(user.name))
            .then((found) => found ? found : reject(USER_NOT_FOUND_ERROR))
            .then(compareUserCredentials.bind(this, user))
            .then(generateUserWithToken);
