const neo4j = require('neo4j-driver'); 

const init = require('./db-init'); 
const config = require('./config');

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
    /**
     * Create a new row for a new user in Accounts database
     * @param {*} username String
     * @param {*} email String 
     * @param {*} password String
     * @param {*} type String
     */
    createNewAccount: async (username, email, password, type) => {
        let sql = 'INSERT INTO Accounts(username, email, password, type)\
        VALUES(?, ?, ?, ?);'; 
        let data = [username, email, password, type]; 
        await MySQLConnection.execute(sql, data); 
    }, 


    /**
     * Check if the password that user input is right
     * @param {*} idtype "username" or "email", indicates the type of id.
     * @param {*} id String, could be an email or a username, depends on idtype. 
     * @param {*} password String
     * @returns True, if the credentials match.
     *          False o\w.
     *          Null, if the username does not exist
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

    /**
     * Return the username with the given email
     * @param {*} email String, the email to be searched for
     * @returns the username of user with email = email, if the user is found. 
                Null o\w 
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

    /**
     * Update user’s email/password with the new one
     * @param {*} type String, either 'email' or 'password'
     * @param {*} username String, the user who requested the update
     * @param {*} newCredential String, the new email or password, depending on type
     */
    updateCredentials: async (type, username, newCredential) => {
        let sql = `UPDATE Accounts SET ${type} = ? WHERE username = ?`; 
        let data = [newCredential, username];
        await MySQLConnection.execute(sql, data);
    },

    /**
     * Create a new row for a new user in Token database
     * @param {*} token String, the user's token 
     * @param {*} username String
     */
    addToken: async (token, username) => {
        let sql = `INSERT INTO Tokens(token, username, expiration_time) \
        VALUES(?, ?, NOW() + INTERVAL ${config.tokens.tokenExpirationTime});`;
        let data = [token, username]; 
        await MySQLConnection.execute(sql, data);
    }, 
   
    /**
     * Delete user’s token in the database
     * @param {*} token String, the token to be deleted. 
     */
    delToken: async (token) => {
        let sql = 'DELETE FROM Tokens WHERE token=?'; 
        let data = [token]; 
        await MySQLConnection.execute(sql, data);
    }, 

    /**
     * Return the username with the given token
     * @param {*} token String, the token to be queried. 
     * @returns the username corresponding to the token. 
                Null if the token is not found in the database, or has expired.
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

    /**
     * Create a new row for a new user in Profile database
     * @param {*} username String 
     */
    addUserProfile: async (username) => {
        let sql = "INSERT INTO Profile(username, name) VALUES(?, ?);";
        let data = [username, username];
        await MySQLConnection.execute(sql, data);
    },

    /**
     * Update user’s profile in the Profile database
     * @param {*} username String
     * @param {*} updates Object, keys are fields to be updated, values are the new value for the said field
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
        data.push(username); 

        await MySQLConnection.execute(sql, data); 
    },

    /**
     * Return a JavaScript Object where each field contains user’s profile info in the database
     * @param {*} username String
     * @returns An object. Keys are each field. Values are the data in the database.
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

    /**
     * Return the type of the user
     * @param {*} username String
     * @returns A string indicating user's type
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

   /**
    * Return the type and email of the user
    * @param {*} username String
    * @returns null if the username specified does not exist.
            O/w, {
                email: the user's email,
                type: (int) the user's type
            }
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

    getUsersAbstract: async (users) => {
        let paramTemplate = [];
        for (let i = 0; i < users.length; i++) {
            paramTemplate.push('?');
        }
        paramTemplate = paramTemplate.join(', '); 
        let sql = `
            SELECT Accounts.username, Accounts.type, Profile.name, Profile.description
                ,Profile.pfp_type
            FROM Accounts
            JOIN Profile ON Accounts.username = Profile.username
            WHERE Accounts.username IN (${paramTemplate})
            GROUP BY Accounts.username`;

        let response = await MySQLConnection.execute(sql, users); 
        if (response[0].length === 0) {
            return null;
        }
        let userAbstracts = {};
        for (const user of response[0]) {
            userAbstracts[user.username] = user;
            if (user.description === null) {
                user.description = ''; 
            }
            if (user.description.length >= 50) {
                user.description = user.description.slice(0, 50) + '...';
            }
        }
        return userAbstracts; 
    
    }, 

    /*====================================================================================*/
    /*These methods are for Neo4j database*/
    /**
     * Create a user node in the database
     * @param {*} username String 
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

    /**
     * Create a postNode with given data and create ‘CREATE_POST’ relationship between user and post
     * @param {*} username String
     * @param {*} content String, the content of the post
     * @param {*} title String, the title of the post
     * @param {*} id the unique id of the post
     * @param {*} time the time that user makes the post
     */
    makePost: async (username, content, title, id, time) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}) 
                    CREATE (u)-[:CREATE_POST]->(p:post {Title: $title, Content: $content, Time: $time, id: $id}) `;
        let params = {"username":username, "content": content, "title": title, "time": time, "id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /**
     * Delete the post node and any relationship with this post node
     * @param {*} id id: the id of the post that user reply to
     */
    deletePost: async (id) => {
        let session = Neo4jDriver.wrappedSession();

        let query = `MATCH (p: post {id: $id})
                    OPTIONAL MATCH (r:reply)-[:REPLY_TO*0..]->(p)
                    DETACH DELETE r, p`;

        let params = {"id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /**
     * Return a set of objects where each object contains id, content, title and time
     * @param {*} title String, part of the string of the title
     * @returns A set of objects where each object contains all the info of a post
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
                    id: post.properties.id,
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

    /**
     * Return a set of objects where each object contains id, content, title and time
     * @param {*} id Part of the target id
     * @returns A set of objects where each object contains all the info of a post
     */
    searchPostById: async (id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH 
                        (p:post), 
                        (author:user)-[:CREATE_POST]->(p)
                     WHERE p.id = $id 
                     RETURN p, author.UserName AS author`;
        let params = {id};
        let result, postContent;
        try {
            result = await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        if (result.records.length === 0) {
            return null; 
        }
        postContent = result.records[0].get('p').properties; 
        postContent.author = result.records[0].get('author'); 
        session.close();
        return postContent;
    },

    /**
     * Return a set of objects where each object contains id, content, title and time. 
     * Each object will be the post that user created
     * @param {*} username String
     * @returns A set of objects where each object contains all the info of a post
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
                    id: post.properties.id,
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

  /**
     * Return the username of the author that makes the reply/post
     * @param {*} id String, the id of the post / reply
     * @param {*} contentType String, post | reply
     * @returns the author's username
     */
    getAuthorOfContent: async (id, contentType) => {
        const session = Neo4jDriver.wrappedSession(); 

        let query;
        let params = {id};  
        if (contentType === 'post') {
            query = `MATCH 
                        (p:post {id: $id}), 
                        (u:user)-[:CREATE_POST]->(p)
                    RETURN 
                        u.UserName AS username`;
        }
        else if (contentType === 'reply') {
            query = `MATCH 
                        (r:reply {id: $id}), 
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

    },
    getPostCount: async(criteria) => {
        const session = Neo4jDriver.wrappedSession(); 
        // TODO: make the query suitable for applying different criteria. 
        let query = `MATCH (p:post) RETURN count(p) AS post_count`; 
        const result = await session.run(query); 
        let post_count = result.records[0].get('post_count').low; 
        session.close();
        return post_count;
    }
    ,
    /**
     * Return a set of objects where each object contains id, content, title
     * and time sorted by time, and returns posts numbers
     * @param {*} pageNum Int
     * @param {*} postPerPage Int
     * @returns A set of objects in time-descending order where each object contains all the info of a post
     */
    getPosts: async(pageNum, postPerPage, criteria) => {

        let skipNum = pageNum * postPerPage;
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH 
                        (p:post),
                        (author:user)-[:CREATE_POST]->(p)
                     OPTIONAL MATCH
                        (r:reply)-[:REPLY_TO*1..]->(p)
                     RETURN p, author.UserName AS author, count(r) AS comment_count
                     ORDER BY p.Time DESC 
                     SKIP $skipNum 
                     LIMIT $postPerPage`;
        let params = {"skipNum": neo4j.int(skipNum), "postPerPage": neo4j.int(postPerPage)};
        let result;
        let postSet = [];
        let posts = {
            post_count: 0, 
            posts: []
        }
        try {
            [result, posts.post_count] = await Promise.all([
                session.run(query, params),
                db.getPostCount(criteria)
            ]);
            
        } catch (err) {
            console.log(err);
        }
        let records = result.records;

        for (const record of records) {
            let post = record.get('p'); 
            let author = record.get('author'); 
            let comment_count = record.get('comment_count').low;
            let content = post.properties.Content;
            posts.posts.push({
                author,
                comment_count,
                id: post.properties.id,
                title: post.properties.Title,
                post_time: post.properties.Time,
                abbriv: content.length > 100? content.slice(100) + '...': content
            })
        }
        session.close();
        return posts;
    },

    /**
     * Create a reply node, ‘CREATE_REPLY’ relation between user and the reply 
     *  and ‘REPLY_TO’ relation between the post/reply and the reply
     * @param {*} username String
     * @param {*} content String, the content of the Reply
     * @param {*} id the unique id of the reply
     * @param {*} targetId the Id of the target that user reply to
     * @param {*} time the time that user makes the reply
     * @param {*} type the type of the target (should be "post" or "reply")
     */
    makeReply: async (username, content, id, targetId, time, type) => {
        let session = Neo4jDriver.wrappedSession();
        let query;
        let params;
        if (type === "post") {
            query = `MATCH (u:user {UserName: $username}), (p:post {id: $targetId}) 
                    CREATE (u)-[:CREATE_REPLY]->(r:reply {Content: $content, Time: $time, id: $id})
                    CREATE (r)-[:REPLY_TO]->(p)`;
            params = {"username": username, "targetId": targetId, "content": content, "time": time, "id": id};
        }else if (type === "reply") {
            query = `MATCH (u:user {UserName: $username}), (rp:reply {id: $targetId})
                    CREATE (u)-[:CREATE_REPLY]->(r:reply {Content: $content, Time: $time, id: $id}) 
                    CREATE (r)-[:REPLY_TO]->(rp)`;
            params = {"username": username, "targetId": targetId, "content": content, "time": time, "id": id};
        }
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },   

    /**
     * Delete the reply, ‘CREATE_REPLY’ and any ‘REPLY_TO’ relation with this reply
     * @param {*} id the unique Id of the reply
     */
    deleteReply: async (id) => {
        let session = Neo4jDriver.wrappedSession();

        let query = `MATCH 
                        (r:reply {id: $id})
                    SET r: DELETED`;
        let params = {id};

        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /**
     * Return a set of objects that are comments of the original post where each 
     * object contains id, title and time sorted by time
     * @param {*} id The id of the original post
     * @returns A set of objects where each object contains all the info of a reply
     */
    getComments: async(id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH 
                        (r:reply)-[:REPLY_TO*1..]->(p:post {id: $id}),
                        (u:user)-[:CREATE_REPLY]->(r:reply)
                    OPTIONAL MATCH (r:reply)-[:REPLY_TO]->(upper)
                    RETURN r, upper.id AS reply_to, u.UserName AS author ORDER BY r.Time`;
        let params = {id};
        let result;
        let replies = [];
        try {
            result = await session.run(query, params);
        } catch (err) {
            console.log(err);
        }

        let records = result.records; 
        for (const record of records) {
            let author = record.get('author'); 
            let r = record.get('r');
            let reply_to = record.get('reply_to');
            // Populate the replies array
            // Group the sub-comments inside the comments field of first level comments
            let firstLevelReply; 
            let isFirstLevel = true;
            let replyObj = {
                id: r.properties.id,
                reply_to,
                author,
                post_time: r.properties.Time,
                content: r.labels.indexOf('DELETED') === -1? r.properties.Content: '[DELETED]',
                comments: []
            }
            for (firstLevelReply of replies) {
                if (firstLevelReply.__ids.indexOf(reply_to) !== -1) {
                    // If the comment of this record belongs to this first level comment
                    isFirstLevel = false;
                    break; 
                }
            }
            if (isFirstLevel) {
                replyObj.__ids= [replyObj.id], // Temp, will be deleted before returning. 
                replies.push(replyObj);
            }
            else {
                firstLevelReply.comments.push(replyObj);
                firstLevelReply.__ids.push(replyObj.id); 
            }
        }
        for (const reply of replies) {
            delete reply.__ids; 
        }

        session.close();
        return replies;
    },

    /**
     * Create a tag and the ‘HAS_TAG’ relationship between the user and tag. 
     * If the tag exists in the database (has the same tagName), then only the 
     * “HAS_TAG” relationship will be created.
     * @param {*} username String
     * @param {*} tagName String
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

    /**
     * Delete the relationship between the user and the tag, and the tag node if 
     * there are no relationships involving the tag
     * @param {*} username String
     * @param {*} tagName String
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

    /**
     * Gets all the tags that a user has.
     * @param {*} username String
     * @returns A set of tagNames
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

    /**
     * Checks if the user has the given tag
     * @param {*} username String
     * @param {*} tagName String
     * @returns true/false
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

    /**
     * Create ‘FOLLOW’ relationship between the user and the post
     * @param {*} username String
     * @param {*} id String, the id of the post that user wants to follow
     */
    followPost: async (username, id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}), 
                           (p:post {id: $id}) 
                    CREATE (u)-[:FOLLOW]->(p)`;
        let params = {"username": username, "id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete ‘FOLLOW’ relationship between the user and the post
     * @param {*} username String
     * @param {*} id String, the id of the post that user wants to follow
     */
    unfollowPost: async (username, id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username})-[f:FOLLOW]->(p:post {id: $id}) 
                    DELETE f`;
        let params = {"username": username, "id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Return a set of id where each post is followed by the user
     * @param {*} username String
     * @returns A set of id that user follows
     *          Empty if user follows nothing
     */
    getFollowedPostByUser: async (username) => {
        var idSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}), 
                           "(u)-[:FOLLOW]->(p:post) 
                     RETURN p.id AS id`;
        let params = {"username": username};
        let result;
        try {
            result = await session.run(query, params).then();
            result.records.forEach(record => idSet.push(record.get("id")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        return idSet;
    },

    /**
     * Return a set of username where each user is following this post
     * @param {*} id String
     * @returns A set of users that follow this post
     *          Empty if the post is not followed by any user
     */
    getFollowingUserByPost: async (id) => {
        var usernameSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (p:post {id: $id}), 
                           (u:user)-[:FOLLOW]->(p) 
                     RETURN u.UserName AS userName`;
        let params = {"id": id};
        let result;
        try {
            result = await session.run(query, params).then();
            result.records.forEach(record => idSet.push(record.get("userName")));
        } catch (err) {
            console.error(err);
        }
        session.close();
        return usernameSet;       

    },

    /** Store the assignment info in the database. If the assignment does not have due, it will be set to -1
     * @param {*} id the id of the assignment
     * @param {*} title the title of the assignment
     * @param {*} media assignment media
     * @param {*} content assignment content
     * @param {*} posted_timestamp the date when the assignment is posted
     * @param {*} due_timestamp the date when the assignment will due
     */
    createAssignment: async (id, title, media, content, posted_timestamp, due_timestamp = -1) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `CREATE (a:assignment 
                            {Id: $id, Title: $title, Media: $media, Content: $content, Posted_time: $posted, Due_time: $due})`;
        let params = {"id": id, "title": title, "media": media, "content": content,
                      "posted": neo4j.int(posted_timestamp), "due": neo4j.int(due_timestamp)};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);

        }
        session.close();
    },
  
    /**
     * Set the assignment to new due. If missing the second paramaters, it will be set to -1
     * @param {*} id the id of the assignment
     * @param {*} due the new due of the assignment
     */
    setAssignmentDue: async (id, due = -1) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (a:assignment {Id: $id}) 
                     SET a.Due_time = $due`;
        let params = {"id": id, "due": neo4j.int(due)};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },
  
    /**
     * Delete the assignment and all related submission
     * @param {*} id the id of the assignment
     */
    deleteAssignment: async (id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (s:submission)-[:SUBMIT_TO]->(a:assignment {Id: $id}) 
                     DETACH DELETE s, a`;
        let params = {"id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },
  
    /**
     * Get all the in-time submission id that related to the assignment
     * @param {*} id the assignment id
     * @returns a set that contains all the id of in-time submission
     */
    getInTimeSubmission: async (id) => {
        let submissionSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (s:submission)-[:SUBMIT_TO]->(a:assignment {Id: $id}) 
                     WHERE s.Posted_time <= a.Due_time
                     RETURN s.Id AS submissionId`;
        let params = {"id": id};
        let result;
        try {
            result = await session.run(query, params);
            result.records.forEach(record => submissionSet.push(record.get("submissionId")));
        } catch (err) {
            console.error(err);
        }
        session.close();
        return submissionSet;
    },

    /**
     * Get all the late submission id that related to the assignment
     * @param {*} id the assignment id
     * @returns a set that contains all the id of late submission
     */
    getLateSubmission: async (id) => {
        let submissionSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (s:submission)-[:SUBMIT_TO]->(a:assignment {Id: $id}) 
                     WHERE s.Posted_time > a.Due_time 
                     RETURN s.Id AS submissionId`;
        let params = {"id": id};
        let result;
        try {
            result = await session.run(query, params);
            result.records.forEach(record => submissionSet.push(record.get("submissionId")));
        } catch (err) {
            console.error(err);
        }
        session.close();
        return submissionSet;
    },

    /**
     * Create a submission, a CREATE_SUBMISSION relationship with the user
     * and a SUBMIT_TO relationship with the assignment
     * @param {*} username the username of the user
     * @param {*} assignmentId the id of the assignment
     * @param {*} id the unique id of the submission
     * @param {*} content the content of the submission
     * @param {*} media the submission media
     * @param {*} posted_timestamp the date when the assignment is posted
     */
    createSubmission: async (username, assignmentId, submissionId, content, media, posted_timestamp) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {UserName: $username}), (a:assignment {Id: $assignmentId}) 
                     CREATE (u)-[:CREATE_SUBMISSION]->(s:submission 
                            {Id: $submissionId, Content: $content, Media: $media, Posted_time: $posted, Grade: -1}) 
                     CREATE (s)-[:SUBMIT_TO]->(a)`;
        let params = {"username": username, "assignmentId": assignmentId, "submissionId": submissionId, "content": content, 
                      "media": media, "posted": neo4j.int(posted_timestamp)};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },

    /**
     * Set the grade of the submission to the new grade. If missing the second paramaters, it will be set to 0
     * @param {*} id the id of the submission
     * @param {*} grade the grade of the submission
     */
    gradeSubmission: async (id, grade = -1) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (s:submission {Id: $id}) 
                     SET s.Grade = $grade`;
        let params = {"id": id, "grade": neo4j.int(grade)};
        try {
            await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        session.close();
    },
  
    /**
     * Get the grade of the submission
     * @param {*} id the submission id
     * @returns the grade of the submission
     */
    getSubMissionGrade: async (id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (s:submission {Id: $id}) 
                     RETURN s.Grade AS grade`;
        let params = {"id": id};
        let result;
        try {
            result = await session.run(query, params);
        } catch (err) {
            console.error(err);
        }
        let grade = result.records[0].get('grade');
        session.close();
        return grade;
    },

    /**
     * Get all courses
     */
    getCourses:  async() =>{
        var courseSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course)
                     RETURN c`;
        let result;
        try {
            result = await session.run(query, params);
            let records = result.records;
            for (let i = 0; i < records.length; i++) {
                let course = records[i].get(0);
                courseSet.push({
                    name: course.properties.Name,
                    description: course.properties.Description,
                    instructor: course.properties.Instructor
                })
            }
        } catch (err) {
            console.log(err);
        }

        session.close();
        return courseSet;
    },

    /**
     * Create the course in the database and its relation to the instructor
     * @param {*} name the unique name of the course
     * @param {*} instructor a set of username of the instructors
     * @param {*} description description of the course
     */
    createCourse: async (name, instructor, description) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `CREATE (c:course {Name: $name, Instructor: $instructor, Description: $description}) 
                     WITH c, $instructorSet AS instructorSet  
                     UNWIND instructorSet AS teacher 
                     MERGE (u:user {Username: teacher})-[:CREATE_COURSE]->(c)`;
        let params = {"name": name, "instructor": instructor, "description": description, "instructorSet": instructor};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },
  
    /**
     * Edit the course description
     * @param {*} name the name of the course
     * @param {*} description the new description
     * @param {*} instructor the new instructor
     */
    editCourse: async (name, description) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course {Name: $name}) 
                     SET c.Description = $description`;
        let params = {"name": name, "description": description};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Create a ENROL relationship between the user and the course
     * @param {*} name the name of the course
     * @param {*} username the name of the user
     */
    enrolCourse: async (name, username) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MERGE (:user {Username: $username})-[:ENROL]->(:course {Name: $name})`;
        let params = {"username": username, "name": name};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * DELETE the ENROL relationship between the user and the course
     * @param {*} name the name of the course
     * @param {*} username the name of the user
     */
    dropCourse: async (name, username) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (:user {Username: $username})-[e:ENROL]->(:course {Name: $name}) 
                     DELETE e`;
        let params = {"username": username, "name": name};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Search the course by its name and return an object containing its feature
     * Null o/w
     * @param {*} name the name of the course
     * @returns return an object containing its name, instructor and description
     */
    searchCourseByName: async (name) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course {Name: $name}) 
                     RETURN c`;
        let params = {"name": name};
        let result;
        try {
            result = await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        var course;
        if (result.records.length == 0) {
            return null;
        }else {
            course = {
                name: result.records[0].get(0).properties.Name,
                instructor: result.records[0].get(0).properties.Instructor,
                description: result.records[0].get(0).properties.Description
            }
        }
        session.close();
        return course;
    },

    /**
     * Return a set of courses that the instructor create
     * @param {*} instructor the username of the instructor
     * @returns a set of courses that the instructor create
     */
    searchCourseByInstructor: async (instructor) => {
        var courseSet= [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {Username: $instructor})-[:CREATE_COURSE]->(c:course) 
                     RETURN c.Name AS name`;
        let params = {"instructor": instructor};
        let result;
        try {
            result = await session.run(query, params);
            result.records.forEach(record => courseSet.push(record.get("name")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        return courseSet;
    },

    /**
     * Return all the course that user enrols in
     * @param {*} username the username
     * @returns a set of object that contains name, instructor and description of a course
     */
    getEnroledCourse: async (username) => {
        var courseSet = [];
        let courseNameSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (u:user {Username: $username})-[:ENROL]->(c:course) 
                     RETURN c.Name AS name`;
        let params = {"username": username};
        let result;
        try {
            result = await session.run(query, params);
            result.records.forEach(record => courseNameSet.push(record.get("name")));
        } catch (err) {
            console.log(err);
        }
        session.close();
        for (let i = 0; i < courseNameSet.length; i++) {
            courseSet.push(await this.searchCourseByName(courseNameSet[i]));
        }
        return courseSet;
    },
    
    /**
     * Create the video in the database
     * @param {*} id the id of the video
     * @param {*} name the name of the video
     * @param {*} description the description of the video
     * @param {*} url the url of the video
     * @param {*} posted_timestamp the posted time of the video
     */
    createVideo: async (id, name, description, url, posted_timestamp) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `CREATE (v:video {Id: $id, Name: $name, Description: $description, Url: $url, Post_time: $posted})`;
        let params = {"id": id, "name": name, "description": description, "url": url, "posted": posted_timestamp};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Edit the description and url for the video
     * @param {*} id the id of the video
     * @param {*} description the new description
     * @param {*} url the new url
     */
    editVideo: async (id, description, url) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (v:video {Id: $id}) 
                     SET v.Description = $description, 
                         v.Url = $url`;
        let params = {"id": id, "description": description, "url": url};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete the video
     * @param {*} id the id of the video
     */
    deleteVideo: async (id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (v:video {Id: $id}), 
                           (:module)-[hs:HAS_CONTENT]-(v) 
                     DELETE hs, v`;
        let params = {"id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Create the Reading in the database
     * @param {*} id the id of the Reading
     * @param {*} name the name of the Reading
     * @param {*} description the description of the Reading
     * @param {*} path the path of the file
     * @param {*} posted_timestamp the posted time of the Reading
     */
    createReading: async (id, name, description, path, posted_timestamp) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `CREATE (r:reading {Id: $id, Name: $name, Description: $description, Path: $path, Post_time: $posted})`;
        let params = {"id": id, "name": name, "description": description, "path": path, "posted": posted_timestamp};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Edit the name and content of the reading
     * @param {*} id the id of the reading
     * @param {*} name the new name
     * @param {*} description the new description
     */
    editReading: async (id, name, description) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (r:reading {Id: $id}) 
                     SET v.Name = $name, 
                         v.Description = $description`;
        let params = {"id": id, "name": name, "description": description};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete the reading
     * @param {*} id the id of the video
     */
    deleteReading: async (id) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (r:reading {Id: $id}), 
                           (:module)-[hs:HAS_CONTENT]-(r) 
                     DELETE hs, r`;
        let params = {"id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Create a module of a course and a relationship between the course and the module
     * @param {*} course the name of the course
     * @param {*} id the module id
     * @param {*} name the name of the id
     */
    createModule: async (course, id, name) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course {Name: $courseName}) 
                     MERGE (c)-[:HAS_MODULE]->(:module {Course: $course, Id: $id, Name: $name})`;
        let params = {"courseName": course, "course": course, "id": id, "name": name};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Create HAS_CONTENT relationship with an object
     * @param {*} type type of object (assignment, video or reading)
     * @param {*} objId the id of the object
     * @param {*} moduleId the id of the module
     */
    addContentIntoModule: async (type, objId, moduleId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (o:$type {Id: $objId}), (m:module {Id: $moduleId}) 
                     CREATE (m)-[:HAS_CONTENT]->(o)`;
        let params = {"type": type, "objId": objId, "moduleId": moduleId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete HAS_CONTENT relationship with an object
     * @param {*} type type of object (assignment, video or reading)
     * @param {*} objId the id of the object
     * @param {*} moduleId the id of the module
     */
    deleteContent: async (type, objId, moduleId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $moduleId})-[hs:HAS_CONTENT]->(o:$type {Id: $objId}) 
                     DELETE hs`;
        let params = {"moduleId": moduleId, "type": type, "objId": objId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete all the content of a module
     * @param {*} moduleId the module id
     */
    deleteAllContent: async (moduleId) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $moduleId})-[:HAS_CONTENT]->(o), 
                           (o)<-[:SUBMIT_TO]-[s:submission]
                     DETACH DELETE s, o`;
        let params = {"moduleId": moduleId};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Return a set of object that contains all the assignment in the module
     * @param {*} moduleId the id of the module
     * @returns a set of object that each object contains assignment title, media, content and due
     */
    getAllAssignment: async (moduleId) => {
        var assignmentSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $moduleId})-[:HAS_CONTENT]->(a:assignment) 
                     RETURN a`
        let params = {"moduleId": moduleId};
        let result;
        try {
            result = await session.run(query, params);
            records = result.records;
            for (let i = 0; i < records.length; i++) {
                let assignment = records[i].get(0);
                assignmentSet.push({
                    type: "Assignment",
                    title: assignment.properties.Title,
                    media: assignment.properties.Media,
                    content: assignment.properties.Content,
                    due: assignment.properties.Due_time
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return assignmentSet;
    },
    
    /**
     * Return a set of object that contains all the video in the module
     * @param {*} moduleId the id of the module
     * @returns a set of object that each object contains video name, description and url
     */
    getAllVideo: async (moduleId) => {
        var videoSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $moduleId})-[:HAS_CONTENT]->(v:video) 
                     RETURN v`
        let params = {"moduleId": moduleId};
        let result;
        try {
            result = await session.run(query, params);
            records = result.records;
            for (let i = 0; i < records.length; i++) {
                let video = records[i].get(0);
                videoSet.push({
                    type: "video",
                    name: video.properties.Name,
                    description: video.properties.Description,
                    url: video.properties.Url
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return videoSet;
    },

    /**
     * Return a set of object that contains all the reading in the module
     * @param {*} moduleId the id of the module
     * @returns a set of object that each object contains reading name, description and path
     */
    getAllReading: async (moduleId) => {
        var readingSet = [];
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $moduleId})-[:HAS_CONTENT]->(r:reading) 
                     RETURN r`
        let params = {"moduleId": moduleId};
        let result;
        try {
            result = await session.run(query, params);
            records = result.records;
            for (let i = 0; i < records.length; i++) {
                let reading = records[i].get(0);
                readingSet.push({
                    type: "Reading",
                    name: reading.properties.Name,
                    description: reading.properties.Description,
                    path: reading.properties.Path
                })
            }
        } catch (err) {
            console.log(err);
        }
        session.close();
        return readingSet;
    },

    /**
     * Return a set that contains all the content in the module
     * @param {*} moduleId the id of the module
     * @returns a set that contains all the content in the module where each content contains its feature
     */
    getModule: async (moduleId) => {
        let assignmentSet = await this.getAllAssignment(moduleId);
        let videoSet = await this.getAllVideo(moduleId);
        let readingSet = await this.getAllReading(moduleId);
        var moduleContent = [];
        moduleContent.push.apply(a, assignmentSet);
        moduleContent.push.apply(a, videoSet);
        moduleContent.push.apply(a, readingSet);
        return moduleContent;
    },

    /**
     * Get all the modules and their content of a course 
     * Null if the course does not have any modules
     * @param {*} course the name of the course
     * @returns a set where each object contains the name of the module and its content
     */
    getAllModules: async (course) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Course: $course}), 
                     RETURN m`;
        let params = {"course": course};
        let result;
        try {
            result = await session.run(query, params);
            records = result.records;
        } catch (err) {
            console.log(err);
        }
        var moduleSet = [];
        if (records.length == 0) {
            return null;
        }else {
            for (let i = 0; i < records.length; i++) {
                let module = records[i].get(0);
                moduleSet.push({
                    name: module.properties.Name,
                    content: await this.getModule(module.properties.Id)
                })
            }
        }
        session.close();
        return moduleSet;
    },

    /**
     * Edit the module with the new name
     * @param {*} id the id of the module
     * @param {*} name the new name of the module
     */
    editModule: async (id, name) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $id}) 
                     SET m.Name = $name`;
        let params = {"id": id, "name": name};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Delete the module and any relationship with the module
     * @param {*} id the id of the module
     */
    deleteModule: async (id) => {
        await this.deleteAllContent(id);
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (m:module {Id: $id}), 
                           (:course)-[h:HAS_MODULE]->(m) 
                     DELETE h, m`;
        let params = {"id": id};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },


    
    /**
     * Delete all the module in the course
     * @param {*} course the name of the course
     */
     deleteAllModule: async (course) => {
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course {Name: $course}), 
                           (c)-[:HAS_MODULE]->(m:module), 
                           (m)-[:HAS_CONTENT]->(o), 
                           (o)<-[:SUBMIT_TO]-(s:submission) 
                     DELETE s, o, m`;
        let params = {"course": course};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * DELETE the course
     * @param {*} name the name of the course
     */
    deleteCourse: async (name) => {
        await this.deleteAllModule(name);
        let session = Neo4jDriver.wrappedSession();
        let query = `MATCH (c:course {Name: $name}), 
                           (:user)-[e:ENROL]->(c),
                           (:user)-[cc:CREATE_COURSE]->(c) 
                     DELETE cc, e, c`;
        let params = {"name": name};
        try {
            await session.run(query, params);
        } catch (err) {
            console.log(err);
        }
        session.close();
    },

    /**
     * Return the content of the course
     * Null o/w
     * @param {*} courseName the name of the course
     * @returns an object that contains course info and modules
     */
    getCourseContent: async (courseName) => {
        let course = await this.searchCourseByName(courseName);
        if (course == null) {
            return null;
        }
        var courseContent = {
            name: course.name,
            instructor: course.instructor,
            description: course.description,
            modules: await this.getAllModules(courseName)
        };
        return courseContent;
    }


}; 

module.exports = db; 