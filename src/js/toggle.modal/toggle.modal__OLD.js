"use strict";

window.addEventListener('DOMContentLoaded', () => {

	const toggleModalBg = document.createElement('div');
	toggleModalBg.classList.add('toggle-modal-bg', 'js-overlay-modal');
	document.body.append(toggleModalBg);

	// Это потом убрать
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

	// Это потом убрать
	function createdWarningModal() {
		const warning = document.createElement('div');
		warning.classList.add('toggle-modal', 'toggle-modal__warning');
		warning.setAttribute('role', 'dialog');
		warning.innerHTML = `
			<div class="toggle-modal__box toggle-modal__box_p-none">
				<div class="toggle-modal__body toggle-modal__body_white toggle-modal__body_pt-sm-50">
					<p class="modal__text modal__text_bold">Замена или пропуск файлов</p>
					<p class="modal__text" data-file-name></p>
					<p class="modal__text modal__text_middle modal__text_light modal__text_grey" data-warning-subtitle></p>
					<div class="modal__buttons">
						<button class="button button--green" data-action="replaceFile" title="Замена" role="button"></button>
						<button class="button button--green" data-action="skipFile" title="Пропуск" role="button"></button>
						<button class="button button--green" data-action="requestForEachFile" role="button">
							Запрашивать для каждого файла
						</button>
						<button class="button button--green" data-action="cancel" role="button">Отмена</button>
					</div>
				</div>
			</div>
			<button class="toggle-modal__close toggle-modal__close_sm-green" data-action="warningClose" title="Закрыть" role="button"></button>
			`;
		document.body.append(warning);
	}
	createdWarningModal();

	const modalButtons = document.querySelectorAll('.js-open-modal'),
			overlay = document.querySelector('.js-overlay-modal'),
			closeButtons = document.querySelectorAll('.js-modal-close'),
			tabButton = document.querySelector('button.tab__button[data-modal]'),
			checkedStar = document.querySelector('input[name="rating"]'),
			toggleModal = document.querySelectorAll('.toggle-modal'),
			toggleModalWarning = document.querySelector('.toggle-modal__warning'),
			toggleModalWarningButtons = toggleModalWarning.querySelectorAll('button');

	let toggleModalWarningFileName = document.querySelector('p[data-file-name]'),
			toggleModalWarningSubtitle = document.querySelector('p[data-warning-subtitle]');

	let filesArr = [],
			newFiles = [],
			duplicateFiles = [];

	toggleModal.forEach(modal => {
		const formModalAjaxSave = modal.querySelector('.ajax-save');

		if (formModalAjaxSave) {
			const formSelect = formModalAjaxSave.querySelector('select'),
					formTextarea = formModalAjaxSave.querySelector('textarea'),
					formTooltip = formModalAjaxSave.querySelector('.form-modal__tooltip'),
					formCommentLength = formModalAjaxSave.querySelector('.form-modal__tooltip span'),
					wrapperCreatedFiles = formModalAjaxSave.querySelector('.attach__wrapper-created-files'),
					inputs = formModalAjaxSave.querySelectorAll('input[type="file"]');

			changeSelect(formSelect, formModalAjaxSave);

			inputs.forEach(input => {
				input.addEventListener('change', function () {
					const thisInput = this,
							thisInputFiles = thisInput.files;

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
							modal.classList.add('warning');
							overlay.classList.add('warning');
							toggleModalWarning.classList.add('active');

							if (duplicateFiles.length > 1) {
								toggleModalWarningSetting(
										`В прикрепленных файлах есть файлы (${duplicateFiles.length}) с такими же именами`,
										'Заменить файлы',
										'Пропустить файлы',
										false,
										true
								);

							} else {
								toggleModalWarningFileName.textContent = `${file.name}`;
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
						}
					}
				});
			});

			toggleModalWarningButtons.forEach(btn => btn.addEventListener('click', replaceAndSkipFiles));

			if (formTextarea) {

				/* Кнопка Отправить */
				formModalAjaxSave.addEventListener('submit', function (s) {
					s.preventDefault();

					const form = this,
							formData = new FormData(form),
							inputTypeFiles = form.querySelector('input[type="file"]');

					/* При каждом клике на кнопку Отправить взять содержимое атрибута data-modal
					 и искать модальное окно с таким же атрибутом.
					 */
					let modalButtonsSuccessUnsuccess = s.target.querySelector('.js-open-modal-success-unsuccess'),
							modalSuccesUnsuccesId = modalButtonsSuccessUnsuccess.getAttribute('data-modal'),
							successfullyMessage = document.querySelector('.toggle-modal__successfully[data-modal="' + modalSuccesUnsuccesId + '"]'),
							unsuccessfullyMessage = document.querySelector('.toggle-modal__unsuccessfully');
					unsuccessfullyMessage.setAttribute('data-modal', `${modalSuccesUnsuccesId}`);

					if (formSelect && (formSelect.value === 'Не выбрана' || formSelect.value === 'Не выбран')) {
						formModalAjaxSave.querySelector('.jq-selectbox__select').classList.add('invalid-input-select-textarea');
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
									sendDataAndCloseModals(modal, unsuccessfullyMessage);
									deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles);
									closeModalBtn(closeButtons, '', '');
									closeModalOverlay(unsuccessfullyMessage, '', '');
									keyCloseModal(unsuccessfullyMessage, '', '');

								} else {
									console.log(data);
									sendDataAndCloseModals(modal, successfullyMessage);
									deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles);
									closeModalBtn(closeButtons, '', '');
									closeModalOverlay(successfullyMessage, '', '');
									keyCloseModal(successfullyMessage, '', '');
									setTimeout(() => { // После того как модалку с успешно отправленным отзывом закрыта, очистить textarea через 1c
										formTextarea.classList.remove('valid');
										formTextarea.value = "";
										formCommentLength.innerText = "0"; // Сбросить число введенных символов
										checkedStar.checked = false; // Убирать все чекбоксы со звезд
										formModalAjaxSave.reset();
									}, 1000);

									returnDefaultValueSelect(formSelect, formModalAjaxSave);
								}
							},
							complete: () => {
								removePreloader(form);
							},
							error: error => {
								console.log(error);
								sendDataAndCloseModals(modal, unsuccessfullyMessage);
								deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles);
								closeModalBtn(closeButtons, '', '');
								closeModalOverlay(unsuccessfullyMessage, '', '');
								keyCloseModal(unsuccessfullyMessage, '', '');
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

			closeModalBtn(closeButtons, formTextarea, formTooltip);
			closeModalOverlay(modal, formTextarea, formTooltip);
			keyCloseModal(modal, formTextarea, formTooltip);
		}

		closeModalBtn(closeButtons, '', '');
		closeModalOverlay(modal, '', '');
		keyCloseModal(modal, '', '');
	});

	/* todo В конце удалить это */
	document.body.addEventListener('click', e => {
		if (e.target.matches('[class="toggle-modal__close js-modal-close"]')) {
			e.preventDefault();
			console.log(filesArr);
		}
	});

	/* todo Открыть модальное окно  */
	function openModal() {
		modalButtons.forEach(item => {
			item.addEventListener('click', function (e) {
				e.preventDefault();

				const modalId = this.getAttribute('data-modal'),
						modalElem = document.querySelector('.toggle-modal[data-modal="' + modalId + '"]');

				modalElem.classList.add('active');
				overlay.classList.add('active');
			});
		});
	}

	/* todo Закрыть модальное окно после отправки данных с формы и открыть модалку с успешно или неуспешно отправленным письмом */
	function sendDataAndCloseModals(modal, successfullyUnsuccessfullyMessage) {
		modal.classList.add('remove'); // Скрыть модалку и

		setTimeout(() => {
			modal.classList.remove('active');
			modal.classList.remove('remove');
			successfullyUnsuccessfullyMessage.classList.add('active'); // Вызвать модалку с успешно или неуспешно отправленным письмом
		}, 300);
	}

	/* todo Удалить прелоадер  */
	function removePreloader(form) {
		const formPreloaderSending = form.parentElement.querySelector('.form-modal__sending');
		formPreloaderSending.remove();
	}

	/* todo Закрыть модальное окно кнопкой */
	function closeModalBtn(closeElement, formTextarea, formTooltip) {
		closeElement.forEach(item => {
			item.addEventListener('click', function () {
				const parentModalClose = this.closest('.toggle-modal');
				if (parentModalClose.classList.contains('active')) {
					parentModalClose.classList.add("remove");
					overlay.classList.add("remove");
					setTimeoutCloseModal(parentModalClose, formTooltip, formTextarea);
				}
			});
		});
	}

	/* todo Закрыть модалку */
	function closeModal(parent, arrays) {
		parent.classList.add('remove');

		setTimeout(() => {
			parent.classList.remove('active');
			parent.classList.remove("remove");
			arrays.forEach(array => array.length = 0);

		}, 300);
	}

	/* todo Закрыть модальное окно кликом по фону */
	function closeModalOverlay(modal, formTextarea, formTooltip) {
		overlay.addEventListener('click', () => {
			if (modal.classList.contains('active')) {
				modal.classList.add("remove");
				overlay.classList.add("remove");
				setTimeoutCloseModal(modal, formTooltip, formTextarea)
			}
		});
	}

	/* todo Закрыть модальное окно нажатием на кнопку Escape */
	function keyCloseModal(modal, formTooltip, formTextarea) {
		document.body.addEventListener('keyup', e => {
			if (e.key === 'Escape' && modal.classList.contains('active')) {
				modal.classList.add("remove");
				overlay.classList.add("remove");
				setTimeoutCloseModal(modal, formTooltip, formTextarea);
			}
		});
	}

	/* todo Удаление классов и атрибутов у элементов модального окна через 300ms */
	function setTimeoutCloseModal(parentModalClose, formTooltip, formTextarea) {
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

	/* todo Отслеживаем событие в select */
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

	/* todo Вернуть значение select по умолчанию */
	function returnDefaultValueSelect(formSelect, formModalAjaxSave) {
		const jqSelectbox = formModalAjaxSave.querySelector('.jq-selectbox'),
				jqSelectboxSelect = jqSelectbox.querySelector('.jq-selectbox__select');

		if (formSelect && jqSelectbox.classList.contains('changed')) {
			jqSelectbox.classList.remove('changed');
			jqSelectboxSelect.querySelector('.jq-selectbox__select-text').innerText = formSelect.querySelector('option[selected]').value;

			jqSelectbox.querySelectorAll('.jq-selectbox__dropdown ul li').forEach((selected, index) => {
				selected.removeAttribute('class');
				if (index === 0) selected.classList.add('selected', 'sel');
			});
		}
	}

	/* todo Удалить прикрепленные файлы */
	function deleteAttachedFiles(wrapperCreatedFiles, inputTypeFiles) {
		if (wrapperCreatedFiles && wrapperCreatedFiles.childElementCount > 0) {
			inputTypeFiles.value = '';
			filesArr.length = 0;
			while (wrapperCreatedFiles.firstChild) wrapperCreatedFiles.removeChild(wrapperCreatedFiles.firstChild);
		}
	}

	/* todo Вызов модалки в табах Полезная информация */
	function tabAction() {
		if (tabButton) {
			tabButton.onclick = () => {
				tabButton.classList.add('active');
			};
			tabButton.classList.remove("active");
		}
	}

	let num = 1;

	/* todo Замена файла, Пропуск файла, Запрашивать для каждого файла и закрыть предупреждение */
	function replaceAndSkipFiles(event) {
		event.preventDefault();
		const toggleModalWarning = event.target.closest('.toggle-modal__warning');

		if (newFiles.length) {
			for (let [i, file] of newFiles.entries()) {
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
					if (ifFileNamesAreEqual && !modalFileName) toggleModalWarningFileName.textContent = `${fileName}`;

					/* Заменить вроде победил. Надо еще по тестить */
					if (event.target.matches('[data-action="replaceFile"]')) {

						if (filesArr.some(({name}) => name === modalFileName) && filesArr[filesArr.findIndex(el => el.name === modalFileName)]) {
							filesArr.splice(filesArr.findIndex(el => el.name === modalFileName), 1);
						}

						if (ifFileNamesAreEqual && filesArr[filesArr.findIndex(el => el.name === fileName)]) {
							toggleModalWarningFileName.textContent = `${filesArr[filesArr.findIndex(el => el.name === fileName)].name}`;
							return ++num;
						}

						if (ifFileNamesAreUnequal && num === duplicateFiles.length) {
							Array.prototype.push.apply(filesArr, newFiles);
							newFiles.length = 0;
							num = 1;
						}

						if (!newFiles.length) {
							cleaningClosing();
						}
					}

					/* Пропустить вроде победил. Надо еще по тестить */
					if (event.target.matches('[data-action="skipFile"]')) {

						if (newFiles.some(({name}) => name === modalFileName) && newFiles[newFiles.findIndex(el => el.name === modalFileName)]) {
							newFiles.splice(newFiles.findIndex(el => el.name === modalFileName), 1);
						}

						if (ifFileNamesAreEqual && newFiles[newFiles.findIndex(el => el.name === filesArr[filesArr.findIndex(el => el.name === fileName)].name)]) {
							toggleModalWarningFileName.textContent = `${fileName}`;
							return ++num;
						}

						if (ifFileNamesAreUnequal && num === duplicateFiles.length) {
							Array.prototype.push.apply(filesArr, newFiles);
							newFiles.length = 0;
							num = 1;
						}

						if (!newFiles.length) {
							cleaningClosing();
						}
					}

				} else {

					/* Замена одного файла или всех сразу */
					if (event.target.matches('[data-action="replaceFile"]')) {
						if (ifFileNamesAreEqual) {
							filesArr.splice(filesArr.findIndex(el => el.name === fileName), 1);
						}

						if (ifFileNamesAreUnequal) {
							filesArr.push(file);
							cleaningClosing();
						}
					}

					/* Пропуск одного файла или всех сразу */
					if (event.target.matches('[data-action="skipFile"]')) {

						if (ifFileNamesAreEqual && newFiles.length > 1) {
							continue;
						}

						if (ifFileNamesAreUnequal && newFiles.length > 1) {
							filesArr.push(file);
							cleaningClosing();
						}

						if (ifFileNamesAreEqual && newFiles.length === 1) {
							newFiles.length = 0;
							cleaningClosing();
						}
					}
				}

				if (event.target.matches('[data-action="cancel"]')) {
					toggleModalWarning.classList.remove('requestForEachFile');
					toggleModalWarningSetting(
							`В прикрепленных файлах есть файлы (${duplicateFiles.length}) с такими же именами`,
							'Заменить файлы',
							'Пропустить файлы',
							false,
							true
					);
				}
			}

		} else {
			cleaningClosing();
		}

		if (event.target.matches('[data-action="warningClose"]')) cleaningClosing();
	}

	function pushAndClosed(fileName, file, index) {
		if (filesArr.some(({name}) => name !== fileName)) {
			filesArr.push(file);
			newFiles.splice(index, 1);

			if (!newFiles.length) {
				cleaningClosing();
			}
		}
	}

	function cleaningClosing() {
		toggleModalWarningFileName.textContent = '';
		closeModal(toggleModalWarning, [newFiles, duplicateFiles]);
		removeClassWarning();
	}

	function toggleModalWarningSetting(subtitleText, replaceFileText, skipFileText, boolRequestForEachFile, boolCancel) {
		toggleModalWarningButtons.forEach(btn => {
			toggleModalWarningSubtitle.textContent = `${subtitleText}`;

			switch (btn.getAttribute('data-action')) {
				case 'replaceFile':
					btn.textContent = `${replaceFileText}`;
					break;
				case 'skipFile':
					btn.textContent = `${skipFileText}`;
					break;
				case 'requestForEachFile':
					btn.hidden = boolRequestForEachFile;
					break;
				case 'cancel':
					btn.hidden = boolCancel;
					break;
			}
		});
	}

	/* todo Заменить файл */
	function replaceFile(event) {
		const toggleModalWarning = event.target.closest('.toggle-modal__warning');

		if (newFiles.length) {
			for (let [i, file] of newFiles.entries()) {
				const fileName = file.name;
				let modalFileName = toggleModalWarningFileName.textContent;

				if (fileName === modalFileName) {
					filesArr.splice(i, 1);
					filesArr.push(file);
					newFiles.splice(i, 1);
				}

				if (filesArr.some(({name}) => name === fileName)) {
					toggleModalWarningFileName.textContent = `${fileName}`;
					break;
				}

				if (filesArr.some(({name}) => name !== fileName)) {
					filesArr.push(file);
					newFiles.splice(i, 1);

					if (!newFiles.length) {
						toggleModalWarningFileName.textContent = '';
						closeModal(toggleModalWarning);
						removeClassWarning();
					}
				}
			}

		} else {
			toggleModalWarningFileName.textContent = '';
			closeModal(toggleModalWarning);
			removeClassWarning();
		}


		/*for (let i = 0; i < newFiles.length; i++) {
		 let fail = true;

		 if (fail && filesArr.some(({name}) => name === newFiles[i].name)) {
		 fileAnim(newFiles[i].name);
		 filesArr.splice(i, 1);
		 filesArr.push(newFiles[i]);
		 newFiles.splice(i, 1);
		 fail = false;
		 }

		 if (!fail) {
		 return false;

		 } else {
		 filesArr.push(newFiles[i]);
		 newFiles.splice(i, 1);
		 closeModal(toggleModalWarning);
		 removeClassWarning();
		 }
		 }*/
	}

	/* todo Пропустить файл */
	function skipFile(event) {
		const toggleModalWarning = event.target.closest('.toggle-modal__warning');

		if (newFiles.length) {
			for (let [i, file] of newFiles.entries()) {
				const fileName = file.name;
				let modalFileName = toggleModalWarningFileName.textContent;

				if (fileName === modalFileName) newFiles.splice(i, 1);

				if (filesArr.some(({name}) => name === fileName)) {
					toggleModalWarningFileName.textContent = `${fileName}`;
					break;
				}

				if (filesArr.some(({name}) => name !== fileName)) {
					filesArr.push(file);
					newFiles.splice(i, 1);

					if (!newFiles.length) {
						toggleModalWarningFileName.textContent = '';
						closeModal(toggleModalWarning);
						removeClassWarning();
					}
				}
			}

		} else {
			toggleModalWarningFileName.textContent = '';
			closeModal(toggleModalWarning);
			removeClassWarning();
		}
	}

	/* todo Удалить класс Warning у модалки с формой и черной подложки */
	function removeClassWarning() {
		toggleModal.forEach(modal => {
			if (modal.classList.contains('warning')) modal.classList.remove('warning');
		});

		overlay.classList.remove('warning');
	}

	/* todo Animation */
	function fileAnim(fileName) {
		toggleModalWarningFileName.style.cssText = `
					opacity: 0;
					transform: translateY(20px);
					transition: 0.3s;
				`;
		setTimeout(() => {
			toggleModalWarningFileName.style.cssText = `
						opacity: 0;
						transform: translateY(-50px);
						transition: 0.3s;
					`;
		}, 500);
		toggleModalWarningFileName.textContent = `${fileName}`;
		setTimeout(() => {
			toggleModalWarningFileName.style.cssText = `
					opacity: 1;
					transform: translateY(0);
					transition: 0.3s;
				`;
		}, 700);
	}

	tabAction();
	openModal();
});
