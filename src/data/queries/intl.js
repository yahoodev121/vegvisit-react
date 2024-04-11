import fs from 'fs';
import { join } from 'path';
import Promise from 'bluebird';
import {
  GraphQLList as List,
  GraphQLString as StringType,
  GraphQLNonNull as NonNull,
} from 'graphql';
import IntlMessageType from '../types/IntlMessageType';
import { locales } from '../../config';

// A folder with messages
const CONTENT_DIR = join(__dirname, './messages');

const readFile = Promise.promisify(fs.readFile);

const intl = {
  type: new List(IntlMessageType),
  args: {
    locale: { type: new NonNull(StringType) },
  },
  async resolve({ request }, { locale }) {
    if (!locales.includes(locale)) {
      throw new Error(`Locale '${locale}' not supported`);
    }

    let localeData;
    try {
      localeData = await readFile(join(CONTENT_DIR, `${locale}.json`));
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new Error(`Locale '${locale}' not found`);
      }
    }

    return JSON.parse(localeData);
  },
};

export default intl;
