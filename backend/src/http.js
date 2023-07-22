/* eslint-disable no-console */

require('./core/environment');

const database = require('./core/database');
const http = require('./core/http');

console.clear();
console.log('>>> started:', new Date().toISOString());
console.log();

database.connect(function () {
  const routes = require('./routes');
  for (const route of routes) {
    http.routeGroup(route.prefix, function (router) {
      route.register(router);
    });
  }

  http.listen(function () {
    if (process.env.NODE_ENV !== 'production') {
      http.printRoutes();
    }
  });
});
