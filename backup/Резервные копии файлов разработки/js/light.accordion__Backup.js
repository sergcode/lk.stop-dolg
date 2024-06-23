'use strict';

const mediaQueryTask = window.matchMedia('(max-width: 991.98px)'),
			mediaQueryTaskSmart = window.matchMedia('(max-width: 440.98px)');

/** Модальное окно об успешной отправке Файлов юристу **/
function createModalSendFileActiveTask(title, subtitle) {
	let toggleModalBg = document.querySelector('.toggle-modal-bg');
	const toggleModal = document.createElement('div');
	toggleModal.classList.add('toggle-modal');
	toggleModal.setAttribute('role', 'dialog');
	toggleModal.setAttribute('data-modal', 'filesSentSuccessfully');
	toggleModal.innerHTML = `
		<div class="toggle-modal__box toggle-modal__box_p-none">
      <div class="toggle-modal__body toggle-modal__body_white toggle-modal__body_pt-sm-50">
        <p class="modal__text modal__text_bold">${title}</p>
        <p class="modal__text modal__text_middle modal__text_light modal__text_grey">${subtitle}</p>
      </div>
    </div>
    <button class="toggle-modal__close toggle-modal__close_sm-green js-modal-close" title="Закрыть" role="button"></button>
	`;

	toggleModalBg.before(toggleModal);
}

const activeAndCloseModal = {
	modalSendFileActiveTask: function () {
		return document.querySelector('.toggle-modal[data-modal="filesSentSuccessfully"]');
	},
	modalBtnClose: function () {
		const close = document.querySelector('.toggle-modal[data-modal="filesSentSuccessfully"] .toggle-modal__close');
		return close.addEventListener('click', activeAndCloseModal.closeModalSendFileActiveTask); // Закрыть модалку кнопкой
	},
	toggleModalBg() {
		return document.querySelector('.toggle-modal-bg');
	},
	activeModalSendFileActiveTask: function () {
		createModalSendFileActiveTask('Файлы успешно отправлены!', 'Задача передана юристу на проверку.');
		activeAndCloseModal.modalSendFileActiveTask().classList.add('active');
		activeAndCloseModal.toggleModalBg().classList.add('active');
		activeAndCloseModal.modalBtnClose();
	},
	activeModalErrorSendFileActiveTask: function () {
		createModalSendFileActiveTask('Ошибка при отправке файлов!', 'Задача не передана юристу на проверку.');
		activeAndCloseModal.modalSendFileActiveTask().classList.add('active', 'errorSend');
		activeAndCloseModal.toggleModalBg().classList.add('active');
		activeAndCloseModal.modalBtnClose();
	},
	closeModalSendFileActiveTask: function () {
		activeAndCloseModal.modalSendFileActiveTask().classList.add('remove');
		activeAndCloseModal.toggleModalBg().classList.add('remove');

		setTimeout(() => {
			activeAndCloseModal.modalSendFileActiveTask().classList.remove('active');
			activeAndCloseModal.modalSendFileActiveTask().classList.remove('remove');
			activeAndCloseModal.toggleModalBg().classList.remove('active');
			activeAndCloseModal.toggleModalBg().classList.remove("remove");
		}, 300);

		if (activeAndCloseModal.modalSendFileActiveTask().classList.contains('errorSend')) {
			activeAndCloseModal.modalSendFileActiveTask().classList.remove('errorSend');
		}
	}
};

/** Создание определенного цвета для отдельных форматов файлов  **/
function formatFiles(extension, elem) {
	switch (extension) {
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'tif':
		case 'bmp':
			elem.classList.add('task__accordion_item__purple');
			break;
		case 'pdf':
			elem.classList.add('task__accordion_item__red');
			break;
		case 'doc':
		case 'docx':
		case 'odt':
		case 'txt':
			elem.classList.add('task__accordion_item__dark-blue');
			break;
		case 'xls':
		case 'xlsx':
			elem.classList.add('task__accordion_item__green');
			break;
		case 'ppt':
		case 'pptx':
			elem.classList.add('task__accordion_item__orange');
			break;
		case 'rar':
		case 'zip':
		case '7z':
		case 'tar':
		case 'arj':
		case 'jar':
			elem.classList.add('task__accordion_item__gold');
			break;
		default:
			elem.classList.add('task__accordion_item__neutral');
			break;
	}
}

/** Функция работает с именем и расширением статичных и динамичных прикрепленных файлов.
 * Находит расширения файлов и подставляет рядом с именами файлов, а в имени файла убирает расширение
 **/
function attachFileCopyExtension() {
	const attachedFiles = document.querySelectorAll('.task__accordion_item--buttons-wrapper ul li a');

	attachedFiles.forEach(elemA => {
		const createdExtension = document.createElement('p'),
				createdNameFile = document.createElement('span'),
				createdDownloadFile = document.createElement('span');

		createdNameFile.classList.add('task__accordion_item--name-file');
		createdDownloadFile.classList.add('task__accordion_item--download-file');
		createdDownloadFile.innerHTML = `
			<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M40.0181 27.1973L25 42.2153L9.98192 27.1973L12.7441 24.435L23.0469 34.7378V0H26.9531V34.7378L37.2559 24.435L40.0181 27.1973ZM50 46.0938H0V50H50V46.0938Z" fill="black"/>
			</svg>
		`;

		let elemAHref = elemA.getAttribute('href'),
				elemAHrefNameFile = decodeURI(elemAHref.split('/').pop()); // Берем имя файла из его полного URL адреса

		if (!elemA.textContent) {
			elemA.prepend(createdExtension);
			elemA.append(createdNameFile);
			elemA.append(createdDownloadFile);
		}

		elemA.querySelectorAll('.task__accordion_item--name-file').forEach(elemSpan => {
			elemSpan.textContent = elemAHrefNameFile;

			let extensionWrapper = elemA.querySelectorAll('p'),
					elemExtensionTextContent = elemSpan.textContent,
					extension = elemExtensionTextContent.split('.').pop(); // Берем расширение без точки

			extensionWrapper.forEach(elem => {
				elem.textContent = extension;

				formatFiles(extension, elem.closest('li'));
			});

			/* Убирает расширение, точку и оставляет только имя файла */
			elemSpan.textContent = elemExtensionTextContent.beforeLastIndex(".");

			/* Вставляем не закодированное имя файла для того, чтобы при скачивании у пользователя файл был с корректным именем */
			elemA.setAttribute("title", `Скачать файл: ${elemAHrefNameFile}`);
			elemA.setAttribute("download", `${elemAHrefNameFile}`);
		});
	});
}

attachFileCopyExtension();

/** Манипуляция с фильтрами Аккордеона **/
function filtersAccordionTask() {
	let accordionsParentBtn = document.querySelectorAll('.task__accordion-btn'),
			filtersAccordion = document.querySelectorAll('.task__filters > .button'),
			thisIdArr = [];

	const resetFilters = document.getElementById('resetFilters');

	/** Аккордеон **/
	accordionsParentBtn.forEach(item => {
		let accordionItemMoreInfo = item.nextElementSibling,
				accordionsParentBtnName = item.getAttribute('name'),
				filtersAccordionActive = [];

		/** Удалить HASH из URL адреса после нажатия на кнопку сброса всех фильтров **/
		const removeHashAfterRebootingPage = () => {
			if (location.hash) {
				history.pushState('', document.title, window.location.pathname);
			}
		}

		/* Сброс всех фильтров и показать все аккордеоны */
		const resetFiltersAndBtn = (elem) => {
			elem.setAttribute('disabled', 'disabled');
			filtersAccordionActive = [];
			thisIdArr = [];

			removeHashAfterRebootingPage();
			item.removeAttribute('style');
			accordionItemMoreInfo.style.display = null;
		};

		/* Манипуляция с фильтрами */
		filtersAccordion.forEach(filters => {

			/* Число задач в фильтре */
			if (filters.getAttribute('id') === accordionsParentBtnName) {
				filters.querySelector('.task__filters_num').textContent = `${item.nextElementSibling.querySelectorAll('.task__accordion-item-btn').length}`;
			}

			/* Манипуляции с фильтром и аккордеоном */
			filters.addEventListener('click', function (evt) {
				evt.preventDefault();

				/* Находим ID каждого фильтра и отправляем его в массив */
				thisIdArr.push(this.getAttribute('id'));

				this.classList.add('active');
				this.setAttribute('disabled', 'disabled');
				item.style.display = 'none';
				accordionItemMoreInfo.style.display = 'none';

				/* Перебирает массив ID нажатых кнопок фильтра и находит по ним нужные кнопки аккордеона */
				thisIdArr.forEach(elemThisIdArr => {
					let accordionParentBtnActive = document.querySelectorAll(`[name="${elemThisIdArr}"]`);

					if (elemThisIdArr === accordionsParentBtnName) {
						accordionParentBtnActive.forEach(elem => {
							let accordionItemMoreInfo = elem.nextElementSibling;

							elem.removeAttribute('style');
							accordionItemMoreInfo.style.display = null;
						});
					}
				});

				if (filters.classList.contains('active')) {
					resetFilters.removeAttribute('disabled');

					/* Отправляем все фильтры с классом ACTIVE в массив */
					filtersAccordionActive.push(filters);

					/* Если все фильтры включены, то показаны все аккордеоны, поэтому логично сбросить их */
					if (filtersAccordionActive.length === accordionsParentBtn.length) {
						filtersAccordionActive.forEach(elem => {
							elem.classList.remove('active');
							elem.removeAttribute('disabled');
						});

						resetFiltersAndBtn(resetFilters);
					}

					/* Кнопка - Сброса всех фильтров и отчистка массива @thisIdArr */
					resetFilters.addEventListener('click', function (evt) {
						evt.preventDefault();
						filters.classList.remove('active');
						filters.removeAttribute('disabled');

						resetFiltersAndBtn(this);
					});
				}
			});
		});
	});
}

filtersAccordionTask();

/** 1. Шаг: Создание пиктограммы "Информация в обработке" при загрузке страницы для разрешения 991.98px **/
function createInfoProcessing() {
	const infoProcessing = document.createElement('span');

	infoProcessing.classList.add('task__accordion_item--info-in-processing');
	infoProcessing.innerHTML = `
	  <svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg">
		    <path fill-rule="evenodd" clip-rule="evenodd" d="M12.2 4.4C11.8 4.4 11.6 4.6 11.6 5V11.8L4.7 14.7C4.4 14.8 4.3 15.2 4.4 15.5C4.5 15.8 4.7 15.9 5 15.9C5.1 15.9 5.2 15.9 5.3 15.8L12.6 12.7C12.9 12.6 13 12.4 13 12.1V5C12.8 4.6 12.6 4.4 12.2 4.4ZM12.2 24.4C5.4 24.4 0 18.9 0 12.2C0 5.4 5.6 0 12.2 0C18.6 0 24.1 5.1 24.4 11.7H31.7C33.1 11.7 34.2 12.8 34.2 14.2V16.1C34.2 16.5 33.9 16.7 33.6 16.7H32.8C32.1 17.9 29.5 22.3 27.2 24.9C26.8 25.4 26.8 26.2 27.2 26.7C29.4 29.3 32.1 33.8 32.8 35H33.7C34.1 35 34.3 35.3 34.3 35.6V38.1C34.3 39.2 33.5 40 32.4 40H16.4C15.3 40 14.5 39.2 14.5 38.1V35.6C14.5 35.2 14.8 35 15.1 35H16C16.7 33.8 19.3 29.4 21.6 26.7C22 26.2 22 25.4 21.6 24.9C20.8 24 20.1 23 19.3 22C17.3 23.6 14.8 24.4 12.2 24.4ZM33 38.1V36.2C28.9 36.2 19.8 36.2 15.8 36.2V38.1C15.8 38.5 16 38.7 16.4 38.7H32.4C32.8 38.8 33 38.5 33 38.1ZM26.2 24.1C28.1 21.9 30.3 18.3 31.3 16.7H17.4C18.4 18.4 20.6 22 22.5 24.1C23.4 25 23.4 26.5 22.5 27.5C20.6 29.7 18.4 33.2 17.4 34.9H31.3C30.3 33.2 28.1 29.6 26.2 27.5C25.3 26.6 25.3 25.1 26.2 24.1ZM33 14.2C33 13.5 32.4 12.9 31.8 12.9H17C16.3 12.9 15.7 13.5 15.7 14.2V15.5C20 15.5 28.6 15.5 32.9 15.5V14.2H33ZM17 11.7C15.6 11.7 14.5 12.8 14.5 14.2V16.1C14.5 16.5 14.8 16.7 15.1 16.7H15.9C16.3 17.4 17.3 19.1 18.6 21C16.9 22.2 14.8 23 12.7 23.1V22.5C12.7 22.1 12.4 21.9 12.1 21.9C11.7 21.9 11.5 22.1 11.5 22.5V23.1C8.9 23 6.6 21.9 4.9 20.3L5.3 19.9C5.6 19.6 5.6 19.3 5.3 19C5 18.7 4.7 18.7 4.4 19L4 19.4C2.4 17.6 1.4 15.3 1.2 12.8H1.8C2.2 12.8 2.4 12.5 2.4 12.2C2.4 11.9 2.1 11.6 1.8 11.6H1.3C1.4 9 2.5 6.7 4.1 4.9L4.5 5.3C4.8 5.6 5.1 5.6 5.4 5.3C5.7 5 5.7 4.7 5.4 4.4L4.9 4.1C6.8 2.4 9 1.4 11.6 1.3V1.9C11.6 2.3 11.9 2.5 12.2 2.5C12.5 2.5 12.8 2.2 12.8 1.9V1.3C15.4 1.4 17.7 2.5 19.4 4L19 4.5C18.7 4.8 18.7 5.1 19 5.4C19.3 5.7 19.6 5.7 19.9 5.4L20.3 5C21.9 6.8 22.9 9.2 23 11.7H17ZM22.2 31.3V32.6C22.2 33 22.5 33.2 22.8 33.2C23.1 33.2 23.4 32.9 23.4 32.6V31.3C23.4 30.9 23.1 30.7 22.8 30.7C22.5 30.7 22.2 30.9 22.2 31.3ZM25.9 33.1C26.3 33.1 26.5 32.8 26.5 32.5V31.2C26.5 30.8 26.2 30.6 25.9 30.6C25.5 30.6 25.3 30.9 25.3 31.2V32.5C25.3 32.8 25.6 33.1 25.9 33.1ZM24.4 21.8C24.8 21.8 25 21.5 25 21.2V19.9C25 19.5 24.7 19.3 24.4 19.3C24 19.3 23.8 19.6 23.8 19.9V21.2C23.8 21.5 24 21.8 24.4 21.8Z" fill="#275957"/>
		</svg>
	  <span>Информация в обработке</span>  
	`;

	return infoProcessing;
}

/** "Инф-я в обработке" - удаление созданных Песочных часов **/
function deleteInfoProcessing(parent) {
	const infoProcessing = parent.querySelectorAll('.task__accordion_item--info-in-processing');

	infoProcessing.forEach(item => {
		item.style.opacity = '0';
		item.remove();
	});
}

/** 2. Шаг: При загрузке добавим каждому заголовку Песочные часы **/
function taskAccordionItemTitle(parent) {
	const taskAccordionItemTitle = parent.querySelector('.task__accordion_item--wrapper-text');

	taskAccordionItemTitle.append(createInfoProcessing());
	createInfoProcessing().style.opacity = '1';
}

/** При нажатии на заголовок дочернего аккордеона создать внутри скрытого дочернего блока "Инф-я в обработке",
 * а из заголовка удалить
 **/
function createInfoProcessingItemInfo(parent) {
	const itemInfo = parent.querySelector('.task__accordion_item--info'),
			itemTextTask = itemInfo.querySelector('.task__accordion_item--text-task');

	itemTextTask.after(createInfoProcessing());
	createInfoProcessing().style.opacity = '1';
}

/** Манипуляции с Родительским аккордеоном **/
function lightAccordionNextElementSibling() {
	let accordionsParentBtn = document.querySelectorAll('.task__accordion-btn'),
			accordionsItemBtnClass = '.task__accordion-item-btn';

	accordionsParentBtn.forEach(item => {
		let accordionItemMoreInfo = item.nextElementSibling,
				accordionsItemBtnAll = accordionItemMoreInfo.querySelectorAll(`${accordionsItemBtnClass}`),
				accordionsParentBtnSpan = item.querySelectorAll('span');

		/* Число задач в родительском аккордеоне */
		accordionsParentBtnSpan.forEach(spanParentBtn => {
			spanParentBtn.textContent = `${accordionsItemBtnAll.length}`;
		});

		/* Манипуляции с родительским аккордеоном */
		item.addEventListener('click', function (evt) {
			evt.preventDefault();

			if (this.nextElementSibling.children.length > 0) {
				this.classList.toggle('is-open');

				let accordionWrapperParent = this.nextElementSibling,
						accordionsItemBtnAll = accordionWrapperParent.querySelectorAll(`${accordionsItemBtnClass}`),
						accordionItemMoreInfoAll = accordionWrapperParent.querySelectorAll('.task__accordion_item--more-info');

				accordionsItemBtnAll.forEach(itemBtn => {
					const wrapperText = itemBtn.querySelector('.task__accordion_item--wrapper-text'),
							wrapperTextChildDeadline = wrapperText.lastElementChild.classList.contains('task__accordion_item--info-in-processing');

					if (this.matches('[name="onCheckTask"]')) {
						if (mediaQueryTask.matches && this.classList.contains('is-open') && !wrapperTextChildDeadline) {
							taskAccordionItemTitle(itemBtn);
						}
					}
				});

				if (accordionWrapperParent.style.maxHeight) {
					accordionWrapperParent.style.maxHeight = null;

					accordionsItemBtnAll.forEach(elem => {
						if (elem.classList.contains('is-open')) {
							elem.classList.remove('is-open');
						}
					});

					accordionItemMoreInfoAll.forEach(elem => {
						if (elem.style.maxHeight) {
							elem.style.maxHeight = null;
						}

						/** 3. Шаг: Ищем родителя onCheckTask, убеждаемся, что нет класса is-open, убеждаемся, что нет класса is-open у дочерней кнопки **/
						if (mediaQueryTask.matches && this.matches('[name="onCheckTask"]') && !this.classList.contains('is-open')) {
							deleteInfoProcessing(elem);
						}
					});

				} else {
					accordionWrapperParent.style.maxHeight = accordionWrapperParent.scrollHeight + "px";
				}
			}
		});
	});
}

lightAccordionNextElementSibling();

/** Манипуляции с дочерним аккордеоном **/
function childAccordionTask() {
	let moreInfoParent = document.querySelectorAll('.task__accordion_wrapper');

	moreInfoParent.forEach(parent => {
		parent.onclick = function (event) {
			let accordionsItemBtn = event.target.closest('.task__accordion-item-btn');

			if (!accordionsItemBtn) return;
			if (!parent.contains(accordionsItemBtn)) return;

			accordionsItemBtnIsOpen(accordionsItemBtn);
		}

		function accordionsItemBtnIsOpen(accordionsItemBtn) {
			const accordionItemMoreInfo = accordionsItemBtn.nextElementSibling,
					accordionItemMoreInfoChild = accordionItemMoreInfo.querySelector('.task__accordion_item--more-wrapper');

			/* Проверка, что родительский блок "Задачи на проверке у юриста" */
			const onCheckTaskTrue = accordionsItemBtn.closest('.task__accordion_wrapper').previousElementSibling.matches('[name="onCheckTask"]');

			attachFileCopyExtension();

			accordionsItemBtn.classList.toggle('is-open');

			if (accordionItemMoreInfo.style.maxHeight) {
				accordionItemMoreInfo.style.maxHeight = null;

			} else {
				accordionItemMoreInfo.style.maxHeight = accordionItemMoreInfo.scrollHeight + accordionItemMoreInfoChild.scrollHeight + 'px';
				accordionItemMoreInfo.parentElement.style.maxHeight = accordionItemMoreInfo.parentElement.scrollHeight + accordionItemMoreInfo.scrollHeight + 'px';
			}

			if (accordionItemMoreInfo.previousElementSibling.classList.contains('is-unread')) {
				accordionItemMoreInfo.previousElementSibling.classList.remove('is-unread');
			}

			/* Проверка при перезагрузке страницы, если размер экрана 991.98px и родительская кнопка onCheckTask */
			if (mediaQueryTask.matches && onCheckTaskTrue) {
				const accordionsItemBtnIsOpenTrue = accordionsItemBtn.classList.contains('is-open'),
						wrapperText = accordionsItemBtn.querySelector('.task__accordion_item--wrapper-text');

				/* Расположить "Инф. в обработке" внутри скрытого дочернего блока */
				if (accordionsItemBtnIsOpenTrue && !accordionItemMoreInfo.querySelector('.task__accordion_item--info-in-processing') && wrapperText.lastElementChild.classList.contains('task__accordion_item--info-in-processing')) {
					wrapperText.lastElementChild.style.opacity = '0';
					wrapperText.lastElementChild.remove();
					createInfoProcessingItemInfo(accordionItemMoreInfo);

				} else if (!accordionsItemBtnIsOpenTrue && !wrapperText.lastElementChild.classList.contains('task__accordion_item--info-in-processing')) { // Расположить "Инф. в обработке" под заголовком задачи
					deleteInfoProcessing(accordionItemMoreInfo);
					taskAccordionItemTitle(accordionsItemBtn);
				}
			}
		}
	});
}

childAccordionTask();

/** События после нажатия на кнопку "Отправить файлы" в Активных задачах **/
/** Функция работает в реальном времени и с динамичными действиями для статичной
 * информации и блоков есть другие функции
 **/
function sendFilesActiveTask() {
	let accordionsParentBtn = document.querySelectorAll('.task__accordion-btn'),
			toggleModalBg = document.querySelector('.toggle-modal-bg'),
			onCheckTask = document.querySelector('.task__accordion-btn[name="onCheckTask"]'),
			onCheckTaskNextWrapper = onCheckTask.nextElementSibling,
			filtersAccordion = document.querySelectorAll('.task__filters > .button');

	accordionsParentBtn.forEach(parentBtn => {
		let accordionsParentBtnSpan = parentBtn.querySelectorAll('span'),
				accordionsParentBtnName = parentBtn.getAttribute('name'),
				accordionItemMoreInfo = parentBtn.nextElementSibling,
				accordionsItemBtn = accordionItemMoreInfo.querySelectorAll('.task__accordion-item-btn'), // Находим все задачи ItemBtn;
				parentBtnOnCheckTask = accordionItemMoreInfo.nextElementSibling;

		accordionsItemBtn.forEach(itemBtn => {

			/* Находим в Активных задачах кнопки Отправить файлы */
			let taskAddFile = itemBtn.nextElementSibling.querySelectorAll('form.task__add-file');

			taskAddFile.forEach(elemForm => {
				elemForm.addEventListener('submit', function (event) {
					event.preventDefault();

					const sendBtn = this.querySelector('button.attach__button .button');
					sendBtn.textContent = 'Подождите!';

					let xhr = new XMLHttpRequest();
					xhr.open("POST", "/assets/ajax.php");

					let thisElem = this,
							btnSendFiles = thisElem.querySelector('.attach__button[name="taskAccordionAttach"]'),
							moreInfoAttachNameFile = itemBtn.nextElementSibling.querySelectorAll('.attach__item--attached .attach__name'),
							fdf = new FormData(elemForm);

					fdf.append('action', 'sendFormFiles');

					if (!btnSendFiles.hasAttribute('disabled')) {
						xhr.addEventListener('load', () => {
							if (xhr.status === 200) {
								console.log(xhr.response);
								sendBtn.textContent = 'Файлы отправлены!';
								accordionsParentBtnSpan.forEach(spanParentBtn => {
									spanParentBtn.textContent--;
								});

								filtersAccordion.forEach(filters => {

									/* Число задач в фильтре у "Активных задач" уменьшаем на 1 */
									if (filters.getAttribute('id') === accordionsParentBtnName) {
										filters.querySelector('.task__filters_num').textContent--;
									}
								});

								/* Число задач в аккордеоне у "Задачи на проверке у юриста" увеличиваем на 1 */
								if (parentBtnOnCheckTask.getAttribute('name') === 'onCheckTask') {
									parentBtnOnCheckTask.querySelector('span').textContent++;

									filtersAccordion.forEach(filters => {

										/* Число задач в фильтре у "Задачи на проверке у юриста" увеличиваем на 1 */
										if (filters.getAttribute('id') === parentBtnOnCheckTask.getAttribute('name')) {
											filters.querySelector('.task__filters_num').textContent++;
										}
									});
								}

								itemBtn.classList.remove('is-open');
								itemBtn.classList.add('filesPosted'); // Присваиваем класс, чтобы скрыть кнопку ItemBtn и блок с информацией

								if (itemBtn.nextElementSibling.hasAttribute('style')) {
									itemBtn.nextElementSibling.removeAttribute('style'); // Уменьшаем высоту блока с информацией
								}

								/* Клонируем скрытые элементы */
								let itemClone = itemBtn.cloneNode(true),
										moreInfoClone = itemBtn.nextElementSibling.cloneNode(true);

								/* Заменяем блок с кнопками отправки файлов новой разметкой */
								moreInfoClone.querySelector('.task__accordion_item--buttons').innerHTML = `
									<div class="task__accordion_item--buttons-wrapper">
			              <ul>
			                <li>Прикреплённые файлы:</li>
			              </ul>
			            </div>
								`;

								let moreInfoCloneButtonsWrapperUl = moreInfoClone.querySelector('.task__accordion_item--buttons-wrapper ul');

								/* Обернуть каждый добавленный файл в ссылку, чтобы можно было его скачать */
								moreInfoAttachNameFile.forEach(attachName => {
									let nameFile = attachName.textContent, // Имя прикрепленного файла
											extensionFile = attachName.parentElement.querySelector('p').textContent, // Расширение прикрепленного файла
											createAttachedFile = document.createElement('li'); // Обертка для ссылки

									/* Здесь можно поменять путь до загруженных файлов на сервере */
									createAttachedFile.innerHTML = `
										<a href="/assets/photo/${nameFile}.${extensionFile}" title="Скачать файл" role="button" download></a>
									`;

									/* Создать <li></li> равное количеству прикрепленных файлов */
									moreInfoCloneButtonsWrapperUl.append(createAttachedFile);
								});

								/* Если разрешение 991px, то создать у клонированных блоков песочные часы "Информация в обработке" */
								if (mediaQueryTask.matches) {
									taskAccordionItemTitle(itemClone);
								}

								/* Удаляем, через 500ms, из DOM кнопку ItemBtn */
								setTimeout(() => {
									itemBtn.remove();
								}, 400);

								/* Удаляем, через 499ms, из DOM блока с информацией */
								setTimeout(() => {
									itemBtn.nextElementSibling.remove();
								}, 399);

								/** Начало. Показать сообщение об успешно отправленных файлах юристу **/
								setTimeout(() => {
									activeAndCloseModal.activeModalSendFileActiveTask();
								}, 400);

								toggleModalBg.addEventListener('click', activeAndCloseModal.closeModalSendFileActiveTask); // Закрыть модалку кликом по фону
								/** Конец. Показать сообщение об успешно отправленных файлах юристу **/

								/* Проверяем, что родитель является "Задачи на проверке у юриста" */
								if (onCheckTask) {
									onCheckTaskNextWrapper.prepend(itemClone); // Вставляем клонированные элементы в подраздел Задача на проверке у юриста

									let taskAccordionItemBtn = onCheckTaskNextWrapper.querySelectorAll('.task__accordion-item-btn'),
											accordionItemMoreInfo = onCheckTaskNextWrapper.querySelectorAll('.task__accordion_item--more-info');

									taskAccordionItemBtn.forEach(elem => {
										let taskAccordionItemRightElements = elem.querySelectorAll('.task__accordion_item--right-elements');

										/* Удалить класс после того, как добавлена новая задача на проверку юристу */
										if (elem.classList.contains('filesPosted')) {
											setTimeout(() => elem.classList.remove('filesPosted'), 100);
										}

										/* Создать песочные часы для клонированного блока */
										taskAccordionItemRightElements.forEach(elem => {
											if (!elem.querySelector('.task__accordion_item--info-in-processing')) {
												elem.prepend(createInfoProcessing());
												createInfoProcessing().style.opacity = '1';
											}
										});
									});

									/* Если родительский аккордеон открыт, то подогнать высоту при добавлении новых задач на проверку */
									if (onCheckTask.classList.contains('is-open')) {
										accordionItemMoreInfo.forEach(elem => {
											elem.parentElement.style.maxHeight = elem.parentElement.scrollHeight + elem.scrollHeight + 'px';
										});
									}

									/* Добавить каждой новой клонированной задаче скрытый блок с инфой */
									onCheckTaskNextWrapper.firstChild.after(moreInfoClone);
								}

							} else {
								/** Начало. Показать сообщение о неуспешно отправленных файлах юристу **/
								activeAndCloseModal.activeModalErrorSendFileActiveTask();

								toggleModalBg.addEventListener('click', activeAndCloseModal.closeModalSendFileActiveTask); // Закрыть модалку кликом по фону
								/** Конец. Показать сообщение о неуспешно отправленных файлах юристу **/
							}
						});

						xhr.send(fdf);
					}
				});
			});
		});
	});
}

sendFilesActiveTask();

/** Манипуляции с кнопками закрытия дочерних аккордеонов **/
function btnCloseChildAccordion() {
	const accordionItemMoreInfoCloseBtn = document.querySelectorAll('.task__accordion_item--close-info');

	accordionItemMoreInfoCloseBtn.forEach(closeInfoBtn => {
		closeInfoBtn.addEventListener('click', function (evt) {
			evt.preventDefault();

			const accordionsItemBtn = this.closest('.task__accordion-item-btn'),
					accordionItemMoreInfo = accordionsItemBtn.nextElementSibling,
					onCheckTaskTrue = this.closest('.task__accordion_wrapper').previousElementSibling.matches('[name="onCheckTask"]');

			if (mediaQueryTask.matches && onCheckTaskTrue) {

				/* Расположить "Инф. в обработке" внутри скрытого дочернего блока */
				if (accordionsItemBtn.classList.contains('is-open')) {
					deleteInfoProcessing(accordionsItemBtn);
					createInfoProcessingItemInfo(accordionItemMoreInfo);

				} else { // Расположить "Инф. в обработке" под заголовком задачи
					deleteInfoProcessing(accordionItemMoreInfo);
					taskAccordionItemTitle(accordionsItemBtn);
				}
			}
		}, false);
	});
}

btnCloseChildAccordion();

/** События при изменении размера экрана на смартфонах **/
function handleOrientationChangeSmartphone(mqts) {
	let accordionsParentBtn = document.querySelectorAll('.task__accordion-btn');

	accordionsParentBtn.forEach(elemParent => {

		let itemMoreInfo = elemParent.nextElementSibling.querySelectorAll('.task__accordion_item--more-info');

		itemMoreInfo.forEach(item => {
			let itemMoreInfoWrapper = item.querySelector('.task__accordion_item--more-wrapper');

			const fitHeight = () => {

				/* Если дочерний аккордеон был открыт в горизонтальной ориентации, то при изменении ориентации нужно пересчитать высоту родительского блока, чтобы все элементы были видны */
				if (item.parentElement.style.maxHeight) {
					item.parentElement.style.maxHeight = item.parentElement.scrollHeight + item.scrollHeight + "px";
				}

				/* Если в горизонтальной ориентации у скрытого блока была изменена высота, то в портретной нужно подогнать высоту, чтобы все элементы были видны */
				if (item.style.maxHeight) {
					item.style.maxHeight = item.scrollHeight + itemMoreInfoWrapper.scrollHeight + "px";
				}
			};

			/** Выполнить условия, если разрешение <= 440.98 **/
			(mqts.matches) ? fitHeight() : fitHeight();
		});
	});
}

handleOrientationChangeSmartphone(mediaQueryTaskSmart);
mediaQueryTaskSmart.addEventListener('change', handleOrientationChangeSmartphone);

/** События при изменении размера экрана на планшетах **/
function handleOrientationChange(mqt) {
	let accordionsParentBtn = document.querySelectorAll('.task__accordion-btn');

	accordionsParentBtn.forEach(elemParent => {

		let accordionsItemBtn = elemParent.nextElementSibling.querySelectorAll('.task__accordion-item-btn');

		accordionsItemBtn.forEach(itemBtn => {
			let itemBtnClassIsOpenTrue = itemBtn.classList.contains('is-open');

			const wrapperText = itemBtn.querySelector('.task__accordion_item--wrapper-text'),
					wrapperTextChildDeadline = wrapperText.lastElementChild.classList.contains('task__accordion_item--info-in-processing'),
					itemBtnMoreInfo = itemBtn.nextElementSibling;

			let moreInfoProcess = itemBtnMoreInfo.querySelector('.task__accordion_item--info-in-processing');

			/** Выполнить условия при портретной ориентации **/
			if (mqt.matches) {

				if (elemParent.matches('[name="onCheckTask"]')) {

					/* Если у дочернего аккордеона есть класс is-open и в дочернем скрытом блоке нет "Инф-я в обработке" */
					if (itemBtnClassIsOpenTrue && !moreInfoProcess) {
						createInfoProcessingItemInfo(itemBtnMoreInfo); // Затем вставить "Инф-я в обработке" в дочерний скрытый блок

					} else if (!itemBtnClassIsOpenTrue && !wrapperTextChildDeadline) { // Если у дочернего аккордеона нет класса is-open и у дочернего аккордеона нет в заголовке "Инф-я в обработке"
						deleteInfoProcessing(itemBtnMoreInfo); // То удалить "Инф-я в обработке" у дочернего скрытого блока
						taskAccordionItemTitle(itemBtn); // Затем вставить "Инф-я в обработке" под заголовок дочернего аккордеона
					}
				}

				/* Если дочерний аккордеон был открыт в горизонтальной ориентации, то при изменении ориентации нужно пересчитать высоту родительского блока, чтобы все элементы были видны */
				if (itemBtnMoreInfo.parentElement.style.maxHeight) {
					itemBtnMoreInfo.parentElement.style.maxHeight = itemBtnMoreInfo.parentElement.scrollHeight + itemBtnMoreInfo.scrollHeight + "px";
				}

				if (itemBtnMoreInfo.style.maxHeight) {
					itemBtnMoreInfo.style.maxHeight = itemBtnMoreInfo.scrollHeight + itemBtnMoreInfo.querySelector('.task__accordion_item--more-wrapper').scrollHeight + "px";
				}

			} else {

				if (elemParent.matches('[name="onCheckTask"]')) {

					/** Выполнить условия при горизонтальной ориентации **/
					if (wrapperTextChildDeadline) {
						wrapperText.lastElementChild.style.opacity = '0';
						wrapperText.lastElementChild.remove();

					} else if (moreInfoProcess) {
						deleteInfoProcessing(itemBtnMoreInfo);
					}
				}
			}
		});
	});
}

handleOrientationChange(mediaQueryTask);
mediaQueryTask.addEventListener('change', handleOrientationChange);
