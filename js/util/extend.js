'use strict';

function deepObjectExtend(parent, child) {

    // TODO: recurse for more than two arguments
    // if (arguments.length > 2) {
    //     for (var i = 0; i < arguments.length; i++) {
    //         //
    //     };
    // }

    for (var prop in child) {
        if (parent.hasOwnProperty(prop) && parent[prop] instanceof Object) {
            parent[prop] = deepObjectExtend(parent[prop], child[prop]);
        } else {
            parent[prop] = child[prop];
        }
    }

    return parent;
}

module.exports = {
    deepExtend: deepObjectExtend
};