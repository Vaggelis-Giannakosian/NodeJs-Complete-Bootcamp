const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  //1) Get all tour database
  const tours = await Tour.find();

  //3) Render that template using tour data from step 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  });
});

exports.getTour = catchAsync(async (req, res) => {
  //1) Get tours
  const tour = await Tour.findOne({ slug: req.params.slug }).populate(
    {
      path: 'reviews',
      fields: 'review rating user'
    }
  );

  //2) Render the template
  res.status(200).render('tour', {
    title: 'The Forest Hiker',
    tour
  });
});
