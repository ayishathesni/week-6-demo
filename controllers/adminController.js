const User=require('../Model/userModel')
const bcrypt = require('bcrypt');


const loadlogin=async(req,res)=>{
  try{
           res.render('login.ejs')
  }
  catch(error){
         console.log(error.message)
  }
}



const verifylogin = async (req, res) => {
  try {
    const userName = req.body.username;
    const password = req.body.password;
    const userData = await User.findOne({ userName: userName });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.isAdmin) {
          req.session.adminId = userData._id;
          res.redirect('/admin/home');
        } else {
          res.render('login', { message: "You do not have admin access." });
        }
      } else {
        res.render('login', { message: "Email and password are incorrect." });
      }
    } else {
      res.render('login', { message: "Email and password are incorrect." });
    }
  } catch (error) {
    console.log(error.message);
    res.render('login', { message: "An error occurred. Please try again." });
  }
};


const loadhome=async(req,res)=>{
  try{
      const userData=await User.find()
      res.render('home',{users:userData})
  }
  catch(error){
    console.log(error)
  }
}



const newUserLoad=async(req,res)=>{
  try{
      res.render('newuser')
  }
  catch(error){
    console.log(error)
  }
}


const addUser = async (req, res) => {
  try {
    const userName = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const spassword = await bcrypt.hash(password, 10);

    const user = new User({
      userName: userName,
      email: email,
      password: spassword
    });

    const userData = await user.save();
    if (userData) {
      res.redirect('/admin/home');
    } else {
      res.render('newuser', { message: "Something went wrong" });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error (username or email already exists)
      res.render('newuser', {
        message: "Username or email already exists. Please use a different one."
      });
    } else {
      console.log(error);
      res.render('newuser', { message: "An error occurred. Please try again." });
    }
  }
};


const edituserLoad=async(req,res)=>{
  try{
     const id=req.query.id;
     const userData=await User.findById({_id:id})
     if(userData){
      res.render('edituser',{user:userData})
     }
  }
  catch(error){
    console.log(error)
  }
}

const updateUsers=async(req,res)=>{
  try{
     const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{ userName:req.body.userName,email:req.body.email,password:req.body.password}})
     res.redirect('/admin/home')

  }
  catch(error){
    console.log(error)
  }
}

const showUser = async (req, res) => {
  try {
    const name = req.body.userName; 
    const user = await User.findOne({ userName: name }); 

    if (user) {
      res.render('userdetail', { user, message: null });
    } else {
      res.render('userdetail', { user: null, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    res.render('userdetail', { user: null, message: 'An error occurred' });
  }
};


const deleteUser = async (req, res) => {
  try {
    const Id = req.query.id; 
     await User.deleteOne({_id:Id})
    res.redirect('/admin/home')

    
  } catch (error) {
    console.log(error);
    res.render('userdetail', { message: 'An error occurred' });
  }
};










module.exports={
  loadlogin,
  verifylogin,
  loadhome,
  newUserLoad,
  addUser,
  edituserLoad,
  updateUsers,
  deleteUser,
  showUser
  
}