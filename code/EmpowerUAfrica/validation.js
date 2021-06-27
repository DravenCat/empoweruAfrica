const config = require("./config")

/*
    This module is responsible for validating user inputs, 
    including email, password, username etc. 
*/


module.exports = {
    /*
        params:
            - username: String, the username to be validated. 
        returns:
            - 0 if the username is valid.
            - errCode: Number o\w, where usernameErrMsg[errCode] gives the corresponding error message.
    */
    validateUsername: (username) => {
        if (username.length > config.username.maxlen || username.length < config.username.minlen) {
            return 1; 
        }
        for (let char of username) {
            if ( !(char >= 'a' && char <= 'z') && !(char >= 'A' && char <= 'Z') && !(char >= '0' && char <= '9') && !(char in config.username.specialChars)) {
                return 2;
            }
        }

        return 0;
    },

    /*
        params:
            - email: String, the email to be validated. 
        returns:
            - 0 if the email is valid.
            - errCode: Number o\w, where emailErrMsg[errCode] gives the corresponding error message.
    */
    validateEmail: (email) => {
        // Email too long or too short
        if (email.length > config.email.maxlen || email.length < config.email.minlen) {
            return 3; 
        }
        // Email not in correct form
        if (!(config.email.regex.test(email))) {
            return 4; 
        }

        return 0; 
    },

    /*
        params:
            - password: String, the password to be validated. 
        returns:
            - 0 if the password is valid.
            - errCode: Number o\w, where passwordErrMsg[errCode] gives the corresponding error message.
    */
    validatePassword: (password) => {
        // Password too long or too short. 
        if (password.length > config.password.maxlen || password.length < config.password.minlen) {
            return 5; 
        }

        return 0; 
    },
    errMsgs : [
        '',
        `Username should be between ${config.username.minlen} and ${config.username.maxlen} characters.`,
        `Username can only contain upper and lower case letters, digits and special symbols ${config.username.specialChars.join(', ')}`,
        `Emails should be between ${config.email.minlen} and ${config.email.maxlen} characters.`,
        'Email not in correct format. Valid email example: example@site.com',
        `Passwords should be between ${config.password.minlen} and ${config.password.maxlen} characters.`
    ]
}