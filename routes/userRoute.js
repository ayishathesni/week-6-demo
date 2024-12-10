const express = require('express');
const user_route = express()
const session=require('express-session')

user_route.use(session({secret:'secretkey'}))
const auth=require("../middleware/auth")
user_route.set('view engine','ejs')
user_route.set('views','./views/user')

const bodyParser=require('body-parser');
user_route.use(bodyParser.json())
user_route.use(bodyParser.urlencoded({ extended: true }));


const userController=require("../controllers/userController")

user_route.get('/signup',auth.isLogout,userController.loadRegister)
user_route.post('/signup',userController.insertUser)
user_route.get('/',auth.isLogout,userController.loginLoad)
user_route.get('/login',auth.isLogout,userController.loginLoad)
user_route.post('/login',userController.verifyLogin)
user_route.get('/home',auth.isLogin,userController.loadHome)





module.exports=user_route