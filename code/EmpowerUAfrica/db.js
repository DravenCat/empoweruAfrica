const init = require('./db-init'); 
const config = require('./config');

let MySQLConnection;
let Neo4jDriver; 

/*
    When executed, removes all rows in Tokens table that are expired. 
*/
const removeExpiredTokens = async () => {
    await MySQLConnection.execute("DELETE FROM Tokens WHERE expiration_time < NOW(); "); 
}

(async () => {
    let connections = await init(); 
    MySQLConnection = connections.MySQL; 
    Neo4jDriver = connections.Neo4j; 

    setInterval(removeExpiredTokens, 60 * 1000 * config.tokens.cleanExpiredTokenInterval); 
})();

const db = {

    /*
        params:
            - username: String
            - email: String
            - password: String
            - type: int
            - firstname: String
            - lastname: String (optional, counld be undefined, if so don't put it into the table.)
        returns:
            nothing
        
        Creates a new account eneity in the account table.
    */
    createNewAccount: async (username, email, password, type) => {
        let sql = 'INSERT INTO Accounts(username, email, password, type)\
        VALUES(?, ?, ?, ?);'; 
        let data = [username, email, password, type]; 
        await MySQLConnection.execute(sql, data); 
    }, 

    /*
        params:
            - idtype: "username" or "email", indicates the type of id.
            - id: String, could be an email or a username, depends on idtype. 
            - password: String
        
        returns:
            - true, if the credentials match
            - false o\w
            - null, if the username does not exist
    */
    credentialsMatch: async (idtype, id, password) => {
        let sql = `SELECT password FROM Accounts WHERE ${idtype} = ?`; 
        let data = [id]; 
        let response = await MySQLConnection.execute(sql, data);

        if (response[0].length === 0) {
            return null;
        }
        let actualPasswd = response[0][0].password; 
        return actualPasswd === password; 
    },

    /*
        params:
            - email: String, the email to be searched for
        returns:
            - the username of user with email = email, if the user is found
            - null o\w 
    */
    usernameForEmail: async (email) => {
	    let sql = 'SELECT username FROM Accounts WHERE email = ?';
        let data = [email];
        let response = await MySQLConnection.execute(sql, data);

        if (response[0].length === 0) {
            return null;
        }
        else {
            return response[0][0].username; 
        }
    }, 

    /*
        params:
            - type: String, either 'email' or 'password'
            - username: String, the user who requested the update
            - newCredential: String, the new email or password, depending on type
        returns:
            nothing
    */
    updateCredentials: async (type, username, newCredential) => {
        let sql = `UPDATE Accounts SET ${type} = ? WHERE username = ?`; 
        let data = [newCredential, username];
        await MySQLConnection.execute(sql, data);
   },
   /*
        params:
            - token: String, the user's token 
            - username: String
            - expirationTime: Number, int
        returns:
            nothing
   */
    addToken: async (token, username) => {
        let sql = `INSERT INTO Tokens(token, username, expiration_time) \
        VALUES(?, ?, NOW() + INTERVAL ${config.tokens.tokenExpirationTime});`;
        console.log(sql);
        let data = [token, username]; 
        await MySQLConnection.execute(sql, data);
    }, 
   
    /*
        params: 
            - token: String, the token to be deleted. 
        returns:
            nothing
    */
    delToken: async (token) => {
        let sql = 'DELETE FROM Tokens WHERE token=?'; 
        let data = [token]; 
        await MySQLConnection.execute(sql, data);
    }, 

    /*
        params:
            - token: String, the token to be queried. 
        returns:
            - username: String, the username to corresponding to the token. 
            - null if the token is not found in the database, or has expired. 
    */
    getUsernameByToken: async (token) => {
        let sql = 'SELECT username FROM Tokens WHERE token = ? AND expiration_time > NOW()';
        let data = [token]; 
        let response = await MySQLConnection.execute(sql, data); 
        if (response[0].length === 0) {
            return null;
        }
        return response[0][0].username; 
    }, 

    /*
        params:
            - username: String 
        returns:
            nothing
    */
    createUser: async (username) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "CREATE (u:user {UserName: $username})";
        let params = {"username": username};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
            - content: String, the content of the post
            - postId: the unique postId of the post
            - time: the time that user makes the post
        returns:
            nothing
    */
    makePost: async (username, content, postId, time) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}) "
                   "CREATE (u)-[m:MAKE]->(p:post {Content: $content, Time: $time, PostId: $postId}) ";
        let params = {"username":username, "content": content, "time": time, "postId": postId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
            - time: the time that user makes the reply
            - postId: the postId of the post that user reply to
        returns:
            nothing
        (warning: deletePost will not delete any reply to this post. If more methods are needed, please contact the developer)
    */
    deletePost: async (username, postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}), "
                          "(u)-[m:MAKE]->(p:post {PostId: $postId}), "
                          "(:reply)-[rp:REPLY]->(p) " 
                    "DELETE rp, m, p";
        let params = {"username": username, "postId": postId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
            - content: String, the content of the Reply
            - replyId: the unique id of the reply
            - targetId: the Id of the target that user reply to
            - time: the time that user makes the reply
            - type: the type of the target (should be "post" or "reply")
        returns:
            nothing
    */
    makeReply: async (username, content, replyId, targetId, time, type) => {
        let session = Neo4jDriver.wrappedSession();
        let query;
        let params;
        if (type === "post") {
            query = "MATCH (u:user {UserName: $username}), (p:post {PostId: $postId}) "
                    "CREATE (u)-[:MAKE]->(r:reply {Content: $content, Time: $time, ReplyId: $replyId}) "
                    "CREATE (r)-[:REPLY]->(p)";
            params = {"username": username, "postId": targetId, "content": content, "time": time, "replyId": replyId};
        }else if (type === "reply") {
            query = "MATCH (u:user {UserName: $username}), (rp:reply {ReplyId: $replyId}) "
                    "CREATE (u)-[:MAKE]->(r:reply {Content: $content, Time: $time, ReplyId: $replyId}) "
                    "CREATE (r)-[:REPLY]->(rp)";
            params = {"username": username, "replyId": targetId, "content": content, "time": time, "replyId": replyId};
        }
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },   

    /*
        params: 
            - username: String
            - replyId: the unique Id of the reply
        returns:
            nothing
    */
    deleteReply: async (username, replyId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}), "
                          "(u)-[m:MAKE]->(r:reply {ReplyId: $replyId}), "
                          "(r)-[rp:REPLY]->() "
                    "DELETE m, rp, r";
        let params = {"username": username, "replyId": replyId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
            - tagName: String
        returns:
            nothing
    */
    addTag: async (username, tagName) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}) "
                    "CREATE (u)-[:HAS_TAG]->(t:tag {TagName: $tagName})";
        let params = {"username": username, "tagName": tagName};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
            - tagName: String
        returns:
            nothing
    */
    deleteTag: async (username, tagName) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}), "
                          "(t:tag {TagName: $tagName}), "
                          "(u)-[ht:HAS_TAG]->(t) "
                    "DELETE ht, t";
        let params = {"username": username, "tagName": tagName};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
            session.close();
    },

    /*
        params: 
            - username: String
            - postId: String, the postId of the post that user wants to follow
        returns:
            nothing
    */
    followPost: async (username, postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}), "
                           "(p:post {PostId: $postId}) "
                    "CREATE (u)-[:FOLLOW]->(p)";
        let params = {"username": username, "postId": postId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /*
        params: 
            - username: String
        returns:
            A set of postId that user follows
            Empty if user follows nothing
    */
    getFollowedPostByUser: async (username) => {
        var postIdSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (u:user {UserName: $username}), "
                           "(u)-[:FOLLOW]->(p:post)"
                    "RETURN p.PostId AS postId";
        let params = {"username": username};
        let result;
        try {
            result = await session.run(query, params).then();
            result.records.forEach(record => postIdSet.push(record.get("postId")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        return postIdSet;
    },

    /*
        params: 
            - postId: String
        returns:
            A set of users that follow this post
            Empty if the post is not followed by any user
    */
    getFollowingUserByPost: async (postId) => {
        var usernameSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = "MATCH (p:post {PostId: $postId}), "
                           "(u:user)-[:FOLLOW]->(p)"
                    "RETURN u.UserName AS userName";
        let params = {"postId": postId};
        let result;
        try {
            result = await session.run(query, params).then();
            result.records.forEach(record => postIdSet.push(record.get("userName")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        return usernameSet;       
    }
        
}; 

process.on('exit', () => {
    MySQLConnection.end(); 
    Neo4jDriver.close(); 
}); 
module.exports = db; 