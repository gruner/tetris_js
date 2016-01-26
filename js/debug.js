'use strict';

var enabled = false,
    levels = {
        info: 1,
        debug: 2,
        error: 4
    },
    level = levels.debug;

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

    info: function(msg) {
        if (level >= levels.info) {
            this.log(msg);
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