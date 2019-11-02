const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email.js');

// const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and password Exquisite
  if (!email || !password) {
    return next(
      new AppError('Please provide email and password', 400)
    );
  }

  //2)Check if use exists and password is correct
  const user = await User.findOne({ email }).select('+password');
  if (
    !user ||
    !(await user.correctPassword(password, user.password))
  ) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //3)If everything is ok,send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Get the token and check if exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token)
    return next(
      new AppError(
        'You are not logged in! Please log in to get access.',
        401
      )
    );

  //2) Validate the token
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  //3) Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser)
    return next(
      new AppError(
        'The user belonging to this token does not exist',
        401
      )
    );

  //4) Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat))
    return next(
      new AppError(
        'User recently changed password. Plase log in again.',
        401
      )
    );

  //Grant access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = function(...roles) {
  return (req, res, next) => {
    //roles is an array e.g ['admin','lead-guide'] role='user'

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          'You do not have permission to perform this action',
          403
        )
      );
    }

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POSTed emails
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(
      new AppError('There is no user with that email address.', 404)
    );

  //2) Generate the random reset tokenExpiredError
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3) Send it to user's email
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\n If you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Reset token has been sent to your email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending this email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = (req, res, next) => {
  next();
};
