define(function() {

    var loggingOn = false;

    function toggleLogging(on) {
        if (consoleAvailable()) {
            loggingOn = (typeof on === 'undefined') ? !loggingOn : !!on;
        }
    }

    function consoleAvailable() {
        return (typeof console !== 'undefined') && (typeof console.log === 'function');
    }

    return {
        log: function(msg) {
            if (loggingOn && typeof console !== 'undefined') {
                console.log(msg);
            }
        },

        enableLogging: function() {
            toggleLogging(true);
        },

        disableLogging: function() {
            toggleLogging(false);
        },
        
        profile: function(name, callback) {
            console.time(name);
            callback();
            console.timeEnd(name);
        }
    };
});