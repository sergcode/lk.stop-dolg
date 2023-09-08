"use strict";

function show_hide_password(target) {
  const input = document.getElementById('password-input'),
        eyeToggle = document.querySelector('.login__password-toggle');

  if (input.getAttribute('type') === 'password') {
    target.classList.add('view');
    input.setAttribute('type', 'text');
    eyeToggle.setAttribute('title', 'Скрыть пароль');
  } else {
    target.classList.remove('view');
    input.setAttribute('type', 'password');
    eyeToggle.setAttribute('title', 'Показать пароль');
  }
  return false;
}

window.addEventListener('DOMContentLoaded', () => {
  function passwordVisibleHide() {
    const passwordInput = document.querySelectorAll('.questionnaire__form_input[name="passwordToggle"]'),
          eyeToggle = document.querySelectorAll('.eyeToggle');

    eyeToggle.forEach((item, i) => {
      item.addEventListener('click', (e) => {
        e.preventDefault(); // Отключить переход по ссылке

        if (passwordInput[i].getAttribute('type') === 'password') {
          item.classList.add('view');
          passwordInput[i].setAttribute('type', 'text');
          item.setAttribute('title', 'Скрыть пароль');
        }
        else {
          item.classList.remove('view');
          passwordInput[i].setAttribute('type', 'password');
          item.setAttribute('title', 'Показать пароль');
        }
      });
    });
  }

  passwordVisibleHide();
});
