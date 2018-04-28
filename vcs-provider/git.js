const
    chalk = require('chalk'),
    path = require('path'),
    GitServer = require('node-git-server'),
    config = require('./config'),
    util = require('./util'),
    log = util.createLogger('git');

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
        log(`PUSH by ${chalk.yellow(push.username)} to ${chalk.yellow(push.repo)} ${util.shortenRevision(push.last)}->${util.shortenRevision(push.commit)}`);
        push.accept();
    },

    onListen = () => {
        log(`repos are stored in ${chalk.cyan(repositoriesPath)}`);
        log(`server started @ ${chalk.cyan(`localhost:${config.GIT_PORT}`)}`);
    };


git.on('push', onPush);
git.on('fetch', onFetch);
git.listen(config.GIT_PORT, onListen);

module.exports = git;
