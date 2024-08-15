set WORKSPACE=./tables
set CONF_ROOT=./tables
set CORE_ROOT=./extensions/core/assets
set LUBAN_DLL=%WORKSPACE%\luban\Luban.dll

dotnet %LUBAN_DLL% ^
    -t client ^
    -c typescript-json ^
    -d json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputCodeDir=%CORE_ROOT%\builtin\definitions ^
    -x outputDataDir=%CORE_ROOT%\internal\resources\tables