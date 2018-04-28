const
    chalk = require('chalk'),
    express = require('express'),
    util = require('../util'),
    config = require('../config'),

    Mappings = require('./mappings'),
    {listViews, listRepositories, listProjects, listModels} = require('./list-repositories'),

    log = util.createLogger('srv'),
    app = express();

app.get(Mappings.LIST_MODELS_URL, listModels);
app.get(Mappings.LIST_VIEWS_URL, listViews);
app.get(Mappings.LIST_PROJECTS_URL, listProjects);
app.get(Mappings.LIST_REPOSITORIES_URL, listRepositories);

app.listen(config.SERVICES_PORT, () => log(`services started @ localhost:${chalk.cyan(config.SERVICES_PORT)}`));

module.exports = app;
