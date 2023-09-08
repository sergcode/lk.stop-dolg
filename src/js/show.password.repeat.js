"use strict";

function show_hide_password(target) {
  const input = target.previousElementSibling;

  if (input.getAttribute('type') === 'password') {
    input.setAttribute('type', 'text');
    target.classList.add('view');
    target.setAttribute('title', 'Скрыть пароль');
  } else {
    input.setAttribute('type', 'password');
    target.classList.remove('view');
    target.setAttribute('title', 'Показать пароль');
  }
  return false;
}

window.addEventListener('DOMContentLoaded', () => {
  const errorMessage = document.querySelectorAll('.login__error'),
        inputContainer = document.querySelectorAll('.login__input-container');

  function errorMessageRemoveClass() {
    for (let i = 0; i < errorMessage.length && inputContainer.length; i++) {
      errorMessage[i].classList.add('hide');
      setTimeout(() => {
        errorMessage[i].classList.remove('active');
        errorMessage[i].classList.remove('hide');
      }, 100);
      inputContainer[i].classList.remove('error');
    }
  }
  function passwordRepeat() {
    const inputPassword = document.querySelectorAll('.password-input');

    inputPassword.forEach(function (item) {
      item.addEventListener('input', function () {
        const specifiedPassword = document.querySelector('.password-input[name="specifiedpassword"]'),
              specifiedPasswordChange = specifiedPassword.value,
              loginQuantity = document.querySelector('.login__quantity'),
              loginQuantitySpan = loginQuantity.querySelector('span'),
              confirmPassword = document.querySelector('.password-input[name="confirmpassword"]'),
              confirmPasswordChange = confirmPassword.value,
              button = document.querySelector('.login__button');

        if (specifiedPasswordChange.length > 0) {
          confirmPassword.removeAttribute('disabled');
          if (specifiedPasswordChange.length < 6) {
            loginQuantity.classList.add('active');
            loginQuantitySpan.innerText = specifiedPasswordChange.length;
            button.setAttribute('disabled', 'disabled');
          } else {
            loginQuantity.classList.add('hide');
            setTimeout(() => {
              loginQuantity.classList.remove('active');
              loginQuantity.classList.remove('hide');
            }, 100);
            button.removeAttribute('disabled');
          }
          if (specifiedPasswordChange.length && confirmPasswordChange.length > 0) {
            if (specifiedPasswordChange !== confirmPasswordChange) {
              for (let i = 0; i < errorMessage.length && inputContainer.length; i++) {
                errorMessage[i].classList.add('active');
                inputContainer[i].classList.add('error');
              }
              button.setAttribute('disabled', 'disabled');
            } else {
              errorMessageRemoveClass();
            }
          } else if (confirmPasswordChange.length !== 1) {
            errorMessageRemoveClass();
            button.setAttribute('disabled', 'disabled');
          }
        } else {
          confirmPassword.setAttribute('disabled', 'disabled');
          confirmPassword.value = '';
          errorMessageRemoveClass();
          button.setAttribute('disabled', 'disabled');
          loginQuantity.classList.add('hide');
          setTimeout(() => {
            loginQuantity.classList.remove('active');
            loginQuantity.classList.remove('hide');
          }, 100);
        }
      });
    });
  }

  passwordRepeat();
});

