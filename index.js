require('dotenv').config();
require('./db');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Api is running');
});

let refreshTokens = [];

app.post('/login',(req,res) => {
    const username = req.body.username;
    const user = { name: username };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });
    res.json({ accessToken: accessToken });
})

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);

        req.user = user;
        next();
    })
}

app.post('/getRefreshToken',(req,res) => {
    const { refreshToken } = req.body;

    if(refreshToken == null) return res.sendStatus(401);
    if(!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);

        const accessToken = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3600s' });

        res.json({ accessToken: accessToken });
    })
})

app.listen(3000, () => console.log('Server is running on port 3000'));