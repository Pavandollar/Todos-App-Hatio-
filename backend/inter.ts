// import dotenv from 'dotenv';

const dotenv = require("dotenv")
dotenv.config();
const Note = require("./models/notel.model")
const config1 = require("./config.json");
const mongoose = require("mongoose");
console.log("loaded successfully");


mongoose.connect(config1.connectionString);
console.log("Connected");


const User = require("./models/user.model");


const express = require("express");
const cors = require("cors");
const app = express();


const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
    cors({
        origin:"*",

    })
);

app.get("/",(req,res) =>{
         res.json({data:"hello" });
});


//Creating Accounts
app.post("/create-account", async (req, res) => {

    const {fullName,email, password } = req.body;

    if (!fullName) {
        return res.status(400)
        .json({ error: true, message: "Fullname is Required" });
    } 

    if (!email) {
        return res
        .status(400)
        .json({ error: true, message: "Email is Required" });
    }

        if (!password) {
            return res
            .status(400)
            .json({ error: true, message: "password is Required" });
        }
       
       const isUser = await User.findOne({ email: email});

       if(isUser) {
        return res.json({

            error: true,
            message: "User already Exist",
        });
       }

       const newUser = new User({
        fullName,
        email,
        password,

       });

       await newUser.save();

       const accessToken = jwt.sign({ newUser
       }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
       });
       return res.json({
         error: false,
         user: newUser,
         accessToken,
         message: "Registartion Succesfull"
       });

});






//Login Accounts
app.post("/login", async (req, res) => {
const{ email, password } = req.body;

if (!email) {
  return res
  .status(400)
  .json({ error: true, message: "Email is Required" });
}

if (!password) {
  return res
  .status(400)
  .json({ error: true, message: "password is Required" });
}

const userInfo = await User.findOne({ email: email});

if (!userInfo) {
  return res.status(400).json({message: "User not found" });
}

if(userInfo.email == email && userInfo.password == password) {
  const user = {user: userInfo };
  
  const accessToken =jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn:"1d",
  });
  return res.json({
    error:false,
    message: "Login Succesfull",
    email,
    accessToken,
  });
}else{
  return res.status(400).json({
    error:true,
    message:"Invalid Credentials",
  });
}

});






//Create an Note Cards
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content } = req.body; 

  const { _id } = req.user; 
  if (!title || !content) {
      return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
      const note = new Note({
          title,
          content,
          userId: _id,  
      });
      await note.save();
      
    
      return res.json({ error: false, note, message: "Note Added Successfully" });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});





// app.post("/add-note", authenticateToken, async (req, res) => {
//   const { title, content, token} = req.body;

//   const { _id } = req.user;

//   if (!title) {
//     return res.status(400).json({
//       error: true,
//       message: "Title is Required",
//     });
//   }

//   if (!content) {
//     return res.status(400).json({
//       error: true,
//       message: "Content is Required",
//     });
//   }
 

//   try {
//     const note = new Note({
//       title,
//       content,
//       userId: _id,  
//     });
//     await note.save();

//     return res.json({
//       error: false,
//       note,
//       message: "Note Added Successfully",
//     });
//   } catch (error) {
//     console.error(error);  
//     return res.status(500).json({
//       error: true,
//       message: "Internal Server Error",
//     });

    
//   }
  

// });


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is in use, trying another...`);
    app.listen(0); 
  }
});

module.exports = app;