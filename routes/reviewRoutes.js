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
    reviewController.setTourUserIds,
    reviewController.createNewReview
  );

router
  .route('/:id')
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;
