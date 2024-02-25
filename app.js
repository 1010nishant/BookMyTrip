const express = require('express');
const morgan = require('morgan');
const cors = require('cors')

const globalErrorHandler = require('./controllers/errorController')
const AppError = require('./utils/appError')

const app = express();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
//middleware
app.use(cors())
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');


app.use((req, res, next) => {
    req.requestTime = new Date().toISOString()
    next()
})

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
})

app.use(globalErrorHandler)
// start server
module.exports = app;