#!/usr/bin/env bash
# scripts/setenv.sh

# Export env vars
export $(grep -v '^#' .env.test | xargs)
echo setenv
echo "Variables after grep:" $(grep -v '^#' .env.test)
