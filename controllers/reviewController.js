const Review = require('./../models/reviewModel');
// const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: 'success',
    data: {
      reviews
    }
  });
});

exports.createNewReview = catchAsync(async (req, res, next) => {
  const newReview = await Review.create({
    review: req.body.review,
    rating: req.body.rating,
    user: req.user.id,
    tour: req.body.tour
  });

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview
    }
  });
});
