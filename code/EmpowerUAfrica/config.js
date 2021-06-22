/*
    This file contains all the configuration constants that 
    might be referenced in multiple modules throughout the website. 
*/

module.exports = {
    tokens: {
        tokenExpirationTime : "48 HOUR",    // In the form '<amount> [MINUTE or HOUR or DAY]'
        cleanExpiredTokenInterval: 60       // In minutes
    }
}