const init = require('./db-init'); 
const config = require('./config');
const { username } = require('./config');

let MySQLConnection;
let Neo4jDriver; 

let mySQLProfileFields; 

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

    let res = await MySQLConnection.execute('SHOW columns FROM `Profile`');
    mySQLProfileFields = res[0].map(row => row.Field); 
    
    setInterval(removeExpiredTokens, 60 * 1000 * config.tokens.cleanExpiredTokenInterval); 
})();

const db = {
/*=======================These method are for MySQL=========================== */
    /*
        params:
            - username: String
            - email: String
            - password: String
            - type: int
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
        Check if the password that user input is right
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
        Return the username with the given email
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
        Update user’s email/password with the new one
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
        Create a new row for a new user in Token database
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
        Delete user’s token in the database
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
            - username: String, the username corresponding to the token. 
            - null if the token is not found in the database, or has expired. 
        Return the username with the given token
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
            - nothing
        Create a new row for a new user in Profile database
     */
    addUserProfile: async (username) => {
        let sql = "INSERT INTO Profile(username, name) VALUES(?, ?);";
        console.log(sql);
        let data = [username, username];
        await MySQLConnection.execute(sql, data);
    },

    /*
        params:
            - username: String
            - updates: Object, keys are fields to be updated, values are the new value for the said field
        returns:
            - nothing
        Update user’s profile in the Profile database
    */
    updateProfile: async(username, updates) =>{
        let keys = Object.keys(updates);
        // Remove all keys that are not column names of the Profile table. 
        for (const key of keys) {
            if (mySQLProfileFields.indexOf(key) === -1) {
                delete updates[key];
                keys.pop(keys.indexOf(key));
            }
        }
        let sql = `UPDATE Profile SET ${keys.map(key => key + '=?').join(', ')} 
                    WHERE username=?`;
        let data = keys.map(key => updates[key]);
        console.log(sql);
        console.log(keys);
        console.log(data);
        data.push(username); 

        await MySQLConnection.execute(sql, data); 
    },

    /*
        params:
            - username: String
        return:
            - An object. Keys are each field. Values are the data in the database.
        Return a JavaScript Object where each field contains user’s profile info in the database
     */
    getProfileByUsername: async (username) => {
        let profile;
        let sql = `SELECT *
                   FROM Profile 
                   WHERE username=?`;
        let data = [username];
        let response = await MySQLConnection.execute(sql, data);
        if (response[0].length === 0) {
            return null;
        }

        profile = {
            name: response[0][0].name,
            gender: response[0][0].gender,
            birthdate: response[0][0].birthdate,
            phone_number: response[0][0].phone_number,
            industry: response[0][0].industry,
            pfp_type: response[0][0].pfp_type,
            description: response[0][0].description,
            website: response[0][0].website
        }
        return profile;
    },

    /*
        params:
            - username: String
        returns:
            - A string indicating user's type
        Return the type of the user
     */
    getUserType: async (username) => {
        let sql = "SELECT type FROM Accounts WHERE username=?";
        let data = [username];
        let response = await MySQLConnection.execute(sql, data);
        if (response[0].length === 0) {
            return null;
        }
        return response[0][0].type; 
    },

    /*
        params:
            - username: String
        returns:
            - null if the username specified does not exist
            - {
                email: the user's email,
                type: (int) the user's type
            }
        Return the type and email of the user
    */
    getUserAbstract: async (username) => {
        let sql = "SELECT type, email FROM Accounts WHERE username=?"; 
        let data = [username]; 
        let response = await MySQLConnection.execute(sql, data);
        if (response[0].length === 0) {
            return null;
        }
        return {email: response[0][0].email, type: response[0][0].type};
    },

    /*====================================================================================*/
    /*These methods are for Neo4j database*/
    /*
        params:
            - username: String 
        returns:
            nothing
        Create a user node in the database
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
            - title: String, the title of the post
            - postId: the unique postId of the post
            - time: the time that user makes the post
        returns:
            nothing
        Create a postNode with given data and create ‘CREATE_POST’ relationship between user and post
    */
    makePost: async (username, content, title, postId, time) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}) 
                    CREATE (u)-[:CREATE_POST]->(p:post {Title: $title, Content: $content, Time: $time, PostId: $postId}) `;
        let params = {"username":username, "content": content, "title": title, "time": time, "postId": postId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - postId: the postId of the post that user reply to
        returns:
            nothing
        Delete the post node and any relationship with this post node
    */
    deletePost: async (postId) => {
        let session = Neo4jDriver.wrappedSession();

        let query = `MATCH 
                        (r:reply)-[:REPLY_TO*0..]->(p:post {PostId: $postId})
                    DETACH DELETE r, p`;

        let params = {"postId": postId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - title: String, part of the string of the title
        returns:
            A set of objects where each object contains all the info of a post
        Return a set of objects where each object contains postId, content, title and time
    */
    searchPostByTitle: async (title) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (p:post) 
                     WHERE p.Title =~'.*$title.*'  
                     RETURN p`;
        let params = {"title": title};
        let result;
        let postSet = [];
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let post = records[i].get(0);
                postSet.push({
                    postId: post.properties.PostId,
                    title: post.properties.Title,
                    time: post.properties.Time,
                    content: post.properties.Content
                })
            }
        } catch (err) {
            console.error(err);
        }
        session.close();
        return postSet;
    },

    /*
        params: 
            - Id: Part of the target postId
        returns:
            A set of objects where each object contains all the info of a post
        Return a set of objects where each object contains postId, content, title and time
    */
    searchPostById: async (postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (p:post) 
                     WHERE p.PostId =~'.*$postId.*' 
                     RETURN p`;
        let params = {"postId": postId};
        let result;
        let postSet = [];
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let post = records[i].get(0);
                postSet.push({
                    postId: post.properties.PostId,
                    title: post.properties.Title,
                    time: post.properties.Time,
                    content: post.properties.Content
                })
            }
        } catch (err) {
            console.error(err);
        }
        session.close();
        return postSet;
    },

    /*
        params: 
            - username: String
        returns:
            A set of objects where each object contains all the info of a post
        Return a set of objects where each object contains postId, content, title and time. 
        Each object will be the post that user created
    */
    searchPostByUser: async (username) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})  
                           (u)-[:CREATE_POST]->(p:post)  
                     RETURN p`;
        let params = {"username": username};
        let result;
        let postSet = [];
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let post = records[i].get(0);
                postSet.push({
                    postId: post.properties.PostId,
                    title: post.properties.Title,
                    time: post.properties.Time,
                    content: post.properties.Content
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return postSet;
    },

    /*
        params: 
            - pageNum: Int
            - postPerPage: Int
        returns:
            A set of objects in time-descending order where each object contains all the info of a post
        Return a set of objects where each object contains postId, content, title
        and time sorted by time, and returns posts numbers
    */
    getPost: async(pageNum, postPerPage) => {
        let skipNum = pageNum * postPerPage;
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (p:post)  
                     RETURN p 
                     ORDER BY p.Time DESC 
                     SKIP $skipNum 
                     LIMIT $postPerPage`;
        let params = {"skipNum": skipNum, "postPerPage": postPerPage};
        let result;
        let postSet = [];
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let post = records[i].get(0);
                postSet.push({
                    postId: post.properties.PostId,
                    title: post.properties.Title,
                    time: post.properties.Time,
                    content: post.properties.Content
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return postSet;
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
        Create a reply node, ‘CREATE_REPLY’ relation between user and the reply 
        and ‘REPLY_TO’ relation between the post/reply and the reply
    */
    makeReply: async (username, content, replyId, targetId, time, type) => {
        let session = Neo4jDriver.wrappedSession();
        let query;
        let params;
        if (type === "post") {
            query = `MATCH (u:user {UserName: $username}), (p:post {PostId: $targetId}) 
                    CREATE (u)-[:CREATE_REPLY]->(r:reply {Content: $content, Time: $time, ReplyId: $replyId})
                    CREATE (r)-[:REPLY_TO]->(p)`;
            params = {"username": username, "targetId": targetId, "content": content, "time": time, "replyId": replyId};
        }else if (type === "reply") {
            query = `MATCH (u:user {UserName: $username}), (rp:reply {ReplyId: $targetId})
                    CREATE (u)-[:CREATE_REPLY]->(r:reply {Content: $content, Time: $time, ReplyId: $replyId}) 
                    CREATE (r)-[:REPLY_TO]->(rp)`;
            params = {"username": username, "targetId": targetId, "content": content, "time": time, "replyId": replyId};
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
            - replyId: the unique Id of the reply
        returns:
            nothing
        Delete the reply, ‘CREATE_REPLY’ and any ‘REPLY_TO’ relation with this reply
    */
    deleteReply: async (replyId) => {
        let session = Neo4jDriver.wrappedSession();

        let query = `MATCH 
                        (r:reply {ReplyId: $replyId})
                    SET r: DELETED`;
        let params = {replyId};

        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /*
        params: 
            - postId: The id of the original post
        returns:
            A set of objectswhere each object contains all the info of a reply
        Return a set of objects that are comments of the original post where each 
        object contains postId, title and time sorted by time
    */
    getComments: async(postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (r:reply)-[:REPLY_TO*0..]->(p:post {PostId: $postId}) 
                     RETURN r`;
        let params = {"postId": postId};
        let result;
        let replySet = [];
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let reply = records[i].get(0);
                replySet.push({
                    replyId: reply.properties.ReplyId,
                    time: reply.properties.Time,
                    content: reply.properties.Content
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return replySet;
    },

    /*
        params: 
            - username: String
            - tagName: String
        returns:
            nothing
        Create a tag and the ‘HAS_TAG’ relationship between the user and tag. 
        If the tag exists in the database (has the same tagName), then only the 
        “HAS_TAG” relationship will be created.
    */
    addTag: async (username, tagName) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}) 
                     MERGE (u)-[:TAGGED]->(t:tag {TagName: $tagName})`;
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
        Delete the relationship between the user and the tag, and the tag node if 
        there are no relationships involving the tag
    */
    deleteTag: async (username, tagName) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})-[ht:TAGGED]->(t:tag {TagName: $tagName}) 
                     DELETE ht 
                     WITH t 
                     WHERE size(()-[:TAGGED]->(t)) = 0 
                     DELETE t`;
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
        returns:
            nothing
        Gets all the tags that a user has.
    */
    getTags: async (username) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})-[:TAGGED]->(t:tag) 
                     RETURN t.TagName AS tagName`;
        let params = {"username": username};
        let result;
        let tagSet = [];
        try {
            result = await session.run(query, params);
            result.records.forEach(record => tagSet.push(record.get("tagName")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        return tagSet;
    },

    /*
        params: 
            - username: String
            - tagName: String
        returns:
            nothing
        Checks if the user has the given tag
    */
    userHasTag: async (username, tagName) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})-[ht:TAGGED]->(t:tag {TagName: $tagName}) 
                     RETURN count(ht)`;
        let params = {"username": username, "tagName": tagName};
        let result;
        try {
            result = await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
        return result.records[0].get(0) != 0;
    },

    /*
        params: 
            - username: String
            - postId: String, the postId of the post that user wants to follow
        returns:
            nothing
        Create ‘FOLLOW’ relationship between the user and the post
    */
    followPost: async (username, postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}), 
                           (p:post {PostId: $postId}) 
                    CREATE (u)-[:FOLLOW]->(p)`;
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
            - postId: String, the postId of the post that user wants to follow
        returns:
            nothing
        Delete ‘FOLLOW’ relationship between the user and the post
    */
    unfollowPost: async (username, postId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})-[f:FOLLOW]->(p:post {PostId: $postId}) 
                    DELETE f`;
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
        Return a set of postId where each post is followed by the user
    */
    getFollowedPostByUser: async (username) => {
        var postIdSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}), 
                           "(u)-[:FOLLOW]->(p:post) 
                     RETURN p.PostId AS postId`;
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
        Return a set of username where each user is following this post
    */
    getFollowingUserByPost: async (postId) => {
        var usernameSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (p:post {PostId: $postId}), 
                           (u:user)-[:FOLLOW]->(p) 
                     RETURN u.UserName AS userName`;
        let params = {"postId": postId};
        let result;
        try {
            result = await session.run(query, params).then();
            result.records.forEach(record => postIdSet.push(record.get("userName")));
        } catch (err) {
            console.error(err);
        }
        session.close();
        return usernameSet;       
    },
    /*
        params:
            id: String, the id of the post / reply
            contentType: String, post | reply
        return:
            the author's username
        Return the username of the author that makes the reply/post
    */
    getAuthorOfContent: async (id, contentType) => {
        const session = Neo4jDriver.wrappedSession(); 

        let query;
        let params = {id};  
        if (contentType === 'post') {
            query = `MATCH 
                        (p:post {PostId: $id}), 
                        (u:user)-[:CREATE_POST]->(p)
                    RETURN 
                        u.UserName AS username`;
        }
        else if (contentType === 'reply') {
            query = `MATCH 
                        (r:reply {ReplyId: $id}), 
                        (u:user)-[:CREATE_REPLY]->(r)
                    RETURN 
                        u.UserName AS username`;
        }
        else {
            return null; 
        }

        let result; 
        try {
            result = await session.run(query, params).then();
        } catch (err) {
            console.error(err);
        }
        
        if (result.records.length === 0) {
            return null;
        }
        const author = result.records[0].get('username');
        session.close();
        return author; 
    }
}; 

module.exports = db; 