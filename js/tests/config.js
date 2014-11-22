'use strict';

// load all test cases as dependencies
var tests = [
	require('./models/playfieldTest'),
	require('./models/tetrominoTest'),
	require('./models/tetrominoTypesTest'),
	require('./models/themeTest'),
	require('./themeLoaderTest'),
	require('./gameEngineTest')
];

var $ = require('jquery'),
	bootstrap = require('../juniper/bootstrap'),
	display = require('../juniper/display');

$(document).ready(function() {
	bootstrap.init(tests);
    display.init();
    bootstrap.onLoad(function() {
        bootstrap.run();
    });
});