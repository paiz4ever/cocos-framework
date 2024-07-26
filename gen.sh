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
-x outputCodeDir=$CORE_ROOT/internal/managers/config/schema \
-x outputDataDir=$CORE_ROOT/internal/resources/tables

read -p "Press any key to continue..."