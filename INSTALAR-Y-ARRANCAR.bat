@echo off
echo ================================================================
echo   DAREY Integrador - Instalacion y arranque
echo ================================================================
echo.
echo Instalando dependencias...
cd /d "%~dp0"
npm install --ignore-engines
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR en la instalacion. Intentando con --force...
    npm install --ignore-engines --force
)
echo.
echo Iniciando servidor de desarrollo en http://localhost:3000
echo Presiona Ctrl+C para detener.
echo.
npm run dev
pause
