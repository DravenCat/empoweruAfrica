'use strict'; 
const Express = require('express');
const Utils = require('./utils');

const accountRouter = require('./account');

const PORT = 5000; 

const app = Express(); 

/*
    '/api/signup': ['email', 'password'] means that
    route '/api/signup' is expecting the request body to have fields
    'email' and 'password'. 

    If a route is not present here, it means the route does not specify
    which fields are expected. 
*/
const expectedFields = {
    '/api/account/signup': ['username', 'email', 'password', 'type'], 
    "/api/account/signin": ['id', 'password']
};

// parse the request body as json. 
app.use(Express.json());

// checks whether the expected fields are present in the request body
app.use((req, res, next) => {
    // If the required field is not specified
    if (!(req.path in expectedFields)) {
        next();
        return;
    }
    
    if (! Utils.objHasFields(req.body, expectedFields[req.path])) {
        res.status(400).json(
            {"message": `Bad request: expecting fields [${expectedFields[req.path].join(', ')}] in request body.`}
        );
        return;
    }
    next();
}); 

app.get("/", (req, res) => {
    res.send('Hello World!');
});

app.use('/api/account', accountRouter); 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 