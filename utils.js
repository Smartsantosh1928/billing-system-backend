const jwt = require('jsonwebtoken');

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

  // const connectToDatabase = (databaseName) => {
  //   return mongoose.createConnection(`mongodb://127.0.0.1:27017/${databaseName}`, {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   });
  // };
module.exports = { verifyToken, generateOTP};