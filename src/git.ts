const chalk = require('chalk');
const path = require('path');
const GitServer = require('node-git-server');
import {GIT_PORT} from './config';
import {createLogger, shortenRevision} from './utils/log';

const log = createLogger('git', chalk.magenta);

const
    authenticate = (type, repository, user, next) => {
        log(`AUTH ${type} -> ${repository}`);
        user((username, password) => {
            log(`AUTH ${username} ${password}`);
            next()
        });
    },

    repositoriesPath = path.resolve(__dirname, 'repositories'),

    git = new GitServer(repositoriesPath, {
        autoCreate: true,
        authenticate
    }),

    onFetch = (fetch) => {
        log(`FETCH ${fetch.repo} ${fetch.commit} ${fetch.branch}`);
        fetch.accept();
    },

    onPush = (push) => {
        log(`PUSH by ${chalk.yellow(push.username)} to ${chalk.yellow(push.repo)} ${shortenRevision(push.last)}->${shortenRevision(push.commit)}`);
        push.accept();
    },

    onListen = () => {
        log(`repos are stored in ${chalk.cyan(repositoriesPath)}`);
        log(`Git VCS started @ localhost:{{${GIT_PORT}}}`);
    };


git.on('push', onPush);
git.on('fetch', onFetch);
git.listen(GIT_PORT, onListen);

export default git;
