const
    chalk = require('chalk'),
    express = require('express'),
    util = require('../util'),
    config = require('../config'),

    Mappings = require('./mappings'),
    {GETListViews, GETListRepositories, GETListProjects, GETListModels} = require('./repositories/list'),
    {GETUserHighlight} = require('./user/highlight'),

    log = util.createLogger('srv'),
    app = express();

app.get(Mappings.LIST_MODELS_URL, GETListModels);
app.get(Mappings.LIST_VIEWS_URL, GETListViews);
app.get(Mappings.LIST_PROJECTS_URL, GETListProjects);
app.get(Mappings.LIST_REPOSITORIES_URL, GETListRepositories);
app.get(Mappings.USER_HIGHLIGHT_URL, GETUserHighlight);

app.listen(config.SERVICES_PORT, () => log(`services started @ localhost:${chalk.cyan(config.SERVICES_PORT)}`));

module.exports = app;
