@echo off
echo "copy resources files to app floder"
xcopy E:\02_code\05_uniapp_project\demoapp\DeliverRobotControlApp\unpackage\resources\*.* E:\02_code\03_android_space\Android-SDK@4.57.82388_20250321\Android-SDK@4.57.82388_20250321\UniPlugin-Hello-AS\app\src\main\assets\apps /y /e
echo "copy finished"