/* eslint-disable no-console */

const path = require('node:path');
const fs = require('node:fs');

const { Sequelize } = require('sequelize');
const configs = require('../database/config');
const hooks = require('../database/hooks');

function printError(e) {
  console.log(`❌ Events app cannot connect to database.`);
  console.log();

  console.error(e);
  process.exit();
}

const models = {};
function registerModels() {
  const dir = path.join(__dirname, '..', 'models');

  const modelFiles = fs
    .readdirSync(dir)
    .filter(function (modelName) {
      return /^.+\.js$/.test(modelName);
    })
    .map(function (modelName) {
      return {
        name: modelName.replace(/\.js$/g, ''),
        file: path.join(dir, modelName),
      };
    });

  for (const modelInfo of modelFiles) {
    models[modelInfo.name] = require(modelInfo.file);
  }
}

function mapOnModels(callback) {
  const modelsList = Object.values(models);
  for (const model of modelsList) {
    callback(model);
  }
}

function bootstrapModels(sequelizeInstance) {
  sequelize = sequelizeInstance;
  registerModels();

  // initiate models
  mapOnModels(function (model) {
    model.initiate(sequelizeInstance);
  });

  // associate all models
  mapOnModels(function (model) {
    model.associate(models);
  });
}

let sequelize = null;
async function connect(callback) {
  try {
    // initialize connection
    sequelize = new Sequelize(configs);
    for (const hookName in hooks) {
      sequelize.addHook(hookName, hooks[hookName]);
    }

    bootstrapModels(sequelize);

    // connect to database
    sequelize
      .authenticate()
      .then(function () {
        console.log(`✅ Events app successfully connected to database.`);
        callback();
      })
      .catch(function (e) {
        printError(e);
      });
  } catch (e) {
    printError(e);
  }
}

function getSequelizeInstance() {
  return sequelize;
}

module.exports.connect = connect;
module.exports.bootstrapModels = bootstrapModels;
module.exports.getSequelizeInstance = getSequelizeInstance;
