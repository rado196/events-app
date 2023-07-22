#!/usr/bin/env bash

## ----------------------------------------------------------------------------------
## init script
cd "$(dirname "$0")/../../" || exit 1
if [[ "$(command -v realpath)" != "" ]]; then
  ROOT_DIR="$(realpath "$PWD")"
else
  ROOT_DIR="$PWD"
fi
source "$(dirname "$0")/../includes.sh"

# ## ----------------------------------------------------------------------------------
# ## check .env file existence
# check_env_file

## ----------------------------------------------------------------------------------
## check node modules installed
if [[ ! -d "$APP_NPM_ROOT" ]]; then
  npm install
  check_exit $? ${ERROR_INSTALL_MODULES[@]}
fi

## ----------------------------------------------------------------------------------
## clear vite cache
if [[ -d "$APP_NPM_ROOT/.vite" ]]; then
  rm -rf "$APP_NPM_ROOT/.vite"
fi

## ----------------------------------------------------------------------------------
## start development server
"$APP_NPM_CLI_BIN/vite" dev \
  --host 127.0.0.1 \
  --port 10001 \
  --config vite.config.js
check_exit $? ${ERROR_APP_SERVE_DEVELOPMENT[@]}
