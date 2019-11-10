const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authenticationController');

const router = express.Router({ mergeParams: true });

//mergeParams get the :tourId from the tour router if exists

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createNewReview
  );

module.exports = router;
