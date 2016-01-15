'use strict';

var debug = require('../debug');

var Validate = function() {};

/**
 * Checks that the given object has proper x and y values
 */
Validate.coordinates = function(coordinates) {
    var valid = (coordinates.hasOwnProperty('x') 
        && coordinates.hasOwnProperty('y')
        && Number.isInteger(coordinates.x)
        && Number.isInteger(coordinates.y)
    );

    if (!valid) {
        debug.log('Invalid coordinates:');
        debug.log(coordinates);
    }

    return valid;
};

module.exports = Validate;