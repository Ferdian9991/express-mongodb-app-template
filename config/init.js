const options = require('../config/options');

class Init {
    index() {
        return {
            appName: options.appName,
            appVersion: options.appVersion,
            appService: options.service
        }
    }
};

module.exports = new Init();;
