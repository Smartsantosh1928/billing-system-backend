require('dotenv').config();
require('./config/db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./utils');
const authRouter = require('./routes/authRouter')
const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./config/swagger');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Api is running');
});

app.use('/auth', authRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./config/swagger_output.json')));
app.listen(3000, () => console.log('Server is running on port 3000'));
