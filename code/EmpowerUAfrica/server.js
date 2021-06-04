'use strict'; 
const Express = require('express');

const PORT = 5000; 

const app = Express(); 

app.get("/", (req, res) => {
    res.send("Hello World!");
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`)); 