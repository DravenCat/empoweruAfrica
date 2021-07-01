const crypto = require('crypto'); 

let Utils = {
    /*
        obj: object
        fields: Array of String
        if obj has all properties listed in fields, return true, else return false. 
    */
    objHasFields: (obj, fields) => {
        for (let field of fields) {
            if (!(field in obj)) {
                return false; 
            }
        }
        return true; 
    },

    /*
        params: 
            - username: String, the username to be checked.
        returns:
            - true, if the username is valid. 
            - false o\w. 
    */
   isValidUsername: (username) => {
       if (username.indexOf('@') !== -1) {
           return false;
       }
   }, 

   hash: (str) => {
        const sha256 = crypto.createHash('sha256');
        const hash = sha256.update(str).digest('base64');
        return hash;
   },

   getToken: () => {
       return crypto.randomBytes(30).toString('hex');
   },
    
   /*
        Returns number of seconds from 1970-1-1 00:00 until now
   */
   timestamp: () => {
       return Math.round(Date.now() / 1000);
   }


}
module.exports = Utils; 