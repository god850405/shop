#!/usr/bin/env sh

set -e

npm run build

cd dist

git config --global user.name "Marcus Chen"

git config --global user.email "god850405@gmail.com"

git init 

git add -A

git commit -m 'deploy'


git push -f https://github.com/god850405/shop.git master:gh-pages

cd -