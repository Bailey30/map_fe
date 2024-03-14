#!/usr/bin/env bash
# # scripts/run-integration.sh

DIR="$(cd "$(dirname "$0")" && pwd)"
source $DIR/setenv.sh
docker-compose up -d 
echo '🟡 - Waiting for database to be ready...'
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'
npx prisma migrate dev --name init
jest -c ./jest.integration.config.ts --runInBand
read -p "Press Enter to exit"




# In order to make these scripts executable, you will need to run the following command which gives your current user access to run them:
# chmod +x scripts/*
#
