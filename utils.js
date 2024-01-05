const jwt = require('jsonwebtoken');
const db=require('./config/db');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

function generateOTP() {
    const min = 100000; 
    const max = 999999; 
  
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

//   async function switchdb(dbname){
//     await db.useDb(dbname);
// }

// module.exports = { verifyToken, generateOTP, switchdb };
module.exports = { verifyToken, generateOTP};