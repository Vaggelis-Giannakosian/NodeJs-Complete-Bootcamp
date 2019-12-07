/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

let stripe;
if (window.hasOwnProperty('Stripe')) {
  stripe = Stripe('pk_test_pFD9XMx96wNEslnPXVKt0IlU00kk88vpHR');
}

export const bookTour = async tourId => {
  try {
    // get session from the server
    const session = await axios(
      `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`
    );

    // create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
