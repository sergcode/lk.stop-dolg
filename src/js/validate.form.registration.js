"use strict";

window.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form'),
      inputs = form.querySelectorAll('.login__input'),
      inputCloseRobots = form.querySelector('input[type="hidden"]'),
      submit = form.querySelector('.login__button'),
      regularEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
      ru = /[А-Яа-яЁё\s]/;

  for (let input of inputs) {
    submit.addEventListener('click', function (e) {
      e.preventDefault();
      const inputValue = input.value;

      if (inputValue === "" || inputValue === " " || (input.type === 'email' && !regularEmail.test(inputValue))) {
        showErrorMessage(input, '');
        return false;
      }

      if (input.classList.contains('password-input') && inputValue.length < 8) {
        showErrorMessage(input, 'Пароль должен содержать не менее 8 символов.');

      } else if (input.classList.contains('password-input') && inputValue.length >= 8) {
        errorMessageRemoveClass(input);
      }

      if (inputValue !== "" && !input.classList.contains('password-input') || inputValue !== " " && !input.classList.contains('password-input') || (input.type === 'email' && regularEmail.test(inputValue))) {
        errorMessageRemoveClass(input);
      }

      /** Защита от роботов **/
      if (inputCloseRobots.value !== "" || inputCloseRobots.value === " " || inputCloseRobots.value.length > 0) {
        return false;
      }
    });

    input.addEventListener('blur', function (e) {
      e.preventDefault();
      const thisInput = this;

      if (thisInput.type === 'email' || thisInput.name === 'username' || thisInput.name === 'email') {
        if (e.target.value.length > 0 && !regularEmail.test(e.target.value)) {
          showErrorMessage(input, 'Не корректная электронная почта');
        }
      }
    });

    input.addEventListener('input', function (e) {
      e.preventDefault();
      const thisInput = this,
            thisInputParent = thisInput.parentElement;

      if (thisInputParent.classList.contains('error') && thisInput.value.length > 0 && thisInput.type !== 'email') {
        errorMessageRemoveClass(thisInput);
      }

      if (thisInput.type === 'email' || thisInput.name === 'username' || thisInput.name === 'email') {
        if (e.target.value.length > 0 && regularEmail.test(e.target.value) || e.target.value.length === 0) {
          errorMessageRemoveClass(thisInput);
        }
      }

      if (thisInput.classList.contains('password-input')) {
        if (ru.test(e.target.value)) {
          showErrorMessage(input, 'Пароль должен содержать только латинские заглавные и строчные буквы, цифры, специальные символы. Например: pSn5$z');
          this.value = this.value.replace(/[А-Яа-яЁё\s]/gi, '');
          return false;

        } else {
          this.value = this.value.replace(/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$/gi, '');
          errorMessageRemoveClass(input);
        }
      }
    });
  }

  function showErrorMessage(input, text) {
    const inputContainers = input.parentElement,
          errorMessage = inputContainers.querySelector('.login__error');
    errorMessage.classList.add('active');
    if (text) errorMessage.textContent = text;
    inputContainers.classList.add('error');
  }

  function errorMessageRemoveClass(input) {
    const inputContainers = input.parentElement,
          errorMessage = inputContainers.querySelector('.login__error');
    errorMessage.classList.add('hide');
    setTimeout(() => {
      errorMessage.classList.remove('active');
      errorMessage.classList.remove('hide');
      errorMessage.textContent = 'Пожалуйста заполните это поле';
    }, 100);
    inputContainers.classList.remove('error');
  }
});

