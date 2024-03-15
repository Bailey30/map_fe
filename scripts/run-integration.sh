#!/usr/bin/env bash
# The shebang line specifies the interpreter to execute this script, which is bash.

# scripts/run-integration.sh

# DIR variable stores the absolute path of the directory containing this script.
DIR="$(cd "$(dirname "$0")" && pwd)"

# Source (execute) the setenv.sh script to load environment variables.
# from .env.test
source $DIR/setenv.sh

# Start the Docker containers defined in docker-compose.yml file in detached mode.
docker-compose up -d

# Print a message indicating that the script is waiting for the database to be ready.
echo '🟡 - Waiting for database to be ready...'

# Execute the wait-for-it.sh script to wait for the database to be ready.
# The script will print a message indicating that the database is ready once it is.
$DIR/wait-for-it.sh "${DATABASE_URL}" -- echo '🟢 - Database is ready!'

# Run Prisma migration with the 'dev' environment and the migration name as 'init'.
npx prisma migrate dev --name init

# Run Jest tests with the configuration provided in jest.integration.config.ts file.
# '--runInBand' flag runs all tests serially in the current process.
node --experimental-vm-modules node_modules/jest/bin/jest.js -c ./jest.integration.config.ts --runInBand

# Prompt the user to press Enter to exit the script.
read -p "Press Enter to exit"




# In order to make these scripts executable, you will need to run the following command which gives your current user access to run them:
# chmod +x scripts/*
#
