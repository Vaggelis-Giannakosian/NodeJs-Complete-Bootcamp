const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const AppError = require('./utils/appError');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');

//1) GLOBAL Middlewares

//Set Security HTTP header
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit requests from same ip
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1hour
  message:
    'Too many requests from this IP, please try again in an hour!'
});

app.use('/api', limiter);

//Body parser, reading data from the body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
);

// Data Sanitization against NoSql query injection
app.use(mongoSanitize());

// Data Sanitization against XSS attacks
app.use(xss());

//Serving static files
app.use(express.static(`${__dirname}/public`));

//Test Middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

//Express error handler
app.use(globalErrorHandler);

module.exports = app;
