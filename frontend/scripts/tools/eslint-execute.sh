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

## ----------------------------------------------------------------------------------
## check node modules installed
if [[ ! -d "$APP_NPM_ROOT" ]]; then
  npm install
  check_exit $? ${ERROR_INSTALL_MODULES[@]}
fi

## ----------------------------------------------------------------------------------
## remove cache folder
if [[ -d node_modules ]]; then
  rm -rf "$APP_NPM_CACHE/eslint*"
  check_exit $? ${ERROR_APP_LINT_UNCACHE[@]}
fi

## ----------------------------------------------------------------------------------
## execute lint
ESLINT_FILE=""
if [[ "prod" == "$1" ]]; then
  ESLINT_FILE=".eslintrc.prod"
else
  ESLINT_FILE=".eslintrc"
fi

"$APP_NPM_CLI_BIN/eslint" \
  --ext js,jsx \
  --config "$ESLINT_FILE" \
  src

check_exit $? ${ERROR_APP_LINT_EXECUTE[@]}
