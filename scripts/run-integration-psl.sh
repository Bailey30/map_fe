# scripts/run-integration.ps1

$DIR = Split-Path -Parent $MyInvocation.MyCommand.Definition
. "$DIR\setenv.ps1"
docker-compose up -d
Write-Output '🟡 - Waiting for database to be ready...'
& "$DIR\wait-for-it.ps1" "$env:DATABASE_URL" -- Write-Output '🟢 - Database is ready!'
npx prisma migrate dev --name init
jest -c .\jest.integration.config.ts --runInBand
Read-Host "Press Enter to exit"
