/*
    This file contains all the configuration constants that 
    might be referenced in multiple modules throughout the website. 
*/

module.exports = {
    tokens: {
        tokenExpirationTime : "48 HOUR",    // In the form '<amount> [MINUTE or HOUR or DAY]'
        cleanExpiredTokenInterval: 60       // In minutes
    },
    username: {
        minlen: 3,
        maxlen: 31,
        specialChars: ['-', '_', '@', '#']
    },
    email: {
        minlen: 0, 
        maxlen: 255, 
        regex: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    password: {
        minlen: 6,
        maxlen: 255
    }
}