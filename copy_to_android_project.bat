@echo off setlocal enabledelayedexpansion

set "sourceFolder=E:\\02_code\\05_uniapp_project\\demoapp\\DeliverRobotControlApp\\unpackage\\resources" 
set "destinationFolder=E:\\02_code\\03_android_space\\Android-SDK@4.57.82388_20250321\\Android-SDK@4.57.82388_20250321\\UniPlugin-Hello-AS\\app\\src\\main\\assets\\apps"

if not exist "%sourceFolder%" ( echo Error: Source folder "%sourceFolder%" does not exist. pause exit /b 1 )

if not exist "%destinationFolder%" ( mkdir "%destinationFolder%" )

echo Copying "%sourceFolder%" to "%destinationFolder%"... xcopy "%sourceFolder%\*.\*" "%destinationFolder%" /E /Y /D

if %ERRORLEVEL% equ 0 ( echo Copy completed successfully. ) else ( echo Error occurred during copy operation. )

pause exit /b 0