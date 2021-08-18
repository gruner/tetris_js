const levels = {
    info: 1,
    debug: 2,
    error: 4
};

let enabled = false;
let level = levels.debug;

function toggle(on: boolean) {
    if (consoleAvailable()) {
        enabled = (typeof on === 'undefined') ? !enabled : !!on;
    }
}

function consoleAvailable(): boolean {
    return (typeof console !== 'undefined') && (typeof console.log === 'function');
}

export const Debug = {
    log: function(msg: string) {
        if (enabled && typeof console !== 'undefined') {
            console.log(msg);
        }
    },

    info: function(msg: string) {
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
    
    profile: function(name: string, callback: Function) {
        console.time(name);
        callback();
        console.timeEnd(name);
    }
};