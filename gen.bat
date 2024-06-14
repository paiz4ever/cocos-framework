set WORKSPACE=./configs
set CONF_ROOT=./configs
set CORE_ROOT=./extensions/core/assets
set LUBAN_DLL=%WORKSPACE%\luban\Luban.dll

dotnet %LUBAN_DLL% ^
    -t client ^
    -c typescript-json ^
    -d json ^
    --conf %CONF_ROOT%\luban.conf ^
    -x outputCodeDir=%CORE_ROOT%\builtin\generated\managers\config\schema ^
    -x outputDataDir=%CORE_ROOT%\internal\cfgs

pause