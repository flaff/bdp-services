import {connect} from 'mongoose';
import {createLogger} from '../utils/log';
import {MONGODB_URL} from '../config';
import chalk from 'chalk';


const log = createLogger('mongo', chalk.green);

export default () =>
    connect(MONGODB_URL)
        .then(() => log(`successfully connected to {{${MONGODB_URL}}}`))
        .catch((e) => log.error('failed to connect to database ' + MONGODB_URL + e));
