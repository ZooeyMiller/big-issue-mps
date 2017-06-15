const { Pool } = require('pg');
const url = require('url');

const environment = require('env2');

/* istanbul ignore else */
if (process.env.NODE_ENV === 'test') {
  environment('.config-test.env');
} else {
  environment('.config.env');
}
/* istanbul ignore if */
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL missing from .env.');
}

const params = url.parse(process.env.DATABASE_URL);
const [username, password] = params.auth.split(':');

const options = {
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  max: process.env.DB_MAX_CONNECTIONS || 20,
  ssl: params.hostname !== 'localhost',
};
/* istanbul ignore else */
if (username) {
  options.user = username;
}
/* istanbul ignore else */
if (password) {
  options.password = password;
}

module.exports = new Pool(options);
