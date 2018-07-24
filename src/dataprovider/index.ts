import {DATA_PROVIDER_PORT, SERVICES_PORT} from '../config';
import {createLogger} from '../utils/log';
import express from 'express';
import chalk from 'chalk';
import {GETData} from './getData';

const
    log = createLogger('dp'),
    app = express();

app.use(express.json());

app.get('/data', GETData);

app.listen(DATA_PROVIDER_PORT, () => log(`data provider started @ localhost:${chalk.cyan(`${DATA_PROVIDER_PORT}`)}`));