const express = require('express')
require('dotenv').config()
const cors = require('cors')
const cookieParser = require('cookie-parser')
const foodRouter = require('./routes/food.route');
const userRouter = require('./routes/user.route');
const cartRouter = require('./routes/cart.route');
const orderRouter = require('./routes/order.route');

const app = express();

// Allow requests from FRONTEND_URL if provided, otherwise reflect the request origin.
const corsOptions = {
    origin: process.env.FRONTEND_URL || true,
    credentials: true
};
app.use(cors(corsOptions));


app.use(express.json())

app.use(cookieParser())


//api endpoints
app.use('/api/food', foodRouter)
app.use('/api/users', userRouter)
app.use('/api/cart', cartRouter)
app.use('/api/order', orderRouter)


module.exports = app;