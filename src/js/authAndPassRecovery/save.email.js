"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const inputEmail = document.querySelector('input[name="username"]'),
			regularEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
			forgotYourPassword = document.querySelector('.login__link'),
			recoverPassword = document.querySelector('#office-auth-login .login__button'),
			arrClickElem = [forgotYourPassword, recoverPassword],
			saveEmail = localStorage.getItem('userEmail');

	/** Если в локальном хранилище есть ключ "userEmail" со значением,
      то подставить в поле email значение ключа, т.е. введенный клиентом email
	 **/
	if (saveEmail) inputEmail.value = `${saveEmail}`;

	/** Прослушать введенный email, проверить на корректность, проверить есть ли в локальном хранилище ключ с введенным email'ом
	 * если email корректный, в локальном хранилище нет ключа "userEmail" или есть, то сохранить или изменить в локальном хранилище значение ключа. **/
	inputEmail.addEventListener('input', (e) => {
		arrClickElem.forEach(elem => {
			if (elem) {
				elem.addEventListener('click', () => {
					if (e.target.value.length > 0 && regularEmail.test(e.target.value) && !saveEmail || saveEmail) {
						localStorage.setItem('userEmail', `${e.target.value}`);
					}
				});
			}
		});
	});
})
