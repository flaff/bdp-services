import jdenticon from 'jdenticon';
import {JDENTICON_PADDING, JDENTICON_SIZE} from '../config';

export const base64Jdenticon = (value, size = JDENTICON_SIZE, padding = JDENTICON_PADDING) =>
    jdenticon
        .toPng(value, size, padding)
        .toString('base64');