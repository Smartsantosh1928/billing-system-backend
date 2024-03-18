require('dotenv').config();
require('./config/db');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const verifyToken = require('./utils');
const authRouter = require('./routes/authRouter')
const productRouter = require('./routes/productRouter')
const fileRouter = require('./routes/fileRouter')
const userRouter = require('./routes/userRouter')
const billRouter = require('./routes/billRouter')
const paymentRouter = require('./routes/paymentRouter')
const swaggerUi = require('swagger-ui-express');

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('Api is running');
});

app.use('/auth', authRouter);
app.use('/products', productRouter);
app.use('/bill',billRouter);
app.use('/user', userRouter);
app.use('/files', fileRouter);
app.use('/payment', paymentRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('./config/swagger_output.json')));
app.listen(3000, () => console.log('Server is running on port 3000'));
