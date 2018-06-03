import chalk from 'chalk';
import express from 'express';
import connectToDatabase from '../database';
import {createLogger} from '../utils/log';
import {SERVICES_PORT} from '../config';
import Mappings from './mappings';
import {GETListViews, GETListRepositories, GETListProjects, GETListModels} from './repositories/list';
import {GETUserHighlight} from './user/highlight';
import {POSTLoginUser, POSTRegisterUser, CheckAuthorization} from '../auth';
import {checkContentType} from '../utils/contentType';

const
    log = createLogger('srv'),
    app = express();

app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));

connectToDatabase();

app.post(Mappings.LOGIN_URL, checkContentType, POSTLoginUser);
app.post(Mappings.REGISTER_URL, checkContentType, POSTRegisterUser);

app.get(Mappings.LIST_MODELS_URL, GETListModels);
app.get(Mappings.LIST_VIEWS_URL, GETListViews);
app.get(Mappings.LIST_PROJECTS_URL, GETListProjects);
app.get(Mappings.LIST_REPOSITORIES_URL, GETListRepositories);
app.get(Mappings.USER_HIGHLIGHT_URL, GETUserHighlight);

app.listen(SERVICES_PORT, () => log(`services started @ localhost:${chalk.cyan(`${SERVICES_PORT}`)}`));

module.exports = app;
