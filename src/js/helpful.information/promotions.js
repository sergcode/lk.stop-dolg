'use strict';

/** Функция активирует таб при переходе с одной страницы на другую по ссылке **/
function anchorActiveTab() {
	const tabButtons = document.querySelectorAll('.tab__button, .tab__wrapper, .task__filters .button');
	let taskAccordionBtn = document.querySelectorAll('.task__accordion-btn');

	tabButtons.forEach(elem => {
		let elemId = elem.getAttribute('id'), // Находим ID у табов
				windowLocationHash = window.location.hash.replace(/#/, ''), // Получить хеш адресной строки и удалить #
				tabButtonsMobile = elem.querySelectorAll('.tab__button');

		/* проверяем совпадает ли хеш и id элемента */
		if (windowLocationHash === elemId) {

			if (elem.classList.contains('tab__button')) {

				elem.click(); // Имитируем клик по табу

				window.addEventListener('DOMContentLoaded', fileCopyExtension); // Копируем расширение файла

			} else if (elem.classList.contains('tab__wrapper')) { // Проверка для мобильных кнопок
				tabButtonsMobile.forEach(elemChild => {

					elemChild.click();

					let addScrollBy = setInterval(() => {
						if (elemChild.classList.contains('active')) {
							clearInterval(addScrollBy);
							elemChild.classList.add('animScrollBy');
							elementWithClassAnimScrollBy();
						}
					}, 150);

					window.addEventListener('DOMContentLoaded', fileCopyExtension);
				});
			}

			/* Имитация клика по нужному элементу */
			elem.click();

			taskAccordionBtn.forEach(elemBtn => {
				if (elem.classList.contains('active') && elemId === elemBtn.getAttribute('name')) {
					elemBtn.click();
				}
			});
		}
	});
}

anchorActiveTab();

/** При клике на таб, функция находит расширение файлов и подставляет в пустой тег **/
function getFileExtensionY() {
	const tabButtons = document.querySelectorAll('.tab__button, .tab__wrapper');

	tabButtons.forEach(elem => {
		let tabButtonsMobile = elem.querySelectorAll('.tab__button');

		if (elem.classList.contains('tab__button') && elem.getAttribute('id') === 'promotionsCashback') {
			elem.addEventListener('click', evt => {
				evt.preventDefault();

				fileCopyExtension();
			});

		} else if (elem.classList.contains('tab__wrapper')) { // Проверка для мобильных кнопок
			tabButtonsMobile.forEach(elemChild => {
				elemChild.addEventListener('click', evt => {
					evt.preventDefault();

					fileCopyExtension();
				});
			});
		}
	});
}

getFileExtensionY();

/** Функция ищет расширение в ссылке href **/
function fileCopyExtension() {
	const promotions = document.querySelectorAll('.promotions');

	promotions.forEach(elemParent => {
		let elemHref = elemParent.getAttribute('href'), // Находим адрес ссылки на документ
				extensions = elemHref.split('.').pop(), // Берем расширение без точки
				promotionsFileExtension = elemParent.querySelectorAll('.promotions__file_extension');

		promotionsFileExtension.forEach(elemExt => {
			elemExt.textContent = extensions; // Подставляем расширение без точки в пустой тег
		});
	});
}
