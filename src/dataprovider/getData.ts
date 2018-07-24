import csvToJSON from 'csvtojson';
import path from 'path';
import {finalizeResponse, finalizeException} from '../utils';

const fileName = 'daily-minimum-temperatures-in-me.csv';

const GETData = (request, response) =>
    csvToJSON()
        .fromFile(path.join(__dirname, `data/${fileName}`))
        .then(finalizeResponse(response));

export {
    GETData
}