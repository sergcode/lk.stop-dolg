"use strict";

/**
* Кнопка Показать или скрыть пароль
* Создан 17.11.2022
*/

function showHidePassword() {
	const eyesToggle = document.querySelectorAll('button[name="passwordShowHide"]');

	if (eyesToggle) {
		for (let eyeToggle of eyesToggle) {
			eyeToggle.addEventListener('click', function (e) {
				e.preventDefault();

				const thisEye = this,
							inputPassword = thisEye.parentElement.querySelector('input');

				if (inputPassword.type === "password") {
					thisEye.classList.add('view');
					thisEye.setAttribute('title', 'Скрыть пароль');
					inputPassword.setAttribute('type', 'text');

				} else {
					thisEye.classList.remove('view');
					thisEye.setAttribute('title', 'Показать пароль');
					inputPassword.setAttribute('type', 'password');
				}
			});
		}
	}
}

showHidePassword();
