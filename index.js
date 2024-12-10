
const express = require('express');
const nocache = require("nocache")
const app=express()

const userRoute=require('./routes/userRoute')

app.use(nocache())
app.use('/',userRoute)

const admin_route=require('./routes/adminRoute');
const  connectDB  = require("./config/db.config.js");
app.use('/admin',admin_route)


async function init(){
   await connectDB()
   app.listen(3000, () => {
    console.log("Server listening on port 3000");
  });
}

init();


