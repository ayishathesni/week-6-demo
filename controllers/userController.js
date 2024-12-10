const User=require('../Model/userModel')
const bcrypt = require('bcrypt');


const securePassword=async(password)=>{
     try{
     const passwordHash=await bcrypt.hash(password,10)
     return passwordHash;
     }
     catch(error)
     {
          console.log(error)
     }


}




const loadRegister=async(req,res)=>{
  try{
           res.render('signup.ejs')
  }
  catch(error){
         console.log(error.message)
  }
}


// const insertUser=async(req,res)=>{
//   try{   const spassword=await securePassword(req.body.password)
//            const isAdmin = req.body.admin ? 1 : 0; 
//          const user=new User({
//           userName:req.body.username,
//           email:req.body.email,
//           password:spassword,
//           isAdmin:isAdmin

//          })
//          const userData=await user.save();
//          if(userData)
//          {
//           res.render('signup',{message:"your registration has been successfull "})
//          }

//   }

//   catch(error){

//   }
// }

const insertUser = async (req, res) => {
  try {
    const spassword = await securePassword(req.body.password);
    const isAdmin = req.body.admin ? 1 : 0;

    const user = new User({
      userName: req.body.username,
      email: req.body.email,
      password: spassword,
      isAdmin: isAdmin
    });

    const userData = await user.save();
    if (userData) {
      res.render('signup', { message: "Your registration has been successful" });
    }
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      res.render('signup', { message: "Username or email already exists. Please choose another." });
    } else {
      // Handle other errors
      console.error(error); // Log the error for debugging purposes
      res.render('signup', { message: "An unexpected error occurred. Please try again." });
    }
  }
};


////login
const loginLoad=async(req,res)=>{
  try{
    res.render('login')
  }
  catch(error)
  {

  }
}

const verifyLogin = async (req, res) => {
  try {
    const name = req.body.username; // This should match the input name in the form
    const password = req.body.password;
    
    console.log("Login attempt for user:", name); 
    
    const userData = await User.findOne({ userName: name });
    
    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);
      if (passwordMatch) {
        req.session.user_id = userData._id;
        return res.redirect('/home');
      } else {
        res.render('login', { message: 'Username and password are incorrect.' });
      }
    } else {
      res.render('login', { message: 'username and password are incorrect.' });
    }
  } catch (error) {
    console.log(error); // Corrected log statement
  }
}

const loadHome=(req,res)=>
{
  try{
        res.render('home')
  }
  catch{
     console.log(error.message)
  }
}

module.exports={
  loadRegister,
  insertUser,
  loginLoad,
  verifyLogin,
  loadHome,
}