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
## format code
npm run tool:code:format
check_exit $? ${ERROR_APP_FORMAT_CODE[@]}

## ----------------------------------------------------------------------------------
## execute lint
npm run tool:code:lint:prod
check_exit $? ${ERROR_APP_LINT_EXECUTE[@]}

## ----------------------------------------------------------------------------------
## build production release
npm run build
check_exit $? ${ERROR_APP_BUILD_PRODUCTION[@]}

## ----------------------------------------------------------------------------------
## add re-formatted files to git
git add .
