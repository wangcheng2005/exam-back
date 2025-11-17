#!/bin/sh

content=$1

if [ -z "$content" ]; then
  content="commit"
fi

git add ./
git commit -m $content
git push