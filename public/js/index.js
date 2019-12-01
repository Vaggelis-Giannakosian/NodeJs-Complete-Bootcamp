/* eslint-disable */

import '@babel/polyfill';
import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings } from './updateSettings';

//DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateForm = document.querySelector('.form-user-data');
const updatePassword = document.querySelector('.form-user-settings');
//Delegation

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateForm) {
  updateForm.addEventListener('submit', e => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const photo = document.getElementById('photo').files[0];

    const form = new FormData();
    form.append('name', name);
    form.append('email', email);
    form.append('photo', photo);

    updateSettings(form, 'data');
  });
}

if (updatePassword) {
  updatePassword.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent =
      'Updating...';
    const passwordCurrent = document.getElementById(
      'password-current'
    ).value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById(
      'password-confirm'
    ).value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent =
      'Save Password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}
