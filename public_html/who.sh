#!/bin/bash

for i in /home/*; do
  user=$(basename $i)

  if finger $user | grep --quiet 'Never logged in'; then
    echo $user
  fi

done
