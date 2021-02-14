#!/bin/bash

npm run concurrently "cd client && ng serve" "npm run concurrently 'tsc -w' 'npm run nodemon ./dist/server'"
