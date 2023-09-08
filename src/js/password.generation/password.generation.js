"use strict";

/**
 * Функция генерирует рандомный пароль из 8 символов.
 * Создан 18.11.2022
 */

window.addEventListener('DOMContentLoaded', () => {
	const inputPassword = document.querySelector('.password-input');

	document.body.addEventListener('click', e => changePassword(e));

	function changePassword(evt) {
		const target = evt.target;

		if (target && target.matches('#input-generate')) {
			evt.preventDefault();
			inputPassword.value = '';
			const pass = generatePassword(),
					txt = pass.split(""),
					interval = setInterval(() => {
						if (!txt[0]) {
							clearInterval(interval);
						} else {
							inputPassword.value = `${inputPassword.value + txt.shift()}`;
							if (inputPassword.parentElement.classList.contains('error')) {
								errorMessageRemoveClass(inputPassword)
							}
						}
					}, 40);

			return false;
		}
	}

	function generatePassword() {
		const passwordLength = document.querySelector('.login__password-length').value,
				length = +passwordLength,
				charset = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$%";

		if (window.crypto && window.crypto.getRandomValues) {
			return Array(length)
					.fill(charset)
					.map(x => x[Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * (x.length + 1))])
					.join('');

		} else {
			let res = '';
			for (let i = 0, n = charset.length; i < length; ++i) {
				res += charset.charAt(Math.floor(Math.random() * n));
			}
			return res;
		}
	}

	function errorMessageRemoveClass(input) {
		const inputContainers = input.parentElement,
				errorMessage = inputContainers.querySelector('.login__error');
		errorMessage.classList.add('hide');
		setTimeout(() => {
			errorMessage.classList.remove('active');
			errorMessage.classList.remove('hide');
		}, 100);
		inputContainers.classList.remove('error');
	}
});

