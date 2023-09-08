'use strict';

/** Конструктор регулярного выражения **/
function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

/** Функция проверки существования cookies **/
function showBlockIfNotCookies() {
	const closeBtn = document.querySelectorAll('[name="closeElement"]');

	if (closeBtn) {
		closeBtn.forEach(elemBtn => {
			const alertWin = getCookie(`${elemBtn.previousElementSibling.classList[0]}`);

			if (alertWin !== 'no') {
				elemBtn.closest(`.${elemBtn.parentElement.classList[0]}`).style.display = 'block';
			}

			// Записать cookies, если баннер был закрыт, чтобы больше его не показывать пользователю
			closeElement(true, saveCookies);
		});
	}
}

showBlockIfNotCookies();

/** Функция записи cookies, аргумент принимает класс нажатой кнопки закрытия **/
function saveCookies(prevElement) {
	let date = new Date;
	date.setDate(date.getDate() + 1);

	// Ищем предыдущий элемент и его уникальный класс, чтобы использовать для имени cookies
	document.cookie = `${prevElement.previousElementSibling.classList[0]}=no; path=/; expires=` + date.toUTCString();
}
