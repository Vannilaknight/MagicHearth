var path = require('path');

var utils = require('../utilities/utils');
var rootPath = path.normalize(__dirname + '/../../');

function isEnv(e) {
    return process.env.NODE_ENV === e;
}

function createKey(name) {
    return 'SWINGFACE' + name.toUpperCase();
}

function setEnv(name, defaultValue, override) {
    var key = createKey(name);
    if (override)
        process.env[key] = defaultValue;
    else
        process.env[key] = process.env[key] || defaultValue;
}

function getEnv(name) {
    var key = createKey(name);
    return process.env[key];
}

if(isEnv('dev')){
    setEnv('port', 3030);
} else {
    setEnv('port', 80);
}

setEnv('db', "mongodb://localhost:27017/mtgsets");

var config = {
    self: {
        port: getEnv('port'),
        rootPath: rootPath,
        db: getEnv('db')
    }
};

console.log(utils.inspect(config));
module.exports = config;
