const jwt = require("jsonwebtoken");

function authenticateToken(req, res, next) 
{
  const authHeader = req.headers['authorization'];
 
  
  if (!authHeader) {
    return res.status(401).json({ error: true, message: "Token missing" });
}
const token = authHeader && authHeader.split(" ")[1];
 


if (!token) {
  console.log("Token extraction failed from header:", authHeader);
  return res.status(403).json({ error: true, message: "Token format incorrect" });
}

jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  if (err) {
      console.error("JWT Verification Error:", err.message);  
      return res.status(403).json({ error: true, message: "Invalid or expired token" });
  }
  req.user = user;
  next();
});
};

module.exports = { authenticateToken, };







//option for import 

// import jwt from 'jsonwebtoken';

// function authenticateToken(req, res, next)
// {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(' ')[1];

//     if(!token) return res.sendStatus(401);

//         jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,( err, user) => {
//             if (err) return res.sendStatus(401);
//             req.user = user;
//             next();

//         });
// }

// module.exports = {
//     authenticateToken,
// };