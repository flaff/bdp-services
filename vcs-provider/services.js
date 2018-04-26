const
    chalk = require('chalk'),
    express = require('express'),
    util = require('./util'),
    config = require('./config'),
    git = require('./git'),

    log = util.createLogger('srv'),
    app = express();

app.get('/getRepos', (request, response) => {
    util.deepList(git.dirMap())
        .then(util.flattenObjectToArray)
        .then(util.removeExtensionsFromArray)
        .then(JSON.stringify)
        .then((string) => response.send(string));
});

app.listen(config.SERVICES_PORT, () => log(`services started @ localhost:${chalk.cyan(config.SERVICES_PORT)}`));

module.exports = app;
