import {finalizeResponse, finalizeException} from '../utils';
const csvToJSON = require('csvtojson');
const path = require('path');

const fileName = 'daily-minimum-temperatures.csv';

const GETData = (request, response) =>
    csvToJSON()
        .fromFile(path.join(__dirname, `data/${fileName}`))
        .then(finalizeResponse(response));

export {
    GETData
}