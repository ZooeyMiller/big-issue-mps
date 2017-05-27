const hapi = require('hapi');
const inert = require('inert');
const server = new hapi.Server();

const routes = require('./routes');

server.connection({
  port: process.env.PORT || 4000,
});

server.register([inert], err => {
  if (err) throw err;

  server.route(routes);
});

module.exports = server;
