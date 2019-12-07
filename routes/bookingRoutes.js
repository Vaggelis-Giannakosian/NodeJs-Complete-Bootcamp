const express = require('express');
const bookingController = require('./../controllers/bookingController');
const authController = require('./../controllers/authenticationController');

const router = express.Router();

router.use(authController.protect);

router.get(
  '/checkout-session/:tourID',
  bookingController.getCheckoutSession
);

router.use(authController.restrictTo('admin', 'lead-guide'));

router
  .route('/')
  .get(bookingController.getBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getSingleBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

module.exports = router;
