const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get all tour database
  const tours = await Tour.find();

  //3) Render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  //1) Get tours
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review rating user'
    }
  );

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  //2) Render the template
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  //2) Render the template
  res.status(200).render('login', {
    title: `Log into your account`
  });
};

exports.getAccount = (req, res) => {
  //2) Render the template
  res.status(200).render('account', {
    title: `Your Account`
  });
};

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email
    },
    {
      new: true,
      runValidators: true
    }
  );

  //2) Render the template
  res.status(200).render('account', {
    title: `Your Account`,
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  //Find all bookingSchema
  const bookings = await Booking.find({ user: req.user.id });
  // Find tours with the returned ids
  const tourIDs = bookings.map(el => el.tour);
  const tours = await Tour.find({
    _id: {
      $in: tourIDs
    }
  });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});
