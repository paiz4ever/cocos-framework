set WORKSPACE=./configs
set CONF_ROOT=./configs
set ASSET_ROOT=./assets
set LUBAN_DLL=%WORKSPACE%\luban\Luban.dll

dotnet %LUBAN_DLL% ^
    -t client ^
    -c typescript-json ^
    -d json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputCodeDir=%ASSET_ROOT%\app-builtin\generated ^
    -x outputDataDir=%ASSET_ROOT%\app-config\generated

pause