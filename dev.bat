@echo off
chcp 65001 >nul
setlocal EnableExtensions
cd /d "%~dp0"
title IFrame changer

for /f %%a in ('echo prompt $E^| cmd') do set "E=%%a"
set "C_T=%E%[38;5;141m"
set "C_K=%E%[38;5;220m"
set "C_D=%E%[90m"
set "C_OK=%E%[32m"
set "C_ERR=%E%[31m"
set "C_R=%E%[0m"

where npm >nul 2>nul || (
  echo %C_ERR%[X] Node.js not found. Install it from https://nodejs.org%C_R%
  pause & exit /b 1
)
if not exist "node_modules\" (
  echo %C_D%First run - installing dependencies...%C_R%
  call npm install --no-audit --no-fund || goto :fail
)

for /f "delims=" %%v in ('node -p "require('./src/manifest.json').version"') do set "VER=%%v"

rem Without the menu: dev.bat build ^| check ^| chrome ^| firefox ^| both ^| release
if not "%~1"=="" (
  set "ARG=1"
  for %%c in (build check release chrome firefox both dist) do if /i "%~1"=="%%c" (
    call :do_%%c
    exit /b
  )
  echo Unknown command: %~1
  echo Available: build, check, release, chrome, firefox, both, dist
  exit /b 1
)

:menu
cls
echo.
echo   %C_T%IFrame changer%C_R%  %C_D%v%VER%%C_R%
echo   %C_D%────────────────────────────────────────────%C_R%
echo.
echo   %C_K%1%C_R%  Build            %C_D%Chrome + Firefox zips → dist\%C_R%
echo   %C_K%2%C_R%  Check            %C_D%errors, files, translations, AMO validator%C_R%
echo   %C_K%3%C_R%  Release          %C_D%check, then build if everything passes%C_R%
echo.
echo   %C_K%4%C_R%  Chrome           %C_D%run with auto-reload%C_R%
echo   %C_K%5%C_R%  Firefox          %C_D%run with auto-reload%C_R%
echo   %C_K%6%C_R%  Both browsers
echo.
echo   %C_K%D%C_R%  Open dist\       %C_K%0%C_R%  Exit
echo.
choice /c 123456D0 /n /m "  Press a key: "
set "K=%errorlevel%"
echo.
if "%K%"=="1" call :do_build
if "%K%"=="2" call :do_check
if "%K%"=="3" call :do_release
if "%K%"=="4" call :do_chrome
if "%K%"=="5" call :do_firefox
if "%K%"=="6" call :do_both
if "%K%"=="7" call :do_dist
if "%K%"=="8" exit /b 0
echo.
echo   %C_D%Press any key to return to the menu...%C_R%
pause >nul
goto :menu

:do_build
echo   %C_T%Building v%VER%%C_R%
call npm run --silent build || goto :fail
echo.
echo   %C_OK%Done.%C_R%
if not defined ARG start "" explorer "%~dp0dist"
exit /b 0

:do_check
echo   %C_T%Checking%C_R%
call npm run --silent check || goto :fail
exit /b 0

:do_release
call :do_check || exit /b 1
echo.
call :do_build
exit /b %errorlevel%

:do_chrome
start "Chrome - IFrame changer" cmd /k npm run dev:chrome
echo   %C_OK%Chrome is starting in a separate window.%C_R%
exit /b 0

:do_firefox
start "Firefox - IFrame changer" cmd /k npm run dev:firefox
echo   %C_OK%Firefox is starting in a separate window.%C_R%
exit /b 0

:do_both
call :do_chrome
call :do_firefox
exit /b 0

:do_dist
if not exist "dist\" mkdir dist
start "" explorer "%~dp0dist"
exit /b 0

:fail
echo.
echo   %C_ERR%[X] Failed - see the output above.%C_R%
exit /b 1
