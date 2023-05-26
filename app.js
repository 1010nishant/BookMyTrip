const express = require('express');
const morgan = require('morgan');

const app = express();

console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//middleware
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

app.use((req, res, next) => {
    console.log('this is custom middleware')
    next()
})

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// start server
module.exports = app;