#!/bin/bash

# set the directory to search
directory=./img/sso

# loop through all files in the directory
for file in "$directory"/*; do
  # check if the file is a regular file
  if [[ -f "$file" ]]; then
    # perform a git grep for the file name
    if ! git grep --quiet "$(basename "$file")"; then
      # output the file name if there were zero results
      echo "$file"
    fi
  fi
done
