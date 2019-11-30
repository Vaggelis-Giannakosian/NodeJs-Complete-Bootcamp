/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

//update data
export const updateData = async (name, email) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: 'http://localhost:3000/api/v1/users/updateMe',
      data: {
        name,
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Details updated successfully!');
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
