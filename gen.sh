#!/bin/bash

WORKSPACE=./tables
CONF_ROOT=./tables
CORE_ROOT=./extensions/core/assets
LUBAN_DLL=$WORKSPACE/luban/Luban.dll

dotnet $LUBAN_DLL \
-t client \
-c typescript-json \
-d json \
--conf $CONF_ROOT/luban.conf \
-x outputCodeDir=$CORE_ROOT/builtin/definitions/table \
-x outputDataDir=$CORE_ROOT/internal/resources/tables