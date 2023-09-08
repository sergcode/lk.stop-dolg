"use strict";

let warningPopupMessage = document.createElement('div'); // Создаем блок для сообщения о не заполненном поле формы
warningPopupMessage.classList.add('warning-popup', 'warning-popup__center'); // Присваиваем класс
warningPopupMessage.innerHTML = `<div class="warning-popup__wrapper"></div>`; // Создаем внутри блока обертку для сообщения
let warningPopupWrapper = warningPopupMessage.querySelector('.warning-popup__wrapper'); // Находим созданный в 3-й строке класс

/** Начало функции для показа сообщения о не заполненном поле формы. Функция представляет из себя компонент для остальных форм
 *  Функция имеет два параметра, VISIBLE - отвечает за появления сообщения. TEXT - за созданный текст в блоке
 */
function warningPopup(visible, text) {
	warningPopupWrapper.innerHTML = `${text}`; // Создаем внутри обертки текст, который передается в 63 строке

	// Проверяем, если функции передан параметр VISIBLE, то присваиваем стили для появления сообщения
	if (visible === 'visible') {
		setTimeout(() => {
			warningPopupMessage.style.cssText = `
      transform: none;
      opacity: 1;
      visibility: visible;
      z-index: 10001;`;
		}, 50);

		setTimeout(() => {
			warningPopupMessage.removeAttribute('style')
		}, 3000)

	} else if (visible === 'hidden') { // Иначе, если функции передан параметр HIDDEN, то удаляем стили и затем удаляем из DOM - дерева верстку сообщения.
		warningPopupMessage.removeAttribute('style');
	}
}

window.addEventListener('DOMContentLoaded', () => {
	const body = document.querySelector('body');
	body.append(warningPopupMessage);
});

/** Выдавать предупреждение перед выходом из анкеты, перезагрузкой страницы или закрытии вкладки **/
function warningClosingQuestionnaire() {
	let questionnaireInputs = document.querySelectorAll('.questionnaire__form_input'),
			questionnaireRadioAndSwitches = document.querySelectorAll('.questionnaire__form_row input[type="radio"], .switches__checkbox'),
			questionnaireSelect = document.querySelectorAll('.questionnaire__form_select');
	let questionnaireArrayFormsElements = [questionnaireInputs, questionnaireRadioAndSwitches, questionnaireSelect];
	let questionnaireSuccess = document.querySelector('.questionnaire__successfully');
	let logoHeader = document.querySelector('.header__logo-wrapper a[role="banner"]'),
			menuBtn = document.querySelectorAll('.nav__link'),
			buttonLogout = document.querySelector('.button-logout'),
			mainQuestionnaire = document.querySelector('main');
	const questionnaireExpander = document.querySelector('.questionnaire__expander'),
			questionnaireReturn = document.querySelector('.questionnaire__return');

	const beforeUnloadListener = (event) => {
		event.preventDefault();
		return event.returnValue = "Уважаемый клиент, введенные данные не будут сохранены после перезагрузки или закрытии анкеты, вы уверены что хотите прервать анкетирование?";
	}

	/* Отменить предупреждение, если появилось сообщение об успешной отправке, при закрытии вкладки или при обновлении страницы с помощью кнопки на панели браузера */
	const beforeWindowUnloadRemoveListener = () => {
		window.removeEventListener('beforeunload', (event) => {
			/* Предупреждение при закрытии вкладки или при обновлении страницы с помощью кнопки на панели браузера */
			if (getComputedStyle(questionnaireSuccess).display === 'block') {
				event.preventDefault();
				return null;
			}
		}, {capture: true});
	}

	/* Внутренний контент предупреждения */
	const warningPopupCall = (href) => {
		warningPopupWrapper.innerHTML = `
      <p>
      	Уважаемый клиент. Введенные данные не будут сохранены после перезагрузки или закрытии анкеты. 
      	Вы уверены, что хотите прервать анкетирование?
      </p>
      <div class="warning-popup__button">
      	<button class="button button__middle button__white" name="closeQuestionnaire" role="button">
          Да, выйти из анкеты
        </button>
        <button class="button button__middle button__white" name="continueFilling" role="button">
          Продолжить заполнение анкеты
        </button>
      </div>
    `;

		let closeQuestionnaire = document.querySelector('button[name="closeQuestionnaire"]'),
				continueFilling = document.querySelector('button[name="continueFilling"]');

		if (closeQuestionnaire) {
			closeQuestionnaire.addEventListener('click', evt => {
				evt.preventDefault();
				removeEventListener('beforeunload', beforeUnloadListener, {capture: true});
				window.location.href = `${href}`;
				evt.preventDefault();
			});
		}

		if (continueFilling) {
			continueFilling.addEventListener('click', e => {
				e.preventDefault();
				warningPopupMessage.classList.remove('visible');
				mainQuestionnaire.removeAttribute('style');
			});
		}
	}

	questionnaireArrayFormsElements.forEach((elemLevelOne) => {
		elemLevelOne.forEach(function (elemLevelTwo) {
			['input', 'change'].forEach(evt => {
				elemLevelTwo.addEventListener(evt, (event) => {

					/* Предупреждение при перезагрузке страницы клавишей F5 */
					document.onkeydown = showKey;
					document.onkeypress = showKey;
					document.onkeyup = showKey;

					let wasPressed = false;

					function showKey(e) {
						if (wasPressed) {
							return;
						}

						if (e.keyCode === 116) {
							warningPopupCall(`${window.location.href}`);

							if (getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== '' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== ' ' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.checked) {
								warningPopupMessage.classList.add('visible');
								warningPopupMessage.removeAttribute('style');

								if (warningPopupMessage.classList.contains('visible')) {
									mainQuestionnaire.style.cssText = `opacity: 0.6; pointer-events: none`;
								}
								e.preventDefault();
							}

							removeEventListener('beforeunload', beforeUnloadListener, {capture: true});
						}
					}

					/* Предупреждение при переходе на другую страницу */
					if (menuBtn) {
						menuBtn.forEach(elemBtn => {
							switchingToAnotherPage(elemBtn, event);
						});
					}

					[logoHeader, buttonLogout].forEach(elemBtn => {
						switchingToAnotherPage(elemBtn, event);
					});

					/* Предупреждение при закрытии вкладки или при обновлении страницы с помощью кнопки на панели браузера */
					window.addEventListener('beforeunload', (event) => {
						if (getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== '' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== ' ' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.checked) {
							event.preventDefault();
							return event.returnValue = "Уважаемый клиент. Введенные данные не будут сохранены после перезагрузки или закрытии анкеты. Вы уверены, что хотите прервать анкетирование?";
						}
					}, {capture: true});

					beforeWindowUnloadRemoveListener();

					/* Кнопка вернуться в главное меню */
					if (questionnaireReturn) {
						questionnaireReturn.addEventListener('click', () => {
							removeEventListener('beforeunload', beforeUnloadListener, {capture: true});
						});
					}
				});
			});
		});
	});

	/** todo Выдать предупреждение при переходе на другую страницу **/
	function switchingToAnotherPage(elemBtn, event) {
		elemBtn.addEventListener('click', function (evt) {
			warningPopupCall(`${this.getAttribute('href')}`);

			if (getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== '' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== ' ' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.checked) {
				warningPopupMessage.classList.add('visible');
				warningPopupMessage.removeAttribute('style');

				if (warningPopupMessage.classList.contains('visible')) {
					mainQuestionnaire.style.cssText = `opacity: 0.6; pointer-events: none`;

				}
				evt.preventDefault();
			}

			if (questionnaireExpander && questionnaireExpander.childNodes > 0) {

				if (getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== '' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.value !== ' ' || getComputedStyle(questionnaireSuccess).display === 'none' && event.target.checked) {
					warningPopupMessage.classList.add('visible');
					warningPopupMessage.removeAttribute('style');

					if (warningPopupMessage.classList.contains('visible')) {
						mainQuestionnaire.style.cssText = `opacity: 0.6; pointer-events: none`;
					}
					evt.preventDefault();
				}
			}

			removeEventListener('beforeunload', beforeUnloadListener, {capture: true});
		});
	}
}
warningClosingQuestionnaire();

/** Начало функции для валидации формы и копирования значений с одной формы в другую
 *  При нажатии переключателя ДА/НЕТ проверяем форму на заполненность
 */
function actualAddressOfResidence(form) {
	let fail = false;
	let arrInputsRequired = [
		form.indexNumber, form.region, form.locality, form.street, form.house // Массив обязательных полей формы
	];
	let arrInputs = [
		form.corps, form.apartment // Массив не обязательных полей формы
	];
	const arrInputsAll = arrInputsRequired.concat(arrInputs); // Объединяем обязательные и не обязательные поля формы
	let factualAddressResidence = document.getElementById('actualAddressResidence'); // ID формы "Фактический адрес" куда будем копировать значения с Адреса регистрации
	let factualAddressWrapperInputs = factualAddressResidence.querySelector('.questionnaire__form_wrapper-parent'); // Обертка для полей формы, нужна для того, чтобы создать
	                                                                                                                // анимацию появления и исчезновения формы
	let arrInputsFactual = [ // Массив полей формы Фактический адрес
		form.indexFactual, form.regionFactual, form.localityFactual, form.streetFactual,
		form.houseFactual, form.corpsFactual, form.apartmentFactual
	];

	const redBorder = "#fe4f3e";
	let labelArrInputs; // Label у каждого поля, если поле не заполнено, подсвечиваем красным
	let switches = form.switchesFactual; // Переключатель, который показывает скрытую форму
	let owlHeight = document.querySelector('.owl-stage-outer.owl-height'); // Обертка для слайда с начальной высотой, которую устанавливает OWL.Carousel, меняется при появлении формы
	let owlItemActive = owlHeight.querySelector('.owl-item.active'); // Активный слайд, меняем высоту только у него при появлении формы

	/*** Валидация и копирование значений с одной формы в другую ***/
	for (let i = 0; i < arrInputsRequired.length; i += 1) {
		let topOffset = arrInputsRequired[i].offsetHeight + 23;
		console.log(topOffset);
		const elementPosition = arrInputsRequired[i].getBoundingClientRect().top;
		const offsetPosition = elementPosition - topOffset;
		labelArrInputs = arrInputsRequired[i].nextElementSibling;

		if (arrInputsRequired[i].value === "" || arrInputsRequired[i].value === " " || arrInputsRequired[0].value.length < 6) {
			const warningPopupText = '<p>Указанное поле обязательное для заполнения!</p>';

			fail = "Это поле обязательное для заполнения ";
			switches.checked = false;
			switches.parentElement.style.animationName = 'swing';
			setTimeout(() => switches.parentElement.removeAttribute('style'), 1500)
			arrInputsRequired[i].style.cssText = `
                border-color: ${redBorder};
                box-shadow: 0 0 0 1px ${redBorder};`;
			labelArrInputs.style.color = redBorder;

			window.scrollBy({
				top: offsetPosition,
				behavior: 'smooth'
			});

			warningPopup('visible', '' + warningPopupText + '');

			arrInputsRequired[i].oninput = function () {
				if (arrInputsRequired[0].value.length === 6 && arrInputsRequired[i].value.length > 0) {
					this.removeAttribute('style');
					labelArrInputs.removeAttribute('style');
					warningPopup('hidden', '' + warningPopupText + '');
				}
			};
		}

		if (fail) {
			return false;
		}
	}

	/** Проверка необязательных полей и копирование значений **/
	for (let x = 0; x < arrInputsAll.length && arrInputsFactual.length; x++) {
		if (switches.checked) {

			if (arrInputsAll[x].value === "" || arrInputsAll[x].value === " ") {
				arrInputsAll[x].value = "Информация не указана";
			}

			if (arrInputsAll[x].value !== arrInputsFactual[x].value) {
				arrInputsFactual[x].value += arrInputsAll[x].value;
			}

			factualAddressWrapperInputs.classList.add('visible');

			if (owlHeight.clientHeight < owlItemActive.clientHeight) {
				owlHeight.style.height = owlItemActive.clientHeight + 'px';
			}

		} else {

			if (arrInputsAll[x].value === "Информация не указана" || arrInputsFactual[x].value === "Информация не указана") {
				arrInputsAll[x].value = null;
				arrInputsFactual[x].value = null;

			} else if (arrInputsAll[x].value === arrInputsFactual[x].value || arrInputsAll[x].value !== arrInputsFactual[x].value) {
				arrInputsFactual[x].value = null;
			}
			arrInputsFactual[x].value = null;

			factualAddressWrapperInputs.classList.add('remove');
			factualAddressWrapperInputs.classList.remove('visible');
			setTimeout(() => factualAddressWrapperInputs.classList.remove('remove'), 300);

			if (owlHeight.clientHeight >= owlItemActive.clientHeight) {
				owlHeight.style.height = (owlHeight.clientHeight - factualAddressWrapperInputs.clientHeight) + 'px';
			}
		}
	}
}

/** Компонент для переключателя ДА/НЕТ **/
function switchesVisibleHiddenFormQuestionnaire() {
	let owlHeightQuestionnaire = document.querySelector('.owl-stage-outer.owl-height');
	let owlItem = owlHeightQuestionnaire.querySelectorAll('.owl-item');

	owlItem.forEach(elemItem => {
		const questionnaireFormParent = elemItem.querySelectorAll('.questionnaire__form_wrapper[name="visibleAndHiddenBlock"]'); // Родительская обертка для скрытых блоков

		/** Увеличивает высоту родительской обертки в соответствии с активным слайдом */
		let owlChangeHeightStretch = () => {
			if (elemItem.classList.contains('active')) {
				let height = setInterval(() => {
					if (owlHeightQuestionnaire.clientHeight < elemItem.clientHeight) { // Если высота видимой области, родительского блока, без прокрутки меньше активного слайда
						owlHeightQuestionnaire.style.height = elemItem.scrollHeight + 'px'; // То присваиваем динамичное значение высоты переменной активного слайда карусели
					} else {
						clearInterval(height)
					}
				}, 60)
			}
		};

		/** Уменьшает высоту родительской обертки в соответствии с активным слайдом */
		let owlChangeHeightReduce = () => {
			if (elemItem.classList.contains('active')) {
				if (owlHeightQuestionnaire.clientHeight >= elemItem.clientHeight) { // Если высота видимой области, родительского блока, без прокрутки больше либо равно активному слайду
					owlHeightQuestionnaire.style.height = elemItem.clientHeight + 'px'; // То присваиваем динамичное значение высоты переменной активного слайда карусели
				}
			}
		};

		questionnaireFormParent.forEach(elemParentForm => { // Массив родительских оберток
			const switchesVisibleHiddenBlockQuestionnaire = elemParentForm.querySelectorAll('.switches__checkbox[name="switchesVisibleAndHiddenBlock"]'); // Ищем все переключатели
			                                                                                                                                              // ДА/НЕТ в карусели

			switchesVisibleHiddenBlockQuestionnaire.forEach(elemSwitches => {
				elemSwitches.addEventListener("change", function (evt) {
					let questionnaireFormChildren = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-parent'); // Ищем скрытые блоки
					let arrayFormChildrenQuestionnaire = []; // Массив из ОРИГИНАЛЬНОГО и КЛОНИРОВАННЫХ БЛОКОВ
					let cloneQuestionnaireFormChildren; // Этой переменной присваиваем клонированные блоки
					let buttonWrapperRow = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-button'); // Обертка для отдельной кнопки с отдельной анимацией

					questionnaireFormChildren.forEach(elemChildren => { // Массив скрытых блоков
						arrayFormChildrenQuestionnaire.unshift(elemChildren); // Добавляем в начало массива arrayFormChildrenQuestionnaire найденный оригинальный, скрытый блок
						let questionnaireFormChildrenInputs = elemChildren.querySelectorAll('.questionnaire__form_input'),
								questionnaireFormChildrenSelect = elemChildren.querySelectorAll('.questionnaire__form_select'),
								questionnaireFormChildrenDiFlex = elemChildren.querySelectorAll('.questionnaire__form_d-flex');

						if (elemParentForm.querySelector('.questionnaire__form_wrapper-button')) {
							buttonWrapperRow.forEach(elemButtonWrapper => { // Перебираем все найденные родительские обертки для кнопки "Добавить"
								elemButtonWrapper.innerHTML = `
                  <button class="button button__very-small button--green" name="createBlock" type="button" form="formCustomerProfile" role="button">
                    <img src="/assets/images/tasks/add.svg" alt="Плюс">
                    Добавить
                  </button>`;
								let buttonCreateBlock = elemButtonWrapper.querySelector('.button[name="createBlock"]'); // Кнопка добавления блока
								let createQuestionnaireFormRow = document.createElement('div');
								createQuestionnaireFormRow.className = 'questionnaire__form_row questionnaire__form_row-create';
								createQuestionnaireFormRow.innerHTML = `
                  <input class="questionnaire__form_input" name="typeOfIncomeYourOption" type="text" form="formCustomerProfile" required/>
                  <label class="questionnaire__form_label">Введите свой вид дохода</label>   
                                    `;
								let createQuestionnaireFormRowYouVersion = elemChildren.querySelector('.questionnaire__form_row.questionnaire__form_row-create');

								/** Компонент - кнопка "Удалить" для удаления блоков с формой **/
								let deleteBlockForm = function () {
									let parentOne = this.closest('.questionnaire__form_wrapper-parent'); // Ищем прародителя кнопки
									let index = arrayFormChildrenQuestionnaire.findIndex(el => el === parentOne); // Находим индекс родительского блока, чтобы удалить его из массива

									parentOne.classList.add('remove'); // После нажатия на кнопку "Удалить" присваиваем класс для плавного скрытия
									parentOne.classList.remove('visible'); // Удаляем класс для показа блока

									let elementsRemove = setInterval(() => {
										if (parentOne.classList.contains('remove')) { // Ищем класс
											parentOne.classList.remove('remove'); // Удаляем его
											parentOne.classList.add('deleteFormQuestionnaire'); // Присваиваем класс, чтобы группировать элементы
											arrayFormChildrenQuestionnaire.splice(index, 1); // Находим индекс удаляемого блока и удаляем его из массива, чтобы считать количество элементов в массиве

											if (parentOne.classList.contains('clone')) { // Ищем класс CLONE для клонированных блоков
												parentOne.remove(); // Удаляем блок из DOM - дерева
											}

										} else {
											owlChangeHeightReduce();
											clearInterval(elementsRemove); // Останавливаем итерацию, если все условия соблюдены
										}
									}, 200);
								}

								/** Компонент - проверяет в родительском блоке отсутствие класса VISIBLE,
								 * если не находит ни один класс, то скрывает кнопку и меняет переключатель на НЕТ
								 */
								let checkingForMissingVisible = () => {
									if (elemParentForm.querySelector('.questionnaire__form_wrapper-parent.visible') === null) {
										elemButtonWrapper.classList.add('remove');
										elemButtonWrapper.classList.remove('visible');

										let elementsRemove = setInterval(() => {
											if (elemButtonWrapper.classList.contains('remove')) {
												elemButtonWrapper.classList.remove('remove');
												elemButtonWrapper.innerHTML = null;
												this.checked = false;
												elemChildren.classList.remove('deleteFormQuestionnaire')

											} else {
												owlChangeHeightReduce();
												clearInterval(elementsRemove);
											}
										}, 200);
									}
								}

								elemChildren.classList.add('visible'); // Показать скрытый блок
								elemButtonWrapper.classList.add('visible'); // Показать скрытую кнопку

								questionnaireFormChildrenSelect.forEach(elemSelect => {
									elemSelect.addEventListener('change', function () {
										if (elemChildren.querySelector('.questionnaire__form_row-create')) {
											createQuestionnaireFormRow.remove();
											createQuestionnaireFormRow.querySelector('.questionnaire__form_input').value = null;
											owlChangeHeightReduce();

										} else if (this.value === 'Свой вариант') {
											questionnaireFormChildrenDiFlex.forEach(elemDiFlex => {
												elemChildren.querySelector('.questionnaire__form_wrapper-block').insertBefore(createQuestionnaireFormRow, elemDiFlex);
												owlChangeHeightStretch();
											});
										}
									});
								});

								/** Если переключатель в положении НЕТ, то
								 * удаляем все элементы со страницы, а так же из массива,
								 * очищаем все поля форм. Клонированные блоки удаляем из DOM - дерева.
								 * */
								if (this.checked === false) {
									if (elemChildren.classList.contains('deleteFormQuestionnaire') === false) { // Ищем класс
										elemChildren.classList.add('remove'); // Присваиваем класс если у элемента нет класса deleteFormQuestionnaire
									}
									elemChildren.classList.remove('visible');
									elemButtonWrapper.classList.add('remove');
									elemButtonWrapper.classList.remove('visible');
									questionnaireFormChildrenInputs.forEach(elemInputs => {
										if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
											elemInputs.value = '';
										}
									});
									questionnaireFormChildrenSelect.forEach(elemSelect => {
										if (elemSelect.value !== 0) {
											elemSelect.value = 0;
										}
									});

									if (createQuestionnaireFormRowYouVersion) {
										createQuestionnaireFormRowYouVersion.remove();
									}

									let elementsRemove = setInterval(() => {
										if (elemButtonWrapper.classList.contains('remove')) {
											elemChildren.classList.remove('remove');
											elemChildren.classList.remove('deleteFormQuestionnaire'); // Удаляем класс, чтобы при следующей проверке присвоить его
											arrayFormChildrenQuestionnaire.splice(0);
											elemButtonWrapper.classList.remove('remove');
											elemButtonWrapper.innerHTML = null;

										} else {
											if (elemChildren.classList.contains('clone')) {
												elemChildren.remove();
											}
											owlChangeHeightReduce();
											clearInterval(elementsRemove);
										}
									}, 200);
								}

								/** Клонирование блоков с формой **/
								buttonCreateBlock.addEventListener('click', evt => {
									evt.preventDefault();
									let createQuestionnaireFormRow = document.createElement('div');
									createQuestionnaireFormRow.className = 'questionnaire__form_row questionnaire__form_row-create';
									createQuestionnaireFormRow.innerHTML = `
                    <input class="questionnaire__form_input" name="typeOfIncomeYourOption" type="text" form="formCustomerProfile" required/>
                    <label class="questionnaire__form_label">Введите свой вид дохода</label>   
                  `;

									cloneQuestionnaireFormChildren = elemChildren.cloneNode(true); // Положим в переменную клонированный блок с формой

									if (cloneQuestionnaireFormChildren.classList.contains('visible')) {
										cloneQuestionnaireFormChildren.classList.add('clone');

									} else {
										cloneQuestionnaireFormChildren.classList.add('visible');
										cloneQuestionnaireFormChildren.classList.add('clone');
									}

									inputMaskSetup($(cloneQuestionnaireFormChildren));

									let cloneQuestionnaireFormRowYouVersion = cloneQuestionnaireFormChildren.querySelector('.questionnaire__form_row.questionnaire__form_row-create');
									let cloneQuestionnaireForWrapperBlock = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_wrapper-block');

									cloneQuestionnaireForWrapperBlock.forEach(cloneWrapperBlock => {
										let cloneQuestionnaireFormChildrenSelect = cloneWrapperBlock.querySelectorAll('.questionnaire__form_select'),
												cloneQuestionnaireFormChildrenDiFlex = cloneWrapperBlock.querySelectorAll('.questionnaire__form_d-flex');

										cloneQuestionnaireFormChildrenSelect.forEach(cloneSelect => {
											cloneSelect.addEventListener('change', function () {
												if (cloneWrapperBlock.querySelector('.questionnaire__form_row-create')) {
													createQuestionnaireFormRow.remove();
													createQuestionnaireFormRow.querySelector('.questionnaire__form_input').value = null;
													owlChangeHeightReduce();

												} else if (this.value === 'Свой вариант') {
													cloneQuestionnaireFormChildrenDiFlex.forEach(cloneDiFlex => {
														cloneWrapperBlock.insertBefore(createQuestionnaireFormRow, cloneDiFlex);
													});
													owlChangeHeightStretch();
												}
											});
										});
									});

									arrayFormChildrenQuestionnaire.push(cloneQuestionnaireFormChildren);

									let cloneInputs = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_input'); // Ищем все поля клонированных блоков с формой

									cloneInputs.forEach(elemCloneInputs => { // Перебираем все поля в массиве
										let deleteValue = setInterval(() => {
											if (elemCloneInputs.value !== '') { // Итерация будет работать пока все значения полей клонированной формы не будут удалены
												elemCloneInputs.value = '';

											} else { // Когда все значения полей удалены
												elemParentForm.insertBefore(cloneQuestionnaireFormChildren, elemButtonWrapper); // Добавляем клонированный блок перед кнопкой добавить
												owlChangeHeightStretch();
												clearInterval(deleteValue); // Останавливаем итерацию
											}
										}, 60);
									});

									if (cloneQuestionnaireFormRowYouVersion) {
										cloneQuestionnaireFormRowYouVersion.remove();
									}

									for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
										let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); // Ищем в этом массиве все кнопки удаления блока

										buttonDeleteBlock.forEach(elemButtonDelete => {
											elemButtonDelete.addEventListener('click', deleteBlockForm);
											elemButtonDelete.addEventListener('click', checkingForMissingVisible);
										});
									}
								});

								/** Удаление оригинальных блоков **/
								for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
									let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); //  Ищем в этом массиве все кнопки удаления блока

									buttonDeleteBlock.forEach(elemButtonDelete => {
										elemButtonDelete.addEventListener('click', deleteBlockForm);
										elemButtonDelete.addEventListener('click', checkingForMissingVisible);

										elemButtonDelete.addEventListener('click', () => {
											questionnaireFormChildrenInputs.forEach(elemInputs => {
												if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
													elemInputs.value = '';
												}
											});
											questionnaireFormChildrenSelect.forEach(elemSelect => {
												if (elemSelect.value !== 0) {
													elemSelect.value = 0;
												}
											});

											if (createQuestionnaireFormRowYouVersion) {
												createQuestionnaireFormRowYouVersion.remove();
											}
										});
									});
								}
								owlChangeHeightStretch();
							});

						} else {
							elemChildren.classList.add('visible');

							if (this.checked === false) {
								if (elemChildren.classList.contains('deleteFormQuestionnaire') === false) { // Ищем класс
									elemChildren.classList.add('remove'); // Присваиваем класс если у элемента нет класса deleteFormQuestionnaire
								}
								elemChildren.classList.remove('visible');
								arrayFormChildrenQuestionnaire.splice(0);
								questionnaireFormChildrenInputs.forEach(elemInputs => {
									if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
										elemInputs.value = '';
									}
								});

								let elementsRemove = setInterval(() => {
									if (elemChildren.classList.contains('remove')) {
										elemChildren.classList.remove('remove');

									} else {
										owlChangeHeightReduce();
										clearInterval(elementsRemove);
									}
								}, 200);
							}
							owlChangeHeightStretch();
						}
					});
				})
			});
		});
	});
}
switchesVisibleHiddenFormQuestionnaire();

/** Компонент для клонирования видимого блока и кнопки "Добавить" **/
function cloningQuestionnaireBlock() {
	let owlHeightQuestionnaire = document.querySelector('.owl-stage-outer.owl-height'),
			owlItem = owlHeightQuestionnaire.querySelectorAll('.owl-item');

	owlItem.forEach(elemItem => {
		const questionnaireFormParent = elemItem.querySelectorAll('.questionnaire__form_wrapper[name="visibleAndHiddenBlock"]');

		/** Увеличивает высоту родительской обертки в соответствии с активным слайдом */
		let owlChangeHeightStretch = () => {
			if (elemItem.classList.contains('active')) {
				let height = setInterval(() => {
					if (owlHeightQuestionnaire.clientHeight < elemItem.clientHeight) {
						owlHeightQuestionnaire.style.height = elemItem.scrollHeight + 'px';
					} else {
						clearInterval(height)
					}
				}, 60)
			}
		};

		/** Уменьшает высоту родительской обертки в соответствии с активным слайдом */
		let owlChangeHeightReduce = () => {
			if (elemItem.classList.contains('active')) {
				if (owlHeightQuestionnaire.clientHeight >= elemItem.clientHeight) {
					owlHeightQuestionnaire.style.height = elemItem.clientHeight + 'px';
				}
			}
		};

		questionnaireFormParent.forEach(elemParentForm => {
			let questionnaireFormChildren = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-parent');
			let arrayFormChildrenQuestionnaire = [];
			let cloneQuestionnaireFormChildren;
			let buttonWrapperRow = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-button');

			if (elemParentForm.querySelector('.questionnaire__form_wrapper-button')) {
				buttonWrapperRow.forEach(elemButtonWrapper => {
					let buttonCreateBlock = elemButtonWrapper.querySelector('.button[name="createBlock"]');

					if (buttonCreateBlock) {
						let deleteBlockForm = function () {
							let parentOne = this.closest('.questionnaire__form_wrapper-parent');
							let index = arrayFormChildrenQuestionnaire.findIndex(el => el === parentOne);

							parentOne.classList.add('remove');
							parentOne.classList.remove('visible');

							let elementsRemove = setInterval(() => {
								if (parentOne.classList.contains('remove')) {
									parentOne.classList.remove('remove');
									parentOne.classList.add('deleteFormQuestionnaire');
									arrayFormChildrenQuestionnaire.splice(index, 1);

									if (parentOne.classList.contains('clone')) {
										parentOne.remove();
									}

								} else {
									owlChangeHeightReduce();
									clearInterval(elementsRemove);
								}
							}, 200);
						}

						questionnaireFormChildren.forEach(elemChildren => {
							buttonCreateBlock.addEventListener('click', evt => {
								evt.preventDefault();

								let buttonDeleteBlock = document.createElement('div');
								buttonDeleteBlock.className = 'questionnaire__form_row questionnaire__form_end';
								buttonDeleteBlock.innerHTML = `
                                  <button class="button button__very-small button--red" name="deleteBlock" type="button" form="formCustomerProfile" role="button">
                                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C21.7778 0 28 6.33333 28 14C28 21.7778 21.6667 28 14 28C6.22222 28 0 21.6667 0 14C0 6.22222 6.33333 0 14 0ZM14 1.33333C21 1.33333 26.6667 7 26.6667 14C26.6667 21 21 26.6667 14 26.6667C7 26.6667 1.33333 21 1.33333 14C1.33333 7 7 1.33333 14 1.33333Z" fill="#FEFEFE"/>
                                      <rect x="7" y="13" width="14" height="2" fill="white"/>
                                    </svg>
                                    Удалить блок
                                  </button>                
                                `;

								cloneQuestionnaireFormChildren = elemChildren.cloneNode(true);
								cloneQuestionnaireFormChildren.querySelector('.questionnaire__form_wrapper-block').append(buttonDeleteBlock);

								let cloneInputs = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_input');
								let cloneSwitches = cloneQuestionnaireFormChildren.querySelectorAll('.switches__checkbox');

								if (cloneQuestionnaireFormChildren.classList.contains('visible')) {
									cloneQuestionnaireFormChildren.classList.add('clone');

								} else {
									cloneQuestionnaireFormChildren.classList.add('visible');
									cloneQuestionnaireFormChildren.classList.add('clone');
								}

								inputMaskSetup($(cloneQuestionnaireFormChildren));

								arrayFormChildrenQuestionnaire.push(cloneQuestionnaireFormChildren);

								let deleteValue = setInterval(() => {
									cloneInputs.forEach(elemCloneInputs => {
										if (elemCloneInputs.value !== '') {
											elemCloneInputs.value = '';
										}
									});

									cloneSwitches.forEach(elemCloneSwitches => {
										if (elemCloneSwitches.checked) {
											elemCloneSwitches.checked = false;
										}
									});
									elemParentForm.insertBefore(cloneQuestionnaireFormChildren, elemButtonWrapper);

									owlChangeHeightStretch();
									clearInterval(deleteValue);
								}, 60);

								for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
									let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); // Ищем в этом массиве все кнопки удаления блока

									buttonDeleteBlock.forEach(elemButtonDelete => {
										elemButtonDelete.addEventListener('click', deleteBlockForm);
									});
								}

								owlChangeHeightStretch();
							});
						});
					}
				});
			}
		});
	});
}
cloningQuestionnaireBlock();

window.addEventListener('DOMContentLoaded', function () {
	const mainQuestionnaire = document.querySelector('main');

	/** todo Настраиваемое сообщение */
	function changeWarningPopup(text, one_btnTurnOnOff = "on", two_btnTurnOnOff = "on") {
		warningPopupWrapper.innerHTML = `
			<p>${text}</p>
			<div class="warning-popup__button">
        <button class="button button__middle button__white" name="continueFilling" data-change-turn="${one_btnTurnOnOff}" role="button">
          Понятно
        </button>
        <button class="button button__middle button__white" name="continueFilling" data-change-turn="${two_btnTurnOnOff}" role="button">
          Понятно 2
        </button>
      </div>
		`;

		const continueFilling = document.querySelector('button[name="continueFilling"]');

		warningPopupMessage.classList.add('visible');

		if (warningPopupMessage.classList.contains('visible')) {
			mainQuestionnaire.style.cssText = `opacity: 0.6; pointer-events: none`;
		}

		if (continueFilling) {
			continueFilling.addEventListener('click', (e) => {
				e.preventDefault();
				warningPopupMessage.classList.remove('visible');
				mainQuestionnaire.removeAttribute('style');
			});
		}
	}

	/** todo При открытии заполненной анкеты проверить, если заполнены все инпуты,
	  то выдать сообщение и заблокировать все элементы анкеты
	 */
	function checkIfAllFieldsAreFilledIn() {
		const questionnaireFormInputs = document.querySelectorAll('.questionnaire__form_input'),
					questionnaireFormElementsValue = document.querySelectorAll('.questionnaire__form_select, .questionnaire__form_textarea'),
					questionnaireFormElementsChecked = document.querySelectorAll('.questionnaire__form_row input[type="radio"], .switches__checkbox');

		for (let elementInput of questionnaireFormInputs) {
			if (elementInput.value && elementInput.value.length > 0) {
				changeWarningPopup(
						`
							Уважаемый клиент, данные в заполненной анкете не подлежат<br/>
			        изменению и представлены только для ознакомления.
						`,
						'on',
						'off'
				);
				elementInput.disabled = true;

				for (let elementForm of questionnaireFormElementsValue) {
					elementForm.disabled = true;
				}

				for (let elementForm of questionnaireFormElementsChecked) {
					elementForm.disabled = true;
				}
			}
		}
	}

	/** Создание форм для аккордеона **/
	function createFormsProperty() {
		const questionnaireExpander = document.querySelector('.questionnaire__expander');
		const formWrapperParent = document.createElement('div'),
				formWrapperBlock = document.createElement('div');

		formWrapperParent.classList.add('questionnaire__form_wrapper-parent', 'visible');
		formWrapperBlock.classList.add('questionnaire__form_wrapper-block');

		formWrapperBlock.innerHTML = `
          <div class="questionnaire__form_header">
            <div class="questionnaire__form_row">
              <input class="questionnaire__form_input" name="propertyNameZPZ[]" type="text" form="formCustomerProfileZPZ" required/>
              <label class="questionnaire__form_label">Наименование имущества</label>
            </div>
            
            <div class="questionnaire__form_row">
                <input class="questionnaire__form_input marketPrice" placeholder=" ₽" name="marketPricePropertyZPZ[]" type="text" form="formCustomerProfileZPZ" required/>
                <label class="questionnaire__form_label">Стоимость (приблизительно) (руб.)</label>
            </div>
            
            <div class="questionnaire__form_row">
                <textarea class="questionnaire__form_textarea" name="descriptionPropertyZPZ[]" cols="30" rows="5" required></textarea>
                <label class="questionnaire__form_label">Описание</label>
            </div>
            <div class="questionnaire__form_row questionnaire__form_center">
              <button class="button button__very-small button--red" name="deleteBlock" type="button" form="formCustomerProfile" role="button">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C21.7778 0 28 6.33333 28 14C28 21.7778 21.6667 28 14 28C6.22222 28 0 21.6667 0 14C0 6.22222 6.33333 0 14 0ZM14 1.33333C21 1.33333 26.6667 7 26.6667 14C26.6667 21 21 26.6667 14 26.6667C7 26.6667 1.33333 21 1.33333 14C1.33333 7 7 1.33333 14 1.33333Z" fill="#FEFEFE"></path>
                  <rect x="7" y="13" width="14" height="2" fill="white"></rect>
                </svg>
                Удалить блок
              </button>                
            </div>
          </div>
          
          <button type="button" class="questionnaire__expander_trigger" name="expanderTriggerBtn" form="formCustomerProfileZPZ">
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg>
          </button>
        `;

		formWrapperParent.appendChild(formWrapperBlock);
		questionnaireExpander.appendChild(formWrapperParent);
	}

	function creatingFormsInAccordion() {
		let owlHeightQuestionnaire = document.querySelector('.owl-stage-outer.owl-height'),
				owlItem = owlHeightQuestionnaire.querySelectorAll('.owl-item');

		owlItem.forEach(elemItem => {
			const questionnaireFormParent = elemItem.querySelectorAll('.questionnaire__form_wrapper[name="visibleAndHiddenBlock"]');

			/** Увеличивает высоту родительской обертки в соответствии с активным слайдом */
			const owlChangeHeightStretch = () => {
				if (elemItem.classList.contains('active')) {
					let height = setInterval(() => {

						if (owlHeightQuestionnaire.clientHeight < elemItem.clientHeight) {
							owlHeightQuestionnaire.style.height = elemItem.scrollHeight + 'px';
						} else {
							clearInterval(height)
						}
					}, 30)
				}
			};

			/** Уменьшает высоту родительской обертки в соответствии с активным слайдом */
			const owlChangeHeightReduce = () => {
				if (elemItem.classList.contains('active')) {
					if (owlHeightQuestionnaire.clientHeight >= elemItem.clientHeight) {
						owlHeightQuestionnaire.style.height = elemItem.clientHeight + 'px';
					}
				}
			};

			const rollUpCreatedFormsProperty = function () {
				let parent = this.closest('.questionnaire__form_wrapper-parent');

				parent.classList.toggle('expander');

				if (!parent.classList.contains('expander')) {
					parent.classList.add('clicked');
				}

				elemItem.querySelectorAll('.questionnaire__form_wrapper-parent').forEach(elem => {
					if (!elem.classList.contains('clicked')) {
						elem.classList.add('expander');
					} else {
						elem.classList.remove('clicked');
					}
				});

				let elementsRemove = setInterval(() => {
					if (parent.classList.contains('expander')) {
						owlChangeHeightReduce();

					} else {
						owlChangeHeightStretch();
						clearInterval(elementsRemove);
					}
				}, 30);

			};

			questionnaireFormParent.forEach(elemParentForm => {
				const questionnaireExpander = elemParentForm.querySelector('.questionnaire__expander');
				let buttonWrapperRow = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-button');

				if (elemParentForm.querySelector('.questionnaire__form_wrapper-button')) {

					buttonWrapperRow.forEach(elemButtonWrapper => {
						let buttonCreateBlock = elemButtonWrapper.querySelector('.button[name="createBlockAccordion"]');

						if (buttonCreateBlock) {

							let deleteBlockForm = function () {
								let parentOne = this.closest('.questionnaire__form_wrapper-parent');

								parentOne.classList.add('remove');
								parentOne.classList.remove('visible');

								let elementsRemove = setInterval(() => {
									if (parentOne.classList.contains('remove')) {
										parentOne.classList.remove('remove');
										parentOne.remove();

									} else {
										owlChangeHeightReduce();
										clearInterval(elementsRemove);
									}
								}, 200);
							}

							buttonCreateBlock.addEventListener('click', () => {

								createFormsProperty();
								owlChangeHeightStretch();

								let questionnaireFormChildren = questionnaireExpander.querySelectorAll('.questionnaire__form_wrapper-parent');

								inputMaskSetup($(questionnaireFormChildren));

								questionnaireFormChildren.forEach((elemCreateWrapper) => {
									let buttonDeleteBlock = elemCreateWrapper.querySelectorAll('.button[name="deleteBlock"]'),
											buttonExpanderTrigger = document.querySelectorAll('.questionnaire__expander_trigger');

									if (elemCreateWrapper.previousElementSibling) {

										elemCreateWrapper.previousElementSibling.classList.add('expander');

										let elementsFolded = setInterval(() => {
											if (elemCreateWrapper.classList.contains('expander')) {
												owlChangeHeightReduce();

											} else {
												owlChangeHeightStretch();
												clearInterval(elementsFolded);
											}
										}, 30);
									}

									buttonDeleteBlock.forEach((elemButtonDelete) => {
										elemButtonDelete.addEventListener('click', deleteBlockForm);
									});

									buttonExpanderTrigger.forEach((elemButtonExpanderTrigger) => {
										elemButtonExpanderTrigger.addEventListener('click', rollUpCreatedFormsProperty);
									});
								});

								warningClosingQuestionnaire();
							});
						}
					});
				}
			});
		});
	}

	/** todo Проверка Select и его первого элемента Option **/
	function firstItemIsSelectedByDefault() {
		const questionnaireSelects = document.querySelectorAll('.questionnaire__form_select');

		for (let select of questionnaireSelects) {
			const option = select.querySelectorAll('option');

			if (option[0].selected && (option[0].textContent === 'Не выбрано' || option[0].textContent === 'Не выбран' || option[0].textContent === 'Не выбрана')) {
				option[0].parentElement.classList.add('not-selected');
			} else {
				option[0].parentElement.classList.remove('not-selected');
			}

			select.addEventListener('change', function (e) {
				e.preventDefault();

				if (!option[0].selected && (option[0].textContent !== 'Не выбрано' || option[0].textContent !== 'Не выбран' || option[0].textContent !== 'Не выбрана')) {
					option[0].parentElement.classList.remove('not-selected');
				} else {
					option[0].parentElement.classList.add('not-selected');
				}
			});
		}
	}

	checkIfAllFieldsAreFilledIn();
	creatingFormsInAccordion();
	firstItemIsSelectedByDefault();

});

/** Валидация последней страницы перед отправкой **/
function validationSendQuestionnaire() {
	let sendQuestionnaire = document.querySelector('.button[name="sendQuestionnaire"]'),
			owlItem = document.querySelectorAll('.owl-item'),
			mainQuestionnaire = document.querySelector('main'),
			questionnaireReturn = document.querySelector('.questionnaire__return');

	const closeQuestionnaireAndOpenSuccessfully = (sum) => {
		const questionnaireElements = document.querySelectorAll('.questionnaire__form_input, .switches__checkbox, .questionnaire__form_select, .questionnaire__form_textarea, .button[name="createBlock"], .button[name="deleteBlock"]'),
				questionnaireJqRadio = document.querySelectorAll('.questionnaire__form .jq-radio'),
				questionnaireSuccessContent = document.querySelector('.questionnaire__successfully .questionnaire__successfully_content');

		warningPopupMessage.classList.remove('visible');
		mainQuestionnaire.removeAttribute('style');

		fadeOut(".owl-carousel");

		questionnaireElements.forEach((item) => {
			item.setAttribute('disabled', 'disabled')
		});
		questionnaireJqRadio.forEach((item) => {
			item.classList.add('disabled');
		});

		if (sum >= 190000 && sum < 250000) {
			questionnaireSuccessContent.innerHTML = `
				<h3>Предварительно вам рекомендована услуга "Защита прав заемщиков", в ходе этой процедуры мы:</h3>
        <ol>
            <li>Фиксируем сумму долга</li>
            <li>Уменьшаем сумму взыскания</li>
            <li>Возвращаем незаконно списанное</li>
            <li>Снимаем незаконный арест с имущества</li>
            <li>Оберегаем от ошибок и неверных решений</li>
            <li>Даём четкий план дальнейших действий</li>
            <li>Анализируем все предложения кредиторов</li>
        </ol>
        <h3 class="questionnaire__successfully_content--pb-30">Ваша ситуация действительно важна для нас, в связи с этим вам будет оказана бесплатная консультация по нашим услугам.</h3>
        <p class="questionnaire__successfully_content--pb-30">Также вы можете ознакомиться с приложением СтопДолг в обучающем видео</p>
			`;

		} else if (sum >= 250000) {
			questionnaireSuccessContent.innerHTML = `
				<h3>Предварительно вам рекомендована услуга "Банкротство физических лиц", в ходе этой процедуры мы:</h3>
				<ol>
					<li>Определим целесообразность этой услуги для вас, при необходимости предложим другие решения </li>
					<li>Освободим вас от общения с кредиторами и коллекторами</li>
					<li>После заключения договора, мы соберем все необходимые документы для хода вашего дела</li>
					<li>Подготовим и передадим в суд заявление на признание вас банкротом</li>
					<li>Проведем реструктуризацию долга и реализацию имущества</li>
					<li>Проведем собрание кредиторов и регламентируем порядок списания долгов</li>
				</ol>
        <h3 class="questionnaire__successfully_content--pb-30">Ваша ситуация действительно важна для нас, в связи с этим вам будет оказана бесплатная консультация по нашим услугам.</h3>
        <p class="questionnaire__successfully_content--pb-30">Также вы можете ознакомиться с приложением СтопДолг в обучающем видео</p>
			`;
		}

		fadeIn(".questionnaire__successfully");
		if (questionnaireReturn) questionnaireReturn.style.display = 'flex';

		return true;
	}

	/* Внутренний контент предупреждения */
	const finishWarningPopupCallSend = () => {
		warningPopupWrapper.innerHTML = `
      <p>Уважаемый клиент, необходимо заполнить все поля в анкете, чтобы её отправить.</p>
      <div class="warning-popup__button">
        <button class="button button__middle button__white" name="continueFilling" role="button">
          Продолжить заполнение анкеты
        </button>
      </div>
    `;

		warningPopupMessage.classList.add('visible');
		warningPopupMessage.removeAttribute('style');

		if (warningPopupMessage.classList.contains('visible')) {
			mainQuestionnaire.style.cssText = `opacity: 0.6; pointer-events: none`;
		}

		let sendQuestionnaireForcibly = document.querySelector('button[name="sendQuestionnaireForcibly"]'),
				continueFilling = document.querySelector('button[name="continueFilling"]');

		if (sendQuestionnaireForcibly) {
			sendQuestionnaireForcibly.addEventListener('click', () => {
				closeQuestionnaireAndOpenSuccessfully();
			});
		}

		if (continueFilling) {
			continueFilling.addEventListener('click', () => {
				warningPopupMessage.classList.remove('visible');
				mainQuestionnaire.removeAttribute('style');
			});
		}
	}

	/* Проверяем все элементы формы перед отправкой */
	owlItem.forEach((owlItemActive) => {
		sendQuestionnaire.addEventListener('click', () => {
			let valid = true;
			const questionnaireTotalDebtAmount = document.querySelector('#totalDebtAmount'),
						questionnaireTotalDebtAmountValue = questionnaireTotalDebtAmount.value,
						questionnaireTotalDebtAmountValueNoSpaces = questionnaireTotalDebtAmountValue.replace(/\s+/g, ''),
						questionnaireTotalDebtAmountValueNoCurrency = questionnaireTotalDebtAmountValueNoSpaces.slice(0, -1);

			if (owlItemActive.classList.contains('active')) {
				let questionnaireInputs = owlItemActive.querySelectorAll('.questionnaire__form_input'),
						questionnaireTextarea = owlItemActive.querySelectorAll('.questionnaire__form_textarea'),
						questionnaireSwitches = owlItemActive.querySelectorAll('.switches__checkbox'),
						questionnaireSelect = owlItemActive.querySelectorAll('.questionnaire__form_select'),
						questionnaireRadio = owlItemActive.querySelectorAll('input[type="radio"]');

				questionnaireInputs.forEach((elemInput) => {
					if (valid && (elemInput.value === '' || valid && elemInput.value === ' ') && !elemInput.classList.contains('questionnaire__form_not-required')) {
						finishWarningPopupCallSend();
						valid = false;
					}
				});

				questionnaireTextarea.forEach((elemTextarea) => {
					if (valid && (elemTextarea.value === '' || valid && elemTextarea.value === ' ') && !elemTextarea.classList.contains('questionnaire__form_not-required')) {
						finishWarningPopupCallSend();
						valid = false;
					}
				});

				questionnaireSwitches.forEach((elemSwitches) => {
					if (valid && !elemSwitches.checked && !elemSwitches.classList.contains('questionnaire__form_not-required')) {
						finishWarningPopupCallSend();
						valid = false;
					}
				});

				questionnaireSelect.forEach((elemSelect) => {
					if (valid && elemSelect.value === '' && !elemSelect.classList.contains('questionnaire__form_not-required')) {
						finishWarningPopupCallSend();
						valid = false;
					}
				});

				questionnaireRadio.forEach((elemRadio) => { // Проверить каждую радиокнопку
					let nameActiveRadio = elemRadio.getAttribute('name'), // Получить имя набора кнопок
							nameActiveRadioChecked = owlItemActive.querySelectorAll(`input[name='${nameActiveRadio}']:checked`);

					if (valid && !nameActiveRadioChecked.length) { // Проверить, отмечена ли какая-либо кнопка в наборе
						finishWarningPopupCallSend();
						valid = false;
					}
				});

				if (!valid) {
					return false;

				} else {
					closeQuestionnaireAndOpenSuccessfully(+questionnaireTotalDebtAmountValueNoCurrency);
				}
			}
		});
	});
}
validationSendQuestionnaire();

function inputMaskSetup($cloneQuestionnaireFormChildren) {
	setTimeout(() => {
		let $parentForm = $cloneQuestionnaireFormChildren;
		let $marketPrice = $parentForm.find('.marketPrice'); // Маска для поля ввода суммы денег
		let $indicateYourShare = $parentForm.find('.shareOfProperty'); // Маска для доли в жилье
		let $INN = $parentForm.find('.inn');
		let $numberContract = $parentForm.find('.number'); // Номер договора
		let $yearInQuestionnaire = $parentForm.find('.yearInQuestionnaire');

		$INN.inputmask("9{10}", {"placeholder": ""});
		$numberContract.inputmask("(9){+|1}-(9){+|1}", {"placeholder": "0"});
		$yearInQuestionnaire.inputmask("9999 г.");

		$marketPrice.inputmask({
			mask: "( 999){+|1} ₽",
			radixPoint: ",",
			_radixDance: true,
			numericInput: true,
			placeholder: ""
		});

		$indicateYourShare.inputmask({
			mask: "X9/X9",
			placeholder: "",
			definitions: {
				"X": {
					validator: "[1-9]",
					placeholder: "1"
				}
			}
		});
	}, 100);
}
