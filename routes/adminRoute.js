const express = require('express');
const admin_route = express();
const session=require('express-session')
admin_route.use(session({secret:'secretkey'}))
const bodyParser=require('body-parser');
admin_route.use(bodyParser.json())
admin_route.use(bodyParser.urlencoded({ extended: true }));


admin_route.set('view engine','ejs')
admin_route.set('views','./views/admin');

const auth=require('../middleware/adminAuth')
const adminController=require("../controllers/adminController")

admin_route.get('/',auth.isLogout,adminController.loadlogin)

admin_route.post('/',adminController.verifylogin)

admin_route.get('/home',auth.isLogin,adminController.loadhome)

admin_route.get('/newuser',auth.isLogin,adminController.newUserLoad)
admin_route.post('/newuser',adminController.addUser)

admin_route.get('/edituser',auth.isLogin,adminController.edituserLoad)
admin_route.post('/edituser',adminController.updateUsers)

admin_route.get('/deletuser',adminController.deleteUser)
admin_route.post('/userdetail',adminController.showUser)


admin_route.get('*',function(req,res){
  res.redirect('/admin')
})


module.exports=admin_route