const path = require('node:path');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');

dotenvExpand.expand(
  dotenv.config({
    path: path.join(__dirname, '..', '..', '.env'),
  })
);
