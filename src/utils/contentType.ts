import {finalizeException} from './log';
import {createServiceException} from './exception';

const
    INVALID_CONTENT_TYPE_ERROR = 'INVALID_CONTENT_TYPE',

    CONTENT_TYPE_HEADER = 'Content-Type',

    getContentTypeHeader = (request) =>
        request.headers[CONTENT_TYPE_HEADER] || request.headers[CONTENT_TYPE_HEADER.toLowerCase()];

export const
    checkContentType = (request, response, next) =>
        getContentTypeHeader(request) === 'application/json'
            ? next()
            : finalizeException(response)(createServiceException(INVALID_CONTENT_TYPE_ERROR));
