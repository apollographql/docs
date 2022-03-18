#!/bin/bash

if [ $1 ]
then
  npx cpx "$1/docs/**/*" local --clean --watch &
  DOCS_LOCAL=true npx netlify dev
else
  npx netlify dev
fi
