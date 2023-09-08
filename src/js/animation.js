'use strict';

/**
 * Компонент для анимированного закрытия любого блока с помощью функции - FadeOutUp, но не модалки
 * У Callback - функции есть два аргумента Boolean и обратный вызов функции
 **/
function closeElement(event, callback) {
	const closeBtn = document.querySelectorAll('[name="closeElement"]');

	closeBtn.forEach(elemBtn => {
		elemBtn.addEventListener('click', function (evt) {
			evt.preventDefault();

			if (event) {
				fadeOutUp(this.parentElement); // Находим первый в списке класс родителя кнопки закрытия
				callback(this); // Передаем класс нажатой кнопки закрытия в функцию saveCookies
			}
		});
	});
}

/** FadeOut - анимация исчезновения **/
function fadeOut(elem) {
	let opacity = 1;

	let timer = setInterval(function () {
		if (opacity <= 0.1) {
			clearInterval(timer);
		}

		document.querySelector(elem).style.position = "absolute";
		document.querySelector(elem).style.opacity = opacity;
		document.querySelector(elem).style.display = "none";
		opacity -= opacity * 0.1;

	}, 10);
}

/** FadeIn - анимация появления **/
function fadeIn(elem) {
	let opacity = 0.01;

	let timer = setInterval(function () {
		if (opacity >= 1) {
			clearInterval(timer);
		}

		document.querySelector(elem).style.display = "block";
		document.querySelector(elem).style.opacity = opacity;
		opacity += opacity * 0.1;

	}, 10);
}

/** FadeOutUp - анимация исчезновения вверх **/
function fadeOutUp(elem) {
	let opacity = 1;
	let timer = setInterval(() => {

		if (opacity <= 0.1) {
			clearInterval(timer);
			elem.style.display = 'none';
		}

		elem.style.opacity = opacity;
		elem.style.transform = 'translate3d(0, -40%, 0)';
		opacity -= opacity * 0.1;

	}, 10);
}

/** AnimScrollBy - компонент для анимации прокрутки к активному элементу **/
function animScrollBy(elem) {
	window.scrollBy({
		top: elem.getBoundingClientRect().top - 15,
		behavior: 'smooth'
	});
}

/** ElementWithClassAnimScrollBy - компонент для анимации прокрутки к элементу с классом - animScrollBy **/
function elementWithClassAnimScrollBy() {
	const classAnimScrollBy = document.querySelector('.animScrollBy');

	if (classAnimScrollBy) {
		animScrollBy(classAnimScrollBy);
	}
}

elementWithClassAnimScrollBy();
