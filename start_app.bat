@echo off
echo Starting German Tutor App...
echo.
echo Please wait while the local server starts.
echo The app should open in your default browser shortly.
echo.
echo Press Ctrl+C to stop the server when you are done.
echo.

cd /d "%~dp0"
call npx -y serve -s dist -l 3000

pause
