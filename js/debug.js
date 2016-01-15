'use strict';

var enabled = false;

function toggle(on) {
    if (consoleAvailable()) {
        enabled = (typeof on === 'undefined') ? !enabled : !!on;
    }
}

function consoleAvailable() {
    return (typeof console !== 'undefined') && (typeof console.log === 'function');
}

module.exports = {
    log: function(msg) {
        if (enabled && typeof console !== 'undefined') {
            console.log(msg);
        }
    },

    enable: function() {
        toggle(true);
    },

    disable: function() {
        toggle(false);
    },

    enabled: function() {
        return enabled === true;
    },
    
    profile: function(name, callback) {
        console.time(name);
        callback();
        console.timeEnd(name);
    }
};