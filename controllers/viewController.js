const Tour = require('./../models/tourModel');
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
