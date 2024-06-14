#!/bin/bash

WORKSPACE=./configs
CONF_ROOT=./configs
ASSET_ROOT=./assets
LUBAN_DLL=$WORKSPACE/luban/Luban.dll

dotnet $LUBAN_DLL \
-t client \
-c typescript-json \
-d json \
--conf $CONF_ROOT/luban.conf \
-x outputCodeDir=$ASSET_ROOT/app-builtin/generated \
-x outputDataDir=$ASSET_ROOT/app-config/generated

read -p "Press any key to continue..."