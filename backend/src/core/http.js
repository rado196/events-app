/* eslint-disable no-console */

const express = require('express');
const cors = require('cors');
const expressListRoutes = require('express-list-routes');

const app = express();
app.use(express.json());
app.use(cors());

const routeGroup = function (prefix, callback) {
  const router = express.Router();
  callback(router);
  app.use(prefix, router);
};

const printRoutes = function () {
  console.log('~'.repeat(80));
  expressListRoutes(app);
  console.log('~'.repeat(80));
  console.log();
};

const listen = function (callback) {
  // eslint-disable-next-line unicorn/numeric-separators-style
  const port = process.env.NODE_PORT || process.env.PORT || 43210;

  app.listen(port, function () {
    console.log(`✅ Events app listening on port ${port}`);
    console.log();

    callback();
  });
};

module.exports.routeGroup = routeGroup;
module.exports.printRoutes = printRoutes;
module.exports.listen = listen;
