const config = require('./local-config.json');

console.log("*** LOADING LOCAL CONFIG ***");

Object.keys(config).forEach((key) => {
    process.env[key] = config[key];
});

// {
//     "BRAINTREE_MERCHANT_ID": "xnn684wrjtmpsc8k",
//     "BRAINTREE_PUBLIC_KEY": "452gbjsh5yx9nvvn",
//     "BRAINTREE_PRIVATE_KEY": "ba2a256f47ad4c73229a0adb50f28bd9",
//     "BRAINTREE_IS_SANDBOX": true,
//     "MONGODB_URI":"mongodb://server:8^Ei6`&(G8dEd9DN@ds050077.mlab.com:50077/nasc-app-dev",
//     "RED5PRO_HOST": "localhost",
//     "RED5PRO_PORT": 5080,
//     "RED5PRO_APP": "live",
//     "SECRET":"govna nisu gotivna",
//     "PORT":"8888"
// }