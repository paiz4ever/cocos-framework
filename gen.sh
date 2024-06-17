#!/bin/bash

WORKSPACE=./configs
CONF_ROOT=./configs
CORE_ROOT=./extensions/core/assets
LUBAN_DLL=$WORKSPACE/luban/Luban.dll

dotnet $LUBAN_DLL \
-t client \
-c typescript-json \
-d json \
--conf $CONF_ROOT/luban.conf \
-x outputCodeDir=$CORE_ROOT/builtin/managers/config/schema \
-x outputDataDir=$CORE_ROOT/internal/tables

read -p "Press any key to continue..."