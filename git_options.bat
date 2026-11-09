@echo off
setlocal EnableExtensions DisableDelayedExpansion
chcp 65001 >nul
title Git Menu
pushd "%~dp0"
if errorlevel 1 exit /b 1

where git >nul 2>&1
if errorlevel 1 goto NO_GIT
git rev-parse --show-toplevel >nul 2>&1
if errorlevel 1 goto NO_REPO

:MENU
cls
echo ========================================
echo                 Git Menu
echo ========================================
echo  1. Check Status
echo  2. Git Log
echo  3. Pull
echo  4. Commit and Push
echo  0. Exit
echo ========================================
choice /c 12340 /n /m "Select [1/2/3/4/0]: "
if errorlevel 255 goto EXIT_MENU
if errorlevel 5 goto EXIT_MENU
if errorlevel 4 goto COMMIT_PUSH
if errorlevel 3 goto PULL
if errorlevel 2 goto LOGS
if errorlevel 1 goto STATUS
goto EXIT_MENU

:STATUS
echo.
git status
if errorlevel 1 echo [ERROR] Git status failed.
goto BACK

:LOGS
set "LOG_SIZE="
set /p "LOG_SIZE=Log Count (default: 5): "
if not defined LOG_SIZE set "LOG_SIZE=5"
setlocal EnableDelayedExpansion
for /f "delims=0123456789" %%A in ("!LOG_SIZE!") do goto INVALID_LOG
if not "!LOG_SIZE:~6!"=="" goto INVALID_LOG
if "!LOG_SIZE:~0,1!"=="0" goto INVALID_LOG
git --no-pager log -!LOG_SIZE! --pretty=format:"%%C(yellow)%%h%%Creset | %%C(green)%%ad%%Creset | %%C(cyan)%%an%%Creset | %%s" --date=format:"%%Y-%%m-%%d %%H:%%M:%%S"
if errorlevel 1 echo [ERROR] Git log failed.
endlocal
echo.
goto BACK

:INVALID_LOG
endlocal
echo [ERROR] Enter a number from 1 to 999999 without leading zeros.
goto BACK

:PULL
echo.
echo Git Pull Start...
git pull
if errorlevel 1 goto PULL_FAILED
echo [OK] Pull completed.
goto BACK

:COMMIT_PUSH
echo.
echo [1/4] Git Pull
git pull
if errorlevel 1 goto PULL_FAILED
echo.
echo [2/4] Git Add
git add .
if errorlevel 1 goto ADD_FAILED
git diff --cached --quiet
if errorlevel 2 goto DIFF_FAILED
if errorlevel 1 goto COMMIT
echo No staged changes. Pushing existing commits.
goto PUSH

:COMMIT
echo.
echo [3/4] Git Commit
git --no-pager log -1
set "MSG="
set /p "MSG=Commit message (default: Update): "
if not defined MSG set "MSG=Update"
setlocal EnableDelayedExpansion
git commit -m "!MSG!"
if errorlevel 1 (
    endlocal
    goto COMMIT_FAILED
)
endlocal

:PUSH
echo.
echo [4/4] Git Push
git push
if errorlevel 1 goto PUSH_FAILED
echo [OK] Push completed.
goto BACK

:PULL_FAILED
echo [ERROR] Pull failed. Resolve the issue before retrying.
goto BACK
:ADD_FAILED
echo [ERROR] Staging failed. Commit and push were not run.
goto BACK
:DIFF_FAILED
echo [ERROR] Could not inspect staged changes.
goto BACK
:COMMIT_FAILED
echo [ERROR] Commit failed. Push was not run.
goto BACK
:PUSH_FAILED
echo [ERROR] Push failed. Local commits are preserved.
goto BACK

:BACK
echo.
pause
goto MENU

:NO_GIT
echo [ERROR] Git is not installed or is not in PATH.
pause
goto EXIT_MENU
:NO_REPO
echo [ERROR] Place this BAT file inside your Git working folder.
pause

:EXIT_MENU
popd
endlocal
exit /b
