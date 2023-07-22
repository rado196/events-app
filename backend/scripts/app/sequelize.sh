#!/usr/bin/env bash

## ----------------------------------------------------------------------------------
## init script
cd "$(dirname "$0")/../../" || exit 1
if [[ "$(command -v realpath)" != "" ]]; then
  ROOT_DIR="$(realpath "$PWD")"
else
  ROOT_DIR="$PWD"
fi

## ----------------------------------------------------------------------------------
## functions
function get_config() {
  local CONFIG_NAME="$1"

  node --eval "
    const configs = require('./.sequelizerc');
    console.log(configs['$CONFIG_NAME']);
  "
}

## ----------------------------------------------------------------------------------
## import environment variables

source "$ROOT_DIR/.env"

## ----------------------------------------------------------------------------------
## run command
OTHER_ARGS="${@:1}"


APP_NPM_CLI_BIN="$ROOT_DIR/node_modules/.bin"
"$APP_NPM_CLI_BIN/babel-node" \
  --require "$ROOT_DIR/src/core/environment.js" \
  "$APP_NPM_CLI_BIN/sequelize" \
    $OTHER_ARGS \
    --config "$(get_config "config")" \
    --models-path "$(get_config "models-path")" \
    --migrations-path "$(get_config "migrations-path")" \
    --seeders-path "$(get_config "seeders-path")" \
    --debug

if [[ $? != 0 ]]; then
  echo "Failed to run sequelize command with following arguments: $OTHER_ARGS"
  exit 2
fi
