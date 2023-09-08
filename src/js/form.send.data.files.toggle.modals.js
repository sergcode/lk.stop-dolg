"use strict";

/** Добавление файлов **/
window.addEventListener('DOMContentLoaded', () => {
	const mediaQueryTaskSmart = window.matchMedia('(max-width: 440.98px)');

	let filesArr = [], // Массив для отправки файлов на почту
			newFiles = [], // Вспомогательный массив для первого массива, нужен чтобы найти дубликаты файлов
			duplicateFiles = [], // Массив дубликатов файлов
			deleteFiles = [], // Массив удаленных при замене дубликатов файлов. Нужен, чтобы восстановить первоначальные значения в первом массиве.
			deleteNewFiles = [], // Массив удаленных при пропуске дубликатов файлов. Нужен, чтобы восстановить первоначальные значения во втором массиве.
			num = 1; // Счетчик. Сравнивает число замененных или пропущенных файлов с количеством дубликатов файлов

	const toggleModalOverlay = document.createElement('div'),
				toggleModalOverlayWarning = document.createElement('div');
	toggleModalOverlay.classList.add('toggle-modal-bg', 'js-overlay-modal');
	toggleModalOverlayWarning.classList.add('toggle-modal-bg', 'toggle-modal-bg__warning');
	document.body.append(toggleModalOverlay, toggleModalOverlayWarning);

	/** todo Создать прелоадер при отправке письма **/
	function createdPreloader(form) {
		const createdPreloader = document.createElement("div");
		createdPreloader.classList.add('form-modal__sending');
		createdPreloader.innerHTML = `
      <article role="article">
        <figure>
          <div class="preloader__row">
            <div class="preloader__item"></div>
            <div class="preloader__item"></div>
          </div>
          <figcaption class="form-modal__sending_status">Сообщение отправляется, <br>подождите!</figcaption>
        </figure>
      </article>
    `;

		form.parentElement.append(createdPreloader);
	}

	/** todo Создать предупреждение при дублировании файлов с предложением Замены или Пропуска фалов */
	function createdWarningModal() {
		const warning = document.createElement('div');
		warning.classList.add('toggle-modal', 'toggle-modal__warning');
		warning.setAttribute('role', 'dialog');
		warning.innerHTML = `
			<div class="toggle-modal__box toggle-modal__box_p-none">
				<div class="toggle-modal__body toggle-modal__body_pt-sm-50">
					<p class="modal__text modal__text_uppercase">Замена или пропуск файлов</p>
					<p class="modal__text modal__text_bold" data-number-file></p>
					<p class="modal__text" data-file-name></p>
					<p class="modal__text modal__text_middle modal__text_light modal__text_grey" data-warning-subtitle></p>
					<div class="modal__buttons modal__buttons_d-flex">
						<button class="button button--green" data-action="replaceFile" title="Замена" role="button"></button>
						<button class="button button--green" data-action="skipFile" title="Пропуск" role="button"></button>
						<button class="button button--green" data-action="requestForEachFile" role="button"></button>
						<button class="button button--green" data-action="cancel" role="button"></button>
					</div>
				</div>
			</div>
			<button class="toggle-modal__close toggle-modal__close_sm-green" data-action="warningClose" title="Закрыть" role="button"></button>
			`;
		document.body.append(warning);
	}
	createdWarningModal();

	/** todo Файлы обновлены */
	function createdModalFileUpdated() {
		const parent = document.createElement('div');
		parent.classList.add('toggle-modal', 'toggle-modal__small', 'toggle-modal__file-updated');
		parent.setAttribute('role', 'dialog');
		parent.innerHTML = `
			<div class="toggle-modal__box toggle-modal__box_p-none">
        <div class="toggle-modal__body toggle-modal__body_white toggle-modal__body_pt-sm-50">
            <article role="article">
                <figure>
                    <div class="toggle-modal__file-updated_wrapper">
										  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
											\t viewBox="0 0 98.5 98.5" enable-background="new 0 0 98.5 98.5" xml:space="preserve">
											  <path class="checkmark" fill="none" stroke-width="8" stroke-miterlimit="10" d="M81.7,17.8C73.5,9.3,62,4,49.2,4
											\tC24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3"/>
											</svg>
										</div>
                    <figcaption class="toggle-modal__text toggle-modal__title">
                        Файлы обновлены
                    </figcaption>
                </figure>
            </article>
        </div>
    	</div>
		`;

		document.body.append(parent);
	}
	createdModalFileUpdated();

	/** todo Кнопка Удаления всех файлов */
	function createdBtnDeleteAllFiles(wrapperSearchCreatedFiles) {
		const btn = document.createElement('button');
		btn.classList.add('attach__delete-files', 'hide');
		btn.setAttribute('type', 'button');
		btn.setAttribute('role', 'button');
		btn.innerHTML = `
			<svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M5.1875 6.1875C5.33668 6.1875 5.47976 6.24676 5.58525 6.35225C5.69074 6.45774 5.75 6.60082 5.75 6.75V13.5C5.75 13.6492 5.69074 13.7923 5.58525 13.8977C5.47976 14.0032 5.33668 14.0625 5.1875 14.0625C5.03832 14.0625 4.89524 14.0032 4.78975 13.8977C4.68426 13.7923 4.625 13.6492 4.625 13.5V6.75C4.625 6.60082 4.68426 6.45774 4.78975 6.35225C4.89524 6.24676 5.03832 6.1875 5.1875 6.1875V6.1875ZM8 6.1875C8.14918 6.1875 8.29226 6.24676 8.39775 6.35225C8.50324 6.45774 8.5625 6.60082 8.5625 6.75V13.5C8.5625 13.6492 8.50324 13.7923 8.39775 13.8977C8.29226 14.0032 8.14918 14.0625 8 14.0625C7.85082 14.0625 7.70774 14.0032 7.60225 13.8977C7.49676 13.7923 7.4375 13.6492 7.4375 13.5V6.75C7.4375 6.60082 7.49676 6.45774 7.60225 6.35225C7.70774 6.24676 7.85082 6.1875 8 6.1875V6.1875ZM11.375 6.75C11.375 6.60082 11.3157 6.45774 11.2102 6.35225C11.1048 6.24676 10.9617 6.1875 10.8125 6.1875C10.6633 6.1875 10.5202 6.24676 10.4148 6.35225C10.3093 6.45774 10.25 6.60082 10.25 6.75V13.5C10.25 13.6492 10.3093 13.7923 10.4148 13.8977C10.5202 14.0032 10.6633 14.0625 10.8125 14.0625C10.9617 14.0625 11.1048 14.0032 11.2102 13.8977C11.3157 13.7923 11.375 13.6492 11.375 13.5V6.75Z" fill="black"/>
				<path fill-rule="evenodd" clip-rule="evenodd" d="M15.3125 3.375C15.3125 3.67337 15.194 3.95952 14.983 4.1705C14.772 4.38147 14.4859 4.5 14.1875 4.5H13.625V14.625C13.625 15.2217 13.3879 15.794 12.966 16.216C12.544 16.6379 11.9717 16.875 11.375 16.875H4.625C4.02826 16.875 3.45597 16.6379 3.03401 16.216C2.61205 15.794 2.375 15.2217 2.375 14.625V4.5H1.8125C1.51413 4.5 1.22798 4.38147 1.017 4.1705C0.806026 3.95952 0.6875 3.67337 0.6875 3.375V2.25C0.6875 1.95163 0.806026 1.66548 1.017 1.4545C1.22798 1.24353 1.51413 1.125 1.8125 1.125H5.75C5.75 0.826631 5.86853 0.540483 6.07951 0.329505C6.29048 0.118526 6.57663 0 6.875 0L9.125 0C9.42337 0 9.70952 0.118526 9.92049 0.329505C10.1315 0.540483 10.25 0.826631 10.25 1.125H14.1875C14.4859 1.125 14.772 1.24353 14.983 1.4545C15.194 1.66548 15.3125 1.95163 15.3125 2.25V3.375ZM3.63275 4.5L3.5 4.56638V14.625C3.5 14.9234 3.61853 15.2095 3.82951 15.4205C4.04048 15.6315 4.32663 15.75 4.625 15.75H11.375C11.6734 15.75 11.9595 15.6315 12.1705 15.4205C12.3815 15.2095 12.5 14.9234 12.5 14.625V4.56638L12.3672 4.5H3.63275ZM1.8125 3.375V2.25H14.1875V3.375H1.8125Z" fill="black"/>
			</svg>
			
			Удалить все
		`;
		wrapperSearchCreatedFiles.prepend(btn);
	}

	/** todo Создание определенного цвета для отдельных форматов файлов */
	function colorExtensionsFiles(extension) {
		let color;

		switch (extension) {
			case 'jpg': case 'jpeg': case 'png': case 'tif': case 'bmp': case 'gif':
				color = 'attach__file_wrapper__purple';
				break;
			case 'pdf':
				color = 'attach__file_wrapper__red';
				break;
			case 'doc': case 'docx': case 'odt': case 'txt':
				color = 'attach__file_wrapper__dark-blue';
				break;
			case 'xls': case 'xlsx':
				color = 'attach__file_wrapper__green';
				break;
			case 'ppt': case 'pptx':
				color = 'attach__file_wrapper__orange';
				break;
			case 'rar': case 'zip': case '7z': case 'tar': case 'arj': case 'jar':
				color = 'attach__file_wrapper__gold';
				break;
			default:
				color = 'attach__file_wrapper__neutral';
				break;
		}
		return color;
	}

	/** todo Прикрепленный файл */
	function createAttachFile(fileName, fileExtension, colorExtension) {
		const attachFile = document.createElement('div');
		attachFile.classList.add('attach__file', 'attach__item--attached');
		attachFile.innerHTML = `	
			<div class="attach__file_wrapper ${colorExtension}">
				<p>${fileExtension}</p>
				<div class="attach__name">${fileName}</div>
			</div>
		  <button class="attach__delete" title="Удалить файл" role="button"></button>
		`;

		return attachFile;
	}

	/** todo Убирает расширение, точку и оставляет только имя файла */
	function nameFilesAttach() {
		String.prototype.beforeLastIndex = function (delimiter) {
			return this.substr(0, this.lastIndexOf(delimiter)) || this + ""
		}
	}

	const modalButtons = document.querySelectorAll('.js-open-modal'),
			overlay = document.querySelector('.js-overlay-modal'),
			overlayWarning = document.querySelector('.toggle-modal-bg__warning'),
			closeButtons = document.querySelectorAll('.js-modal-close'),
			forms = document.querySelectorAll('form'),
			toggleModals = document.querySelectorAll('.toggle-modal'),
			toggleModalsBox = document.querySelectorAll('.toggle-modal__box'),
			toggleModalWarning = document.querySelector('.toggle-modal__warning'),
			toggleModalWarningButtons = toggleModalWarning.querySelectorAll('button'),
			toggleModalFileUpdated = document.querySelector('.toggle-modal__file-updated'),
			tabButton = document.querySelector('button.tab__button[data-modal]'),
			wrapperBtnDeleteFiles = document.querySelectorAll('.attach__delete-files');

	let toggleModalWarningNumbFile = document.querySelector('p[data-number-file]'),
			toggleModalWarningFileName = document.querySelector('p[data-file-name]'),
			toggleModalWarningSubtitle = document.querySelector('p[data-warning-subtitle]'),
			unsuccessfullyMessage = document.querySelector('.toggle-modal__unsuccessfully');

	for (let modal of toggleModals) {
		closeModalFormBtn(closeButtons,'', '');
		closeModalFormOverlay(modal,'', '');
		keyCloseFormModal(modal,'', '');
	}

	for (let form of forms) {
		const toggleModal = form.closest('.toggle-modal');

		if (form.classList.contains('ajax-save')) {
			const checkedStar = form.querySelector('input[name="rating"]'),
					formSelect = form.querySelector('select'),
					formTextarea = form.querySelector('textarea'),
					formTooltip = form.querySelector('.form-modal__tooltip'),
					formCommentLength = form.querySelector('.form-modal__tooltip span'),
					wrapperCreatedFiles = form.querySelector('.attach__wrapper-created-files'),
					inputs = form.querySelectorAll('input[type="file"]');

			changeSelect(formSelect, form);

			inputs.forEach((input,i) => {
				createdBtnDeleteAllFiles(input.closest('.attach__search_wrapper-created-files').querySelector('.attach__container-created-files'));

				const wrapperBtnDeleteFiles = document.querySelectorAll('.attach__delete-files')[i];

				input.addEventListener('change', function (e) {
					e.preventDefault();

					const thisInput = this,
							thisInputFiles = thisInput.files,
							formModalRow = thisInput.closest('.form-modal__row'),
							wrapperSearchCreatedFiles = thisInput.closest('.attach__search_wrapper-created-files'),
							wrapperBtnDeleteFiles = wrapperSearchCreatedFiles.querySelector('.attach__delete-files'),
							wrapperCreatedFiles = wrapperSearchCreatedFiles.querySelector('.attach__wrapper-created-files');

					newFiles.length = 0;

					for (let thisFile of thisInputFiles) {
						if (!newFiles.length) {
							newFiles.push(thisFile);

						} else {
							if (newFiles.some(({name}) => name === thisFile.name)) {
								continue;
							}
							newFiles.push(thisFile);
						}
					}

					for (let file of newFiles) {
						if (filesArr.some(({name}) => name === file.name)) {
							duplicateFiles.push(file);
						}
					}

					for (let file of newFiles) {
						if (filesArr.some(({name}) => name === file.name)) {
							overlayWarning.classList.add('active');
							toggleModalWarning.classList.add('active');
							thisInput.value = '';

							if (duplicateFiles.length > 1) {
								toggleModalWarningSetting(
										`В прикрепленных файлах есть файлы (${duplicateFiles.length}) с такими же именами`,
										'Заменить файлы',
										'Пропустить файлы',
										false,
										true
								);

							} else {
								toggleModalWarningFileName.innerHTML = `<span>${file.name}</span>`;
								toggleModalWarningSetting(
										'В прикрепленных файлах есть файл с таким же именем',
										'Заменить файл',
										'Пропустить файл',
										true,
										true
								);
							}

							break;

						} else {
							filesArr.push(file);
							attachedFormModal(formModalRow, file, wrapperCreatedFiles, false);
							thisInput.value = '';
							overflowYModalBox(mediaQueryTaskSmart);
						}
					}

					if (filesArr.length > 1 && !wrapperBtnDeleteFiles.classList.contains('show')) {
						wrapperBtnDeleteFiles.classList.add('show');
					}

					toggleModalWarningButtons.forEach(btn => btn.onclick = (e) => {
						replaceAndSkipFiles(e, formModalRow, wrapperCreatedFiles);
					});
				});

				wrapperBtnDeleteFiles.addEventListener('click', function (e) {
					e.preventDefault();
					deleteAttachedFiles(wrapperCreatedFiles, input, this);
				});
			});

			if (formTextarea) {
				form.addEventListener('submit', function (e) {
					e.preventDefault();

					const formThis = this,
							formData = new FormData(formThis),
							inputTypeFiles = formThis.querySelector('input[type="file"]');

					/* При каждом клике на кнопку Отправить взять содержимое атрибута data-modal
					 и искать модальное окно с таким же атрибутом.
					 */
					let modalButtonsSuccessUnsuccess = e.target.querySelector('.js-open-modal-success-unsuccess'),
							modalSuccesUnsuccesId = modalButtonsSuccessUnsuccess.getAttribute('data-modal'),
							successfullyMessage = document.querySelector('.toggle-modal__successfully[data-modal="' + modalSuccesUnsuccesId + '"]');
					unsuccessfullyMessage.setAttribute('data-modal', `${modalSuccesUnsuccesId}`);

					if (formSelect && (formSelect.value === 'Не выбрана' || formSelect.value === 'Не выбран')) {
						formThis.querySelector('.jq-selectbox__select').classList.add('invalid-input-select-textarea');
						return false;
					}

					if (filesArr.length) {
						for (let file of filesArr) {
							formData.append("files[]", file);
							console.log(formData);
						}
					}

					// Проверяет, если поле комментария больше или равно 5-ти символам, то
					if (formTextarea.value.length >= 5) {
						$.ajax({
							type: "POST",
							url: "/assets/ajax.php",
							data: formData,
							contentType: false,
							cache: false,
							processData: false,
							beforeSend: () => {
								createdPreloader(form);
							},
							success: data => {
								if (JSON.parse(data).result === 'error') {
									console.log(data);
									sendDataAndCloseModals(toggleModal, unsuccessfullyMessage);
									closeModalFormBtn(closeButtons, '', '');
									closeModalFormOverlay(unsuccessfullyMessage, '', '');
									keyCloseFormModal(unsuccessfullyMessage, '', '');

								} else {
									console.log(data);
									sendDataAndCloseModals(toggleModal, successfullyMessage);
									deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles);
									closeModalFormBtn(closeButtons, '', '');
									closeModalFormOverlay(successfullyMessage, '', '');
									keyCloseFormModal(successfullyMessage, '', '');
									setTimeout(() => { // После того как модалку с успешно отправленным отзывом закрыта, очистить textarea через 1cек.
										formTextarea.classList.remove('valid');
										formTextarea.value = "";
										formCommentLength.innerText = "0"; // Сбросить число введенных символов
										if (checkedStar) {
											checkedStar.checked = false; // Убирать все чекбоксы со звезд
										}
										formThis.reset();
									}, 1000);

									returnDefaultValueSelect(formSelect, formThis);
								}
							},
							complete: () => {
								removePreloader(form);
							},
							error: error => {
								console.log(error);
								sendDataAndCloseModals(toggleModal, unsuccessfullyMessage);
								closeModalFormBtn(closeButtons, '', '');
								closeModalFormOverlay(unsuccessfullyMessage, '', '');
								keyCloseFormModal(unsuccessfullyMessage, '', '');
							}
						});
						return false;

					} else { // Показать tooltip уведомление
						formCommentLength.innerText = formTextarea.value.length;
						formTooltip.classList.add('active');
						formTextarea.classList.add('invalid-input-select-textarea');
					}
				});
				formTextarea.addEventListener('focus', function () {
					this.classList.add('valid')
				});
				formTextarea.addEventListener('blur', function () {
					if (!this.value) this.classList.remove('valid')
				});
				formTextarea.addEventListener("input", function () {
					formCommentLength.innerText = this.value.length; // Посчитать и вывести в tooltip количество введенных символов

					if (formTextarea.value.length >= 5 && formTooltip.classList.contains('active') && formTextarea.classList.contains('invalid-input-select-textarea')) {
						formTooltip.classList.remove('active'); // Иначе если меньше 5-ти, то при нажатии кнопки Отправить отзыв показываем tooltip
						formTextarea.classList.remove('invalid-input-select-textarea');
					}
				});
			}

			closeModalFormBtn(closeButtons, formTextarea, formTooltip);
			closeModalFormOverlay(toggleModal, formTextarea, formTooltip);
			keyCloseFormModal(toggleModal, formTextarea, formTooltip);
		}
	}

	/** todo Открыть модальное окно  */
	function openModal() {
		modalButtons.forEach(item => {
			item.addEventListener('click', function (e) {
				e.preventDefault();

				const modalId = this.getAttribute('data-modal'),
							modalElem = document.querySelector('.toggle-modal[data-modal="' + modalId + '"]');

				if (document.body.scrollHeight !== window.innerHeight) {
					document.body.classList.add('overflow-hidden');
				}

				modalElem.classList.add('active');
				overlay.classList.add('active');
				overflowYModalBox(mediaQueryTaskSmart);
			});
		});
	}

	/** todo Закрыть модальное окно кнопкой */
	function closeModalFormBtn(closeElement, formTextarea, formTooltip) {
		closeElement.forEach(item => {
			item.addEventListener('click', function () {
				const parentModalClose = this.closest('.toggle-modal');

				if (parentModalClose.classList.contains('active') && parentModalClose.getAttribute('style')) {
					parentModalClose.removeAttribute('style');
				}

				if (parentModalClose.classList.contains('active')) {
					parentModalClose.classList.add("remove");
					overlay.classList.add("remove");
					setTimeoutCloseModal(parentModalClose, formTooltip, formTextarea);
				}
			});
		});
	}

	/** todo Закрыть модальное окно кликом по фону */
	function closeModalFormOverlay(modal, formTextarea, formTooltip) {
		overlay.addEventListener('click', (e) => {
			e.preventDefault();

			if (modal.classList.contains('active')) {
				modal.classList.add("remove");
				overlay.classList.add("remove");
				setTimeoutCloseModal(modal, formTooltip, formTextarea);
			}
		});

	}

	/** todo Закрыть модальное окно нажатием на кнопку Escape */
	function keyCloseFormModal(modal, formTooltip, formTextarea) {
		document.body.addEventListener('keyup', e => {
			if (e.key === 'Escape' && modal.classList.contains('active')) {
				modal.classList.add("remove");
				overlay.classList.add("remove");
				setTimeoutCloseModal(modal, formTooltip, formTextarea);
			}
		});
	}

	/** todo Удаление классов и атрибутов у элементов модального окна через 300ms */
	function setTimeoutCloseModal(parentModalClose, formTooltip, formTextarea) {
		if (document.body.classList.contains('overflow-hidden')) {
			document.body.classList.remove('overflow-hidden');
		}

		setTimeout(() => {
			parentModalClose.classList.remove('active');
			parentModalClose.classList.remove("remove");
			overlay.classList.remove('active');
			overlay.classList.remove("remove");
			tabAction();

			if (formTextarea) {
				formTooltip.classList.remove('active');
				formTextarea.classList.remove('invalid-input-select-textarea');
			}
		}, 300);
	}

	/** todo Закрыть модальное окно после отправки данных с формы и открыть модалку с успешно или неуспешно отправленным письмом */
	function sendDataAndCloseModals(modal, successfullyUnsuccessfullyMessage) {
		modal.classList.add('remove');

		setTimeout(() => {
			modal.classList.remove('active');
			modal.classList.remove('remove');
			successfullyUnsuccessfullyMessage.classList.add('active');
		}, 300);
	}

	/** todo Вызов модалки в табах Полезная информация */
	function tabAction() {
		if (tabButton) {
			tabButton.onclick = () => {
				tabButton.classList.add('active');
			};
			tabButton.classList.remove("active");
		}
	}

	/** todo Удалить прелоадер  */
	function removePreloader(form) {
		const formPreloaderSending = form.parentElement.querySelector('.form-modal__sending');
		formPreloaderSending.remove();
	}

	/** todo Отслеживаем событие в select */
	function changeSelect(formSelect, formModalAjaxSave) {
		if (formSelect) {
			formSelect.onchange = function () {
				const jqSelectboxSelect = formModalAjaxSave.querySelector('.jq-selectbox__select');
				if ((this.value !== 'Не выбрана' || this.value !== 'Не выбран') && jqSelectboxSelect.classList.contains('invalid-input-select-textarea')) {
					jqSelectboxSelect.classList.remove('invalid-input-select-textarea');
				}
			};
		}
	}

	/** todo Вернуть значение select по умолчанию */
	function returnDefaultValueSelect(formSelect, formModalAjaxSave) {
		if (formSelect) {
			const jqSelectbox = formModalAjaxSave.querySelector('.jq-selectbox'),
					jqSelectboxSelect = jqSelectbox.querySelector('.jq-selectbox__select');

			if (jqSelectbox.classList.contains('changed')) {
				jqSelectbox.classList.remove('changed');
				jqSelectboxSelect.querySelector('.jq-selectbox__select-text').innerText = formSelect.querySelector('option[selected]').value;

				jqSelectbox.querySelectorAll('.jq-selectbox__dropdown ul li').forEach((selected, index) => {
					selected.removeAttribute('class');
					if (index === 0) selected.classList.add('selected', 'sel');
				});
			}
		}
	}

	/** todo Удалить прикрепленные файлы после отправки */
	function deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles) {
		if (inputTypeFiles && wrapperCreatedFiles && wrapperCreatedFiles.childElementCount > 0) {
			const wrapperBtnDeleteFiles = inputTypeFiles.closest('.attach__search_wrapper-created-files').querySelector('.attach__delete-files');
			inputTypeFiles.value = '';
			filesArr.length = 0;
			wrapperCreatedFiles.classList.add('attach__wrapper-created-files_deleted');
			setTimeout(() => {
				while (wrapperCreatedFiles.firstChild) {
					wrapperCreatedFiles.removeChild(wrapperCreatedFiles.firstChild);
					overflowYModalBox(mediaQueryTaskSmart);
				}
				wrapperCreatedFiles.classList.remove('attach__wrapper-created-files_deleted');
			}, 500);

			if (wrapperBtnDeleteFiles && wrapperBtnDeleteFiles.classList.contains('show')) {
				wrapperBtnDeleteFiles.classList.remove('show');
			}

			overflowYModalBox(mediaQueryTaskSmart);
		}
	}

	/** todo Замена файла, Пропуск файла, Запрашивать для каждого файла и закрыть предупреждение */
	function replaceAndSkipFiles(event, formModalRow, wrapperCreatedFiles) {
		event.preventDefault();
		const toggleModalWarning = event.target.closest('.toggle-modal__warning');

		if (newFiles.length) {
			for (let file of newFiles) {
				const fileName = file.name,
						ifFileNamesAreEqual = filesArr.some(({name}) => name === fileName),
						ifFileNamesAreUnequal = filesArr.some(({name}) => name !== fileName);

				if (event.target.matches('[data-action="requestForEachFile"]')) {
					toggleModalWarning.classList.add('requestForEachFile');
					toggleModalWarningSetting(
							'В прикрепленных файлах есть файл с таким же именем',
							'Заменить файл',
							'Пропустить файл',
							true,
							false
					);
				}

				if (toggleModalWarning.classList.contains('requestForEachFile')) {
					let modalFileName = toggleModalWarningFileName.textContent;

					if (ifFileNamesAreEqual && !modalFileName) {
						toggleModalWarningNumbFile.textContent = `${num} / ${duplicateFiles.length}`;
						toggleModalWarningFileName.innerHTML = `<span>${fileName}</span>`;
					}

					/* Заменить вроде победил. Надо еще по тестить */
					if (event.target.matches('[data-action="replaceFile"]')) {
						// console.log('Второй этап замена');

						if (filesArr.some(({name}) => name === modalFileName) && filesArr[filesArr.findIndex(el => el.name === modalFileName)]) {
							deleteFiles.push(filesArr[filesArr.findIndex(el => el.name === modalFileName)]);
							filesArr.splice(filesArr.findIndex(el => el.name === modalFileName), 1);
						}

						if (ifFileNamesAreEqual && filesArr[filesArr.findIndex(el => el.name === fileName)]) {
							toggleModalWarningNumbFile.textContent = `${Math.ceil(num + 1)} / ${duplicateFiles.length}`;
							changingFileName(filesArr[filesArr.findIndex(el => el.name === fileName)].name);
							return num++;
						}

						if (ifFileNamesAreUnequal && num === duplicateFiles.length) {
							Array.prototype.push.apply(filesArr, newFiles);
							if (wrapperCreatedFiles && wrapperCreatedFiles.childElementCount > 0) {
								while (wrapperCreatedFiles.firstChild) wrapperCreatedFiles.removeChild(wrapperCreatedFiles.firstChild);
							}
							filesArr.forEach(fileArr => {
								attachedFormModal(formModalRow, fileArr, wrapperCreatedFiles, true);
							});
							newFiles.length = 0;
							num = 1;
						}

						if (!newFiles.length) cleaningClosing(toggleModalWarning);
					}

					/* Пропустить вроде победил. Надо еще по тестить */
					if (event.target.matches('[data-action="skipFile"]')) {
						// console.log('Второй этап пропуск');

						if (newFiles.some(({name}) => name === modalFileName) && newFiles[newFiles.findIndex(el => el.name === modalFileName)]) {
							deleteNewFiles.push(newFiles[newFiles.findIndex(el => el.name === modalFileName)]);
							newFiles.splice(newFiles.findIndex(el => el.name === modalFileName), 1);
						}

						if (ifFileNamesAreEqual && newFiles[newFiles.findIndex(el => el.name === filesArr[filesArr.findIndex(el => el.name === fileName)].name)]) {
							toggleModalWarningNumbFile.textContent = `${Math.ceil(num + 1)} / ${duplicateFiles.length}`;
							changingFileName(fileName);
							return num++;
						}

						if (ifFileNamesAreUnequal && num === duplicateFiles.length) {
							Array.prototype.push.apply(filesArr, newFiles);
							newFiles.forEach(newFile => {
								attachedFormModal(formModalRow, newFile, wrapperCreatedFiles, false);
							});
							newFiles.length = 0;
							num = 1;
						}

						if (!newFiles.length) cleaningClosing(toggleModalWarning);
					}

				} else {

					/* Замена одного файла или всех сразу */
					if (event.target.matches('[data-action="replaceFile"]')) {
						// console.log('Первый этап замена');

						if (ifFileNamesAreEqual && filesArr[filesArr.findIndex(el => el.name === fileName)]) {
							filesArr.splice(filesArr.findIndex(el => el.name === fileName), 1);
						}

						if ((filesArr.length && ifFileNamesAreUnequal) || !filesArr.length) {
							filesArr.push(file);
							if (wrapperCreatedFiles && wrapperCreatedFiles.childElementCount > 0) {
								while (wrapperCreatedFiles.firstChild) wrapperCreatedFiles.removeChild(wrapperCreatedFiles.firstChild);
							}
							filesArr.forEach(fileArr => {
								attachedFormModal(formModalRow, fileArr, wrapperCreatedFiles, true);
							});
							cleaningClosing(toggleModalWarning);
						}
					}

					/* Пропуск одного файла или всех сразу */
					if (event.target.matches('[data-action="skipFile"]')) {
						// console.log('Первый этап пропуск');

						if (ifFileNamesAreEqual && newFiles.length > 1) {
							cleaningClosing(toggleModalWarning);
							continue;
						}

						if (ifFileNamesAreUnequal && newFiles.length > 1) {
							filesArr.push(file);
							attachedFormModal(formModalRow, file, wrapperCreatedFiles, false);
							cleaningClosing(toggleModalWarning);
						}

						if (ifFileNamesAreEqual && newFiles.length === 1) {
							cleaningClosing(toggleModalWarning);
							continue;
						}
					}
				}

				/** Отменить запрос для каждого файла */
				if (event.target.matches('[data-action="cancel"]')) {
					toggleModalWarning.classList.remove('requestForEachFile');
					toggleModalWarningNumbFile.textContent = '';
					toggleModalWarningFileName.innerHTML = '';
					num = 1;
					toggleModalWarningSetting(
							`В прикрепленных файлах есть файлы (${duplicateFiles.length}) с такими же именами`,
							'Заменить файлы',
							'Пропустить файлы',
							false,
							true
					);
					if (deleteFiles.length > 0) Array.prototype.push.apply(filesArr, deleteFiles);
					if (deleteNewFiles.length > 0) Array.prototype.push.apply(newFiles, deleteNewFiles);
					[deleteFiles, deleteNewFiles].forEach(arr => arr.length = 0);
				}
			}

		} else {
			cleaningClosing(toggleModalWarning);
		}

		if (event.target.matches('[data-action="warningClose"]')) cleaningClosing(toggleModalWarning);
	}

	/** todo Показать Сообщение об обновленных файлах и после Подсветить обновленные дубликаты файлов */
	function activeRemoveModalFileUpdate(fileName, parent) {
		const attachFiles = parent.querySelectorAll('.attach__file');
		attachFiles.forEach(attachFile => {
			const attachName = attachFile.querySelector('.attach__name'),
					attachNameExt = attachName.textContent + '.' + attachName.previousElementSibling.textContent;

			if (duplicateFiles.some(({name}) => name === attachNameExt)) {
				toggleModalFileUpdated.classList.add('active');

				setTimeout(() => {
					toggleModalFileUpdated.classList.add('remove');

					setTimeout(() => {
						toggleModalFileUpdated.classList.remove('active');
						toggleModalFileUpdated.classList.remove("remove");
						attachName.classList.add('attach__file_new-file');
					}, 300);
				}, 1800);
			}

			setTimeout(() => attachName.classList.remove('attach__file_new-file'), 4000)
		});
	}

	/** todo Очистка дынных и Закрытие предупреждения */
	function cleaningClosing(toggleModalWarning) {
		if (toggleModalWarningNumbFile.textContent) toggleModalWarningNumbFile.textContent = '';
		if (toggleModalWarningFileName.innerHTML) toggleModalWarningFileName.innerHTML = '';
		if (toggleModalWarning.classList.contains('requestForEachFile')) toggleModalWarning.classList.remove('requestForEachFile');
		num = 1;
		closeModal(toggleModalWarning);
	}

	/** todo Закрыть модалку и очистить массивы */
	function closeModal(parent) {
		parent.classList.add('remove');
		overlayWarning.classList.add('remove');
		setTimeout(() => {
			parent.classList.remove('active');
			parent.classList.remove("remove");
			overlayWarning.classList.remove('active');
			overlayWarning.classList.remove('remove');
			[duplicateFiles, deleteFiles, deleteNewFiles].forEach(array => {
				if (array.length > 0) array.length = 0;
			});
		}, 300);
	}

	/** todo Закрыть модальное окно Предупреждения кликом по фону */
	function closeWarningModalOverlay() {
		overlayWarning.addEventListener('click', (e) => {
			e.preventDefault();
			cleaningClosing(toggleModalWarning);
		});
	}

	/** todo Настройки для предупреждения при дублировании файлов */
	function toggleModalWarningSetting(subtitleText, replaceFileText, skipFileText, boolRequestForEachFile, boolCancel) {
		toggleModalWarningButtons.forEach(btn => {
			toggleModalWarningSubtitle.textContent = `${subtitleText}`;

			switch (btn.getAttribute('data-action')) {
				case 'replaceFile':
					btn.innerHTML = `
						<img src="/assets/images/icons/replace-file.svg" alt="Заменить файлы">
						${replaceFileText}
					 `;
					break;
				case 'skipFile':
					btn.innerHTML = `
						<img src="/assets/images/icons/skip.svg" alt="Пропустить файлы">
						${skipFileText}
					`;
					break;
				case 'requestForEachFile':
					btn.innerHTML = `
						<img src="/assets/images/icons/file-check.svg" alt="Запрашивать для каждого файла">
						Запрашивать для каждого файла
					`;
					btn.hidden = boolRequestForEachFile;
					break;
				case 'cancel':
					btn.innerHTML = `
						<img src="/assets/images/icons/file-uncheck.svg" alt="Отменить запрос">
						Отменить запрос
					`;
					btn.hidden = boolCancel;
					break;
			}
		});
	}

	/** todo Добавление файлов в модалку */
	function attachedFormModal(formModalRow, file, wrapperCreatedFiles, trueFalse) {
		if (formModalRow) {
			addFilesToArray(file, wrapperCreatedFiles, trueFalse);
			deleteAttachedFile(wrapperCreatedFiles);
		}
	}

	/** todo Создание визуальных оберток для файлов */
	function addFilesToArray(file, parent, trueFalse) {
		const fileName = file.name,
				filenameWithoutExtension = fileName.beforeLastIndex("."), // Убрать расширения файлов и оставить только имена файлов
				fileExtension = fileName.split('.').pop(); // Убрать имена файлов и оставить только их расширения

		/** todo Имя (filenameWithoutExtension), расширение (fileExtension) и цвет расширения (colorExtensionsFiles(fileExtension)) файлов */
		parent.append(createAttachFile(filenameWithoutExtension, fileExtension, colorExtensionsFiles(fileExtension)));
		if (trueFalse) activeRemoveModalFileUpdate(fileName, parent);
	}

	/** todo Удалить прикрепленный файл */
	function deleteAttachedFile(wrapperCreatedFiles) {
		const btnDel = wrapperCreatedFiles.querySelectorAll('.attach__delete');

		for (let [i, btn] of btnDel.entries()) {
			btn.onclick = function (e) {
				e.preventDefault();

				const parentOfBtnDelete = this.closest('.attach__file'),
						btnDeleteAllFiles = wrapperCreatedFiles.previousElementSibling;

				parentOfBtnDelete.remove();
				delete filesArr[i]; // Удалить из массива элемент: i - какой элемент удалить, 1 - сколько элементов удалить

				if (wrapperCreatedFiles.childElementCount === 1 && btnDeleteAllFiles.classList.contains('show')) {
					btnDeleteAllFiles.classList.remove('show');
				}

				if (wrapperCreatedFiles.childElementCount <= 0) {
					filesArr.length = 0;
					overflowYModalBox(mediaQueryTaskSmart);
				}
			}
		}
	}

	/** todo Animation */
	function changingFileName(fileName) {
		toggleModalWarningFileName.classList.add('hide');
		setTimeout(() => {
			toggleModalWarningFileName.innerHTML = `<span>${fileName}</span>`;
			toggleModalWarningFileName.classList.remove('hide');
		}, 300);
	}

	/** todo Если размер экрана равен смартфону, то добавить класс скролла для блока с прикрепленными файлами, если файлов больше трех */
	function handleOrientationChangeSmartphone(mqts) {
		const media = mqts.matches;

		if (!media) {
			for (let btnDel of wrapperBtnDeleteFiles) {
				if (filesArr.length > 1 && !btnDel.classList.contains('show')) {
					btnDel.classList.add('show');
				}
			}
		}

		overflowYModalBox(mqts);
	}

	/** todo Если у .toggle-modal__box высота больше, то вернуть css скролл или меньше, то убирать скролл  */
	function overflowYModalBox(media) {
		if (!media.matches) {
			for (let modalBox of toggleModalsBox) {
				if (modalBox.parentElement.classList.contains('active')) {
					if (modalBox.scrollHeight <= window.innerHeight) {
						modalBox.classList.add('toggle-modal__box_overflowY-hidden');
					} else {
						modalBox.classList.remove('toggle-modal__box_overflowY-hidden');
					}
				}
			}
		}
	}

	/** todo В конце удалить это */
	/*document.body.addEventListener('click', e => {
		if (e.target.matches('[class="toggle-modal__close js-modal-close"]')) {
			e.preventDefault();
			console.log(filesArr);
			// console.log(deleteFiles + ' - Замена');
			// console.log(deleteNewFiles + ' - Пропуск');
		}
	});*/

	tabAction();
	openModal();
	nameFilesAttach();
	closeWarningModalOverlay();
	handleOrientationChangeSmartphone(mediaQueryTaskSmart);
	mediaQueryTaskSmart.addEventListener('change', handleOrientationChangeSmartphone);
});


