#!/usr/bin/env bash
# scripts/setenv.sh

# Export env vars
export $(grep -v '^#' .env.test | xargs)
echo "Getting env vars from .env.test"
echo "Variables after grep:" $(grep -v '^#' .env.test)
