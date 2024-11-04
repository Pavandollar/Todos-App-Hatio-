// import dotenv from 'dotenv';

const dotenv = require("dotenv")
dotenv.config();
const Note = require("./models/note.model")
const config = require("./config.json");
const mongoose = require("mongoose");
console.log("loaded successfully");


mongoose.connect(config.connectionString);
console.log("Connected");


const User = require("./models/user.model");


const express = require("express");
const cors = require("cors");
const app = express();


const jwt = require("jsonwebtoken")
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Change '*' to specific origin in production
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.get("/",(req,res) =>{
         res.json({data:"hello" });
});


//BACKEND PHASE CREATED


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
        expiresIn: "7d",
       });
       return res.json({
         error: false,
         user: newUser,
         accessToken,
         message: "Registartion Succesfull"
       });

});


// Login Accounts
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
    expiresIn:"7d",
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



//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
   
  const { user } = req.user;

  const isUser = await User.findOne({ _id:user._id });

  if(!isUser) {
    return res,sendStatus(401);
  }
  return res.json({
    user: {fullName: isUser.fullName, email: isUser.email,"_id": isUser._id,},
    message: "As your Requested User",
  })

});



//Create an Note Cards
app.post("/add-note", authenticateToken, async (req, res) => {
  const { title, content } = req.body; 

  const { user } = req.user; 
  if (!title || !content) {
      return res.status(400).json({ error: true, message: "Title and content are required" });
  }

  try {
      const note = new Note({
          title,
          content,
          userId: user._id,  
      });
      await note.save();
      
    
      return res.json({ error: false, note, message: "Note Added Successfully" });
  } 
  catch (error)
   {
      console.error(error);
      return res.status(500).json({ error: true, message: "Internal Server Error" });
  }
});


//Update an Created Note
app.put("/edit-note/:noteId",  authenticateToken, async (req, res) =>  {
    
  const noteId = req.params.noteId;
  const{ title,content,isPinned } = req.body;
  const { user } = req.user;

  if(!title && !content)
  {
    return res.status(400).json({ error: true, message: "No Changes Required"});

  }
  
try{
  const note = await Note.findOne({ _id: noteId, userId: user._id });

  if(!note) {
    return res.status(404).json({ error: true, message: "Note not found"});
  }
  
  if(title) note.title = title;
  if(content)note.content = content;
  if(isPinned) note.isPinned = isPinned;

  await note.save();

  return res.json({
    error: false,
    note,
    message: "Note Updated Succesfully"
  });
}
catch(error)
 {
  return res.status(500).json({
error:true,
message: "Internal Server problem",
  });
 }
});


app.get("/get-all-notes/",  authenticateToken, async (req, res) =>  {

      const{ user } = req.user;

      try{
        const notes = await Note.find ({ userId:user._id}).sort({isPinned: -1

        });
       
        return res.json({
          error: false,
          notes,
          message: "AllNotes Retrieved Succesfully",
        });

      } 
      catch(error){
        return res.status(500).json({
          error:true,
          message: "Internal Server Error",
        });
      }
});


//Delete Note
app.delete("/delete-note/:noteId",  authenticateToken, async (req, res) => {
   
     const noteId = req.params.noteId;
     const { user } = req.user;

     try{
      const note = await Note.findOne({ _id: noteId,userId: user._id});

      if(!note) {
        return res.status(404).json({ error: true, message: "Note not Found"});

      }

      await Note.deleteOne({ _id: noteId, userId: user._id});

      return res.json({
        error: false,
        message: "Note deleted Succesfully",
      });

     }
     catch(error) {
      return res.status(500).json({
        error: true,
        message:" internal Server Error"
      });
     }

});


//Update isPinned
app.put("/update-note-pinned/:noteId",  authenticateToken, async (req, res) => {
     
  const noteId = req.params.noteId;
  const{ isPinned } = req.body;
  const { user } = req.user;

 
  
try{
  const note = await Note.findOne({ _id: noteId, userId: user._id });

  if(!note) {
    return res.status(404).json({ error: true, message: "Note not found"});
  }
  
  
  note.isPinned = isPinned || false;

  await note.save();

  return res.json({
    error: false,
    note,
    message: "Note Pinned Succesfully"
  });
}
catch(error)
 {
  return res.status(500).json({
error:true,
message: "Internal Server problem",});
 }

});


// Search Projects
app.get("/search-notes/",  authenticateToken, async (req, res) => {
      const { user } = req.user;
      const { query }  = req. query;

       if(!query) {
        return res.status(400).json({error:true,message: "Search Query is Required"})
       }
       try{

         const matchingNotes = await Note.find({
          userId: user._id,
          $or: [ 
            {title: { $regex: new RegExp(query, "i")}},
            {content: {$regex: new RegExp(query, "i")}},
          ],
         });
         return res.json({
          error: false,
          notes: matchingNotes,
          message: " NOtes Matching the Query Retrieveied",
         });

       }catch(error){
        return res.status(400).json({
          error: true,
          message: "Internal Server problem",
        });
       }

    })







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