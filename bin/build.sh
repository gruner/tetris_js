#!/bin/bash

rm -rf dist

mkdir -p dist/js

browserify js/main.js -o dist/js/tetris.js
uglifyjs dist/js/tetris.js -o dist/js/tetris.min.js

cp tetris.html dist/tetris.html