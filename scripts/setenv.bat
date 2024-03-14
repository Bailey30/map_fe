REM scripts/setenv.bat

REM Parse and export environment variables from .env.test file
for /f "tokens=*" %%i in ('findstr /V "^#" .env.test') do set "%%i"
