const config = require('./local-config.json');

console.log("*** LOADING LOCAL CONFIG ***");

Object.keys(config).forEach((key) => {
    process.env[key] = config[key];
});