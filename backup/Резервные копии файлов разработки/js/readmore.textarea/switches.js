// let warningPopupMessage = document.createElement('div'); // Создаем блок для сообщения о не заполненном поле формы
// warningPopupMessage.className = 'warning-popup'; // Присваиваем класс
// warningPopupMessage.innerHTML = `<div class="warning-popup__wrapper"></div>`; // Создаем внутри блока обертку для сообщения
//
// switchesVisibleHiddenFormQuestionnaire();
// cloningQuestionnaireBlock();
//
// /** Начало функции для показа сообщения о не заполненном поле формы.
//  *  Функция представляет из себя компонент для остальных форм
//  *  Функция имеет два параметра, VISIBLE - отвечает за появления сообщения. TEXT - за созданный текст в блоке
//  */
// function warningPopup(visible, text) {
//   let warningPopupWrapper = warningPopupMessage.querySelector('.warning-popup__wrapper'); // Находим созданный в 3-й строке класс
//   warningPopupWrapper.innerHTML = `${text}`; // Создаем внутри обертки текст, который передается в 63 строке
//
//   // Проверяем, если функции передан параметр VISIBLE, то присваиваем стили для появления сообщения
//   if (visible === 'visible') {
//     setTimeout(() => {
//       warningPopupMessage.style.cssText = `
//       transform: none;
//       opacity: 1;
//       visibility: visible;`;
//     }, 50);
//
//     setTimeout(() => {
//       warningPopupMessage.style.cssText = `
//       transform: translateY(-120%);
//       opacity: 0;
//       visibility: hidden;`;
//     }, 3000)
//
//   } else if (visible === 'hidden') { // Иначе, если функции передан параметр HIDDEN, то удаляем стили и затем удаляем из DOM - дерева верстку сообщения.
//     warningPopupMessage.removeAttribute('style');
//
//     setTimeout(() => warningPopupMessage.remove(), 150);
//   }
// }
//
// /** Начало функции для валидации формы и копирования значений с одной формы в другую
//  *  При нажатии переключателя ДА/НЕТ проверяем форму на заполненность
//  */
// function actualAddressOfResidence(form) {
//   let fail = false;
//   let arrInputsRequired = [
//     form.indexNumber, form.region, form.locality, form.street, form.house // Массив обязательных полей формы
//   ];
//   let arrInputs = [
//     form.corps, form.apartment // Массив не обязательных полей формы
//   ];
//   const arrInputsAll = arrInputsRequired.concat(arrInputs); // Объединяем обязательные и не обязательные поля формы
//   let factualAddressResidence = document.getElementById('actualAddressResidence'); // ID формы "Фактический адрес" куда будем копировать значения с Адреса регистрации
//   let factualAddressWrapperInputs = factualAddressResidence.querySelector('.questionnaire__form_wrapper-parent'); // Обертка для полей формы, нужна для того, чтобы создать анимацию появления и исчезновения формы
//   let arrInputsFactual = [ // Массив полей формы Фактический адрес
//     form.indexFactual, form.regionFactual, form.localityFactual, form.streetFactual,
//     form.houseFactual, form.corpsFactual, form.apartmentFactual
//   ];
//   const header = document.querySelector('header');
//   const redBorder = "#fe4f3e";
//   let labelArrInputs; // Label у каждого поля, если поле не заполнено, подсвечиваем красным
//   let switches = form.switchesFactual; // Переключатель, который показывает скрытую форму
//   let owlHeight = document.querySelector('.owl-stage-outer.owl-height'); // Обертка для слайда с начальной высотой, которую устанавливает OWL.Carousel, меняется при появлении формы
//   let owlItemActive = owlHeight.querySelector('.owl-item.active'); // Активный слайд, меняем высоту только у него при появлении формы
//
//   /*** Валидация и копирование значений с одной формы в другую ***/
//   for (let i = 0; i < arrInputsRequired.length; i += 1) {
//     const topOffset = arrInputsRequired[i].offsetHeight = 73; //
//     const elementPosition = arrInputsRequired[i].getBoundingClientRect().top;
//     const offsetPosition = elementPosition - topOffset;
//     labelArrInputs = arrInputsRequired[i].nextElementSibling;
//
//     if (arrInputsRequired[i].value === "" || arrInputsRequired[i].value === " " || arrInputsRequired[0].value.length < 6) {
//       const warningPopupText = '<p>Указанное поле обязательное для заполнения!</p>';
//
//       fail = "Это поле обязательное для заполнения ";
//       switches.checked = false;
//       switches.parentElement.style.animationName = 'swing';
//       setTimeout(() => switches.parentElement.removeAttribute('style'), 1500)
//       arrInputsRequired[i].style.cssText = `
//         border-color: ${redBorder};
//         box-shadow: 0 0 0 1px ${redBorder};`;
//       labelArrInputs.style.color = redBorder;
//
//       window.scrollBy({
//         top: offsetPosition,
//         behavior: 'smooth'
//       });
//
//       warningPopup('visible', '' + warningPopupText + '');
//
//       arrInputsRequired[i].oninput = function () {
//         if (arrInputsRequired[0].value.length === 6 && arrInputsRequired[i].value.length > 0) {
//           this.removeAttribute('style');
//           labelArrInputs.removeAttribute('style');
//           warningPopup('hidden', '' + warningPopupText + '');
//         }
//       };
//     }
//
//     if (fail) {
//       header.append(warningPopupMessage);
//       return false;
//     }
//   }
//
//   /** Проверка необязательных полей и копирование значений **/
//   for (let x = 0; x < arrInputsAll.length && arrInputsFactual.length; x++) {
//     if (switches.checked) {
//
//       if (arrInputsAll[x].value === "" || arrInputsAll[x].value === " ") {
//         arrInputsAll[x].value = "Информация не указана";
//       }
//
//       if (arrInputsAll[x].value !== arrInputsFactual[x].value) {
//         arrInputsFactual[x].value += arrInputsAll[x].value;
//       }
//
//       factualAddressWrapperInputs.classList.add('visible');
//
//       if (owlHeight.clientHeight < owlItemActive.clientHeight) {
//         owlHeight.style.height = owlItemActive.clientHeight + 'px';
//       }
//
//     } else {
//
//       if (arrInputsAll[x].value === "Информация не указана" || arrInputsFactual[x].value === "Информация не указана") {
//         arrInputsAll[x].value = null;
//         arrInputsFactual[x].value = null;
//
//       } else if (arrInputsAll[x].value === arrInputsFactual[x].value || arrInputsAll[x].value !== arrInputsFactual[x].value) {
//         arrInputsFactual[x].value = null;
//       }
//       arrInputsFactual[x].value = null;
//
//       factualAddressWrapperInputs.classList.add('remove');
//       factualAddressWrapperInputs.classList.remove('visible');
//       setTimeout(() => factualAddressWrapperInputs.classList.remove('remove'), 300);
//
//       if (owlHeight.clientHeight >= owlItemActive.clientHeight) {
//         owlHeight.style.height = (owlHeight.clientHeight - factualAddressWrapperInputs.clientHeight) + 'px';
//       }
//     }
//   }
// }
//
// /** Компонент для переключателя ДА/НЕТ **/
// function switchesVisibleHiddenFormQuestionnaire() {
//   let owlHeightQuestionnaire = document.querySelector('.owl-stage-outer.owl-height');
//   let owlItem = owlHeightQuestionnaire.querySelectorAll('.owl-item');
//
//   owlItem.forEach(elemItem => {
//     const questionnaireFormParent = elemItem.querySelectorAll('.questionnaire__form_wrapper[name="visibleAndHiddenBlock"]'); // Родительская обертка для скрытых блоков
//
//     /** Увеличивает высоту родительской обертки в соответствии с активным слайдом */
//     let owlChangeHeightStretch = () => {
//       if (elemItem.classList.contains('active')) {
//         let height = setInterval(() => {
//           if (owlHeightQuestionnaire.clientHeight < elemItem.clientHeight) { // Если высота видимой области, родительского блока, без прокрутки меньше активного слайда
//             owlHeightQuestionnaire.style.height = elemItem.scrollHeight + 'px'; // То присваиваем динамичное значение высоты переменной активного слайда карусели
//           } else {
//             clearInterval(height)
//           }
//         }, 60)
//       }
//     };
//
//     /** Уменьшает высоту родительской обертки в соответствии с активным слайдом */
//     let owlChangeHeightReduce = () => {
//       if (elemItem.classList.contains('active')) {
//         if (owlHeightQuestionnaire.clientHeight >= elemItem.clientHeight) { // Если высота видимой области, родительского блока, без прокрутки больше либо равно активному слайду
//           owlHeightQuestionnaire.style.height = elemItem.clientHeight + 'px'; // То присваиваем динамичное значение высоты переменной активного слайда карусели
//         }
//       }
//     };
//
//     questionnaireFormParent.forEach(elemParentForm => { // Массив родительских оберток
//       const switchesVisibleHiddenBlockQuestionnaire = elemParentForm.querySelectorAll('.switches__checkbox[name="switchesVisibleAndHiddenBlock"]'); // Ищем все переключатели ДА/НЕТ в карусели
//
//       switchesVisibleHiddenBlockQuestionnaire.forEach(elemSwitches => {
//         elemSwitches.addEventListener("change", function (evt) {
//           let questionnaireFormChildren = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-parent'); // Ищем скрытые блоки
//           let arrayFormChildrenQuestionnaire = []; // Массив из ОРИГИНАЛЬНОГО и КЛОНИРОВАННЫХ БЛОКОВ
//           let cloneQuestionnaireFormChildren; // Этой переменной присваиваем клонированные блоки
//           let buttonWrapperRow = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-button'); // Обертка для отдельной кнопки с отдельной анимацией
//
//           questionnaireFormChildren.forEach(elemChildren => { // Массив скрытых блоков
//             arrayFormChildrenQuestionnaire.unshift(elemChildren); // Добавляем в начало массива arrayFormChildrenQuestionnaire найденный оригинальный, скрытый блок
//             let questionnaireFormChildrenInputs = elemChildren.querySelectorAll('.questionnaire__form_input');
//             let questionnaireFormChildrenSelect = elemChildren.querySelectorAll('.questionnaire__form_select');
//             let questionnaireFormChildrenDiFlex = elemChildren.querySelectorAll('.questionnaire__form_d-flex');
//
//             if (elemParentForm.querySelector('.questionnaire__form_wrapper-button')) {
//               buttonWrapperRow.forEach(elemButtonWrapper => { // Перебираем все найденные родительские обертки для кнопки "Добавить"
//                 elemButtonWrapper.innerHTML = `
//                     <button class="button button__very-small button--green" name="createBlock" type="button" form="formCustomerProfile" role="button">
//                       <img src="/assets/images/tasks/add.svg" alt="Плюс">
//                       Добавить
//                     </button>`;
//                 let buttonCreateBlock = elemButtonWrapper.querySelector('.button[name="createBlock"]'); // Кнопка добавления блока
//                 let createQuestionnaireFormRow = document.createElement('div');
//                 createQuestionnaireFormRow.className = 'questionnaire__form_row questionnaire__form_row-create';
//                 createQuestionnaireFormRow.innerHTML = `
//                   <input class="questionnaire__form_input" name="typeOfIncomeYourOption" type="text" form="formCustomerProfile" required/>
//                   <label class="questionnaire__form_label">Введите свой вид дохода</label>
//                 `;
//                 let createQuestionnaireFormRowYouVersion = elemChildren.querySelector('.questionnaire__form_row.questionnaire__form_row-create');
//
//                 /** Компонент - кнопка "Удалить" для удаления блоков с формой **/
//                 let deleteBlockForm = function () {
//                   let parentOne = this.closest('.questionnaire__form_wrapper-parent'); // Ищем прародителя кнопки
//                   let index = arrayFormChildrenQuestionnaire.findIndex(el => el === parentOne); // Находим индекс родительского блока, чтобы удалить его из массива
//
//                   parentOne.classList.add('remove'); // После нажатия на кнопку "Удалить" присваиваем класс для плавного скрытия
//                   parentOne.classList.remove('visible'); // Удаляем класс для показа блока
//
//                   let elementsRemove = setInterval(() => {
//                     if (parentOne.classList.contains('remove')) { // Ищем класс
//                       parentOne.classList.remove('remove'); // Удаляем его
//                       parentOne.classList.add('deleteFormQuestionnaire'); // Присваиваем класс, чтобы группировать элементы
//                       arrayFormChildrenQuestionnaire.splice(index, 1); // Находим индекс удаляемого блока и удаляем его из массива, чтобы считать количество элементов в массиве
//
//                       if (parentOne.classList.contains('clone')) { // Ищем класс CLONE для клонированных блоков
//                         parentOne.remove(); // Удаляем блок из DOM - дерева
//                       }
//
//                     } else {
//                       owlChangeHeightReduce();
//                       clearInterval(elementsRemove); // Останавливаем итерацию, если все условия соблюдены
//                     }
//                   }, 200);
//                 }
//
//                 /** Компонент - проверяет в родительском блоке отсутствие класса VISIBLE,
//                  * если не находит ни один класс, то скрывает кнопку и меняет переключатель на НЕТ
//                  */
//                 let checkingForMissingVisible = () => {
//                   if (elemParentForm.querySelector('.questionnaire__form_wrapper-parent.visible') === null) {
//                     elemButtonWrapper.classList.add('remove');
//                     elemButtonWrapper.classList.remove('visible');
//
//                     let elementsRemove = setInterval(() => {
//                       if (elemButtonWrapper.classList.contains('remove')) {
//                         elemButtonWrapper.classList.remove('remove');
//                         elemButtonWrapper.innerHTML = null;
//                         this.checked = false;
//                         elemChildren.classList.remove('deleteFormQuestionnaire')
//
//                       } else {
//                         owlChangeHeightReduce();
//                         clearInterval(elementsRemove);
//                       }
//                     }, 200);
//                   }
//                 }
//
//                 elemChildren.classList.add('visible'); // Показать скрытый блок
//                 elemButtonWrapper.classList.add('visible'); // Показать скрытую кнопку
//
//                 questionnaireFormChildrenSelect.forEach(elemSelect => {
//                   elemSelect.addEventListener('change', function () {
//                     if (elemChildren.querySelector('.questionnaire__form_row-create')) {
//                       createQuestionnaireFormRow.remove();
//                       createQuestionnaireFormRow.querySelector('.questionnaire__form_input').value = null;
//                       owlChangeHeightReduce();
//
//                     } else if (this.value === 'Свой вариант') {
//                       questionnaireFormChildrenDiFlex.forEach(elemDiFlex => {
//                         elemChildren.querySelector('.questionnaire__form_wrapper-block').insertBefore(createQuestionnaireFormRow, elemDiFlex);
//                         owlChangeHeightStretch();
//                       });
//                     }
//                   });
//                 });
//
//                 /** Если переключатель в положении НЕТ, то
//                  * удаляем все элементы со страницы, а так же из массива,
//                  * очищаем все поля форм. Клонированные блоки удаляем из DOM - дерева.
//                  * */
//                 if (this.checked === false) {
//                   if (elemChildren.classList.contains('deleteFormQuestionnaire') === false) { // Ищем класс
//                     elemChildren.classList.add('remove'); // Присваиваем класс если у элемента нет класса deleteFormQuestionnaire
//                   }
//                   elemChildren.classList.remove('visible');
//                   elemButtonWrapper.classList.add('remove');
//                   elemButtonWrapper.classList.remove('visible');
//                   questionnaireFormChildrenInputs.forEach(elemInputs => {
//                     if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
//                       elemInputs.value = '';
//                     }
//                   });
//                   questionnaireFormChildrenSelect.forEach(elemSelect => {
//                     if (elemSelect.value !== 0) {
//                       elemSelect.value = 0;
//                     }
//                   });
//
//                   if (createQuestionnaireFormRowYouVersion) {
//                     createQuestionnaireFormRowYouVersion.remove();
//                   }
//
//                   let elementsRemove = setInterval(() => {
//                     if (elemButtonWrapper.classList.contains('remove')) {
//                       elemChildren.classList.remove('remove');
//                       elemChildren.classList.remove('deleteFormQuestionnaire'); // Удаляем класс, чтобы при следующей проверке присвоить его
//                       arrayFormChildrenQuestionnaire.splice(0);
//                       elemButtonWrapper.classList.remove('remove');
//                       elemButtonWrapper.innerHTML = null;
//
//                     } else {
//                       if (elemChildren.classList.contains('clone')) {
//                         elemChildren.remove();
//                       }
//                       owlChangeHeightReduce();
//                       clearInterval(elementsRemove);
//                     }
//                   }, 200);
//                 }
//
//                 /** Клонирование блоков с формой **/
//                 buttonCreateBlock.addEventListener('click', evt => {
//                   evt.preventDefault();
//                   let createQuestionnaireFormRow = document.createElement('div');
//                   createQuestionnaireFormRow.className = 'questionnaire__form_row questionnaire__form_row-create';
//                   createQuestionnaireFormRow.innerHTML = `
//                     <input class="questionnaire__form_input" name="typeOfIncomeYourOption" type="text" form="formCustomerProfile" required/>
//                     <label class="questionnaire__form_label">Введите свой вид дохода</label>
//                   `;
//
//                   cloneQuestionnaireFormChildren = elemChildren.cloneNode(true); // Положим в переменную клонированный блок с формой
//
//                   if (cloneQuestionnaireFormChildren.classList.contains('visible')) {
//                     cloneQuestionnaireFormChildren.classList.add('clone');
//
//                   } else {
//                     cloneQuestionnaireFormChildren.classList.add('visible');
//                     cloneQuestionnaireFormChildren.classList.add('clone');
//                   }
//
//                   inputMaskSetup($(cloneQuestionnaireFormChildren));
//
//                   let cloneQuestionnaireFormRowYouVersion = cloneQuestionnaireFormChildren.querySelector('.questionnaire__form_row.questionnaire__form_row-create');
//                   let cloneQuestionnaireForWrapperBlock = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_wrapper-block');
//
//                   cloneQuestionnaireForWrapperBlock.forEach(cloneWrapperBlock => {
//                     let cloneQuestionnaireFormChildrenSelect = cloneWrapperBlock.querySelectorAll('.questionnaire__form_select');
//                     let cloneQuestionnaireFormChildrenDiFlex = cloneWrapperBlock.querySelectorAll('.questionnaire__form_d-flex');
//
//                     cloneQuestionnaireFormChildrenSelect.forEach(cloneSelect => {
//                       cloneSelect.addEventListener('change', function () {
//                         if (cloneWrapperBlock.querySelector('.questionnaire__form_row-create')) {
//                           createQuestionnaireFormRow.remove();
//                           createQuestionnaireFormRow.querySelector('.questionnaire__form_input').value = null;
//                           owlChangeHeightReduce();
//
//                         } else if (this.value === 'Свой вариант') {
//                           cloneQuestionnaireFormChildrenDiFlex.forEach(cloneDiFlex => {
//                             cloneWrapperBlock.insertBefore(createQuestionnaireFormRow, cloneDiFlex);
//                           });
//                           owlChangeHeightStretch();
//                         }
//                       });
//                     });
//                   });
//
//                   arrayFormChildrenQuestionnaire.push(cloneQuestionnaireFormChildren);
//
//                   let cloneInputs = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_input'); // Ищем все поля клонированных блоков с формой
//
//                   cloneInputs.forEach(elemCloneInputs => { // Перебираем все поля в массиве
//                     let deleteValue = setInterval(() => {
//                       if (elemCloneInputs.value !== '') { // Итерация будет работать пока все значения полей клонированной формы не будут удалены
//                         elemCloneInputs.value = '';
//
//                       } else { // Когда все значения полей удалены
//                         elemParentForm.insertBefore(cloneQuestionnaireFormChildren, elemButtonWrapper); // Добавляем клонированный блок перед кнопкой добавить
//                         owlChangeHeightStretch();
//                         clearInterval(deleteValue); // Останавливаем итерацию
//                       }
//                     }, 60);
//                   });
//
//                   if (cloneQuestionnaireFormRowYouVersion) {
//                     cloneQuestionnaireFormRowYouVersion.remove();
//                   }
//
//                   for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
//                     let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); // Ищем в этом массиве все кнопки удаления блока
//
//                     buttonDeleteBlock.forEach(elemButtonDelete => {
//                       elemButtonDelete.addEventListener('click', deleteBlockForm);
//                       elemButtonDelete.addEventListener('click', checkingForMissingVisible);
//                     });
//                   }
//                 });
//
//                 /** Удаление оригинальных блоков **/
//                 for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
//                   let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); //  Ищем в этом массиве все кнопки удаления блока
//
//                   buttonDeleteBlock.forEach(elemButtonDelete => {
//                     elemButtonDelete.addEventListener('click', deleteBlockForm);
//                     elemButtonDelete.addEventListener('click', checkingForMissingVisible);
//
//                     elemButtonDelete.addEventListener('click', () => {
//                       questionnaireFormChildrenInputs.forEach(elemInputs => {
//                         if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
//                           elemInputs.value = '';
//                         }
//                       });
//                       questionnaireFormChildrenSelect.forEach(elemSelect => {
//                         if (elemSelect.value !== 0) {
//                           elemSelect.value = 0;
//                         }
//                       });
//
//                       if (createQuestionnaireFormRowYouVersion) {
//                         createQuestionnaireFormRowYouVersion.remove();
//                       }
//                     });
//                   });
//                 }
//                 owlChangeHeightStretch();
//               });
//
//             } else {
//               elemChildren.classList.add('visible');
//
//               if (this.checked === false) {
//                 if (elemChildren.classList.contains('deleteFormQuestionnaire') === false) { // Ищем класс
//                   elemChildren.classList.add('remove'); // Присваиваем класс если у элемента нет класса deleteFormQuestionnaire
//                 }
//                 elemChildren.classList.remove('visible');
//                 arrayFormChildrenQuestionnaire.splice(0);
//                 questionnaireFormChildrenInputs.forEach(elemInputs => {
//                   if (elemInputs.value !== '') { // Если оригинальный блок удаляется, то и все его введенные значения тоже
//                     elemInputs.value = '';
//                   }
//                 });
//
//                 let elementsRemove = setInterval(() => {
//                   if (elemChildren.classList.contains('remove')) {
//                     elemChildren.classList.remove('remove');
//
//                   } else {
//                     owlChangeHeightReduce();
//                     clearInterval(elementsRemove);
//                   }
//                 }, 200);
//               }
//               owlChangeHeightStretch();
//             }
//           });
//         })
//       });
//     });
//   });
// }
//
// /** Компонент для клонирования видимого блока и кнопки "Добавить" **/
// function cloningQuestionnaireBlock() {
//   let owlHeightQuestionnaire = document.querySelector('.owl-stage-outer.owl-height');
//   let owlItem = owlHeightQuestionnaire.querySelectorAll('.owl-item');
//
//   owlItem.forEach(elemItem => {
//     const questionnaireFormParent = elemItem.querySelectorAll('.questionnaire__form_wrapper[name="visibleAndHiddenBlock"]');
//
//     /** Увеличивает высоту родительской обертки в соответствии с активным слайдом */
//     let owlChangeHeightStretch = () => {
//       if (elemItem.classList.contains('active')) {
//         let height = setInterval(() => {
//           if (owlHeightQuestionnaire.clientHeight < elemItem.clientHeight) {
//             owlHeightQuestionnaire.style.height = elemItem.scrollHeight + 'px';
//           } else {
//             clearInterval(height)
//           }
//         }, 60)
//       }
//     };
//
//     /** Уменьшает высоту родительской обертки в соответствии с активным слайдом */
//     let owlChangeHeightReduce = () => {
//       if (elemItem.classList.contains('active')) {
//         if (owlHeightQuestionnaire.clientHeight >= elemItem.clientHeight) {
//           owlHeightQuestionnaire.style.height = elemItem.clientHeight + 'px';
//         }
//       }
//     };
//
//     questionnaireFormParent.forEach(elemParentForm => {
//       let questionnaireFormChildren = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-parent');
//       let arrayFormChildrenQuestionnaire = [];
//       let cloneQuestionnaireFormChildren;
//       let buttonWrapperRow = elemParentForm.querySelectorAll('.questionnaire__form_wrapper-button');
//
//       if (elemParentForm.querySelector('.questionnaire__form_wrapper-button')) {
//         buttonWrapperRow.forEach(elemButtonWrapper => {
//           let buttonCreateBlock = elemButtonWrapper.querySelector('.button[name="createBlock"]');
//
//           if (buttonCreateBlock) {
//             let deleteBlockForm = function () {
//               let parentOne = this.closest('.questionnaire__form_wrapper-parent');
//               let index = arrayFormChildrenQuestionnaire.findIndex(el => el === parentOne);
//
//               parentOne.classList.add('remove');
//               parentOne.classList.remove('visible');
//
//               let elementsRemove = setInterval(() => {
//                 if (parentOne.classList.contains('remove')) {
//                   parentOne.classList.remove('remove');
//                   parentOne.classList.add('deleteFormQuestionnaire');
//                   arrayFormChildrenQuestionnaire.splice(index, 1);
//
//                   if (parentOne.classList.contains('clone')) {
//                     parentOne.remove();
//                   }
//
//                 } else {
//                   owlChangeHeightReduce();
//                   clearInterval(elementsRemove);
//                 }
//               }, 200);
//             }
//
//             questionnaireFormChildren.forEach(elemChildren => {
//               buttonCreateBlock.addEventListener('click', evt => {
//                 evt.preventDefault();
//
//                 let buttonDeleteBlock = document.createElement('div');
//                 buttonDeleteBlock.className = 'questionnaire__form_row questionnaire__form_end';
//                 buttonDeleteBlock.innerHTML = `
//                   <button class="button button__very-small button--red" name="deleteBlock" type="button" form="formCustomerProfile" role="button">
//                     <include src="../include/icons/common-icons/remove.html"></include>
//                     Удалить блок
//                   </button>
//                 `;
//
//                 cloneQuestionnaireFormChildren = elemChildren.cloneNode(true);
//                 cloneQuestionnaireFormChildren.querySelector('.questionnaire__form_wrapper-block').append(buttonDeleteBlock);
//
//                 let cloneInputs = cloneQuestionnaireFormChildren.querySelectorAll('.questionnaire__form_input');
//                 let cloneSwitches = cloneQuestionnaireFormChildren.querySelectorAll('.switches__checkbox');
//
//                 if (cloneQuestionnaireFormChildren.classList.contains('visible')) {
//                   cloneQuestionnaireFormChildren.classList.add('clone');
//
//                 } else {
//                   cloneQuestionnaireFormChildren.classList.add('visible');
//                   cloneQuestionnaireFormChildren.classList.add('clone');
//                 }
//
//                 inputMaskSetup($(cloneQuestionnaireFormChildren));
//
//                 arrayFormChildrenQuestionnaire.push(cloneQuestionnaireFormChildren);
//
//                 let deleteValue = setInterval(() => {
//                   cloneInputs.forEach(elemCloneInputs => {
//                     if (elemCloneInputs.value !== '') {
//                       elemCloneInputs.value = '';
//                     }
//                   });
//
//                   cloneSwitches.forEach(elemCloneSwitches => {
//                     if (elemCloneSwitches.checked) {
//                       elemCloneSwitches.checked = false;
//                     }
//                   });
//                   elemParentForm.insertBefore(cloneQuestionnaireFormChildren, elemButtonWrapper);
//
//                   owlChangeHeightStretch();
//                   clearInterval(deleteValue);
//                 }, 60);
//
//                 for (let i = 0; i < arrayFormChildrenQuestionnaire.length; i++) {
//                   let buttonDeleteBlock = arrayFormChildrenQuestionnaire[i].querySelectorAll('.button[name="deleteBlock"]'); // Ищем в этом массиве все кнопки удаления блока
//
//                   buttonDeleteBlock.forEach(elemButtonDelete => {
//                     elemButtonDelete.addEventListener('click', deleteBlockForm);
//                   });
//                 }
//
//                 owlChangeHeightStretch();
//               });
//             });
//           }
//         });
//       }
//     });
//   });
// }
//
// function inputMaskSetup($cloneQuestionnaireFormChildren) {
//   setTimeout(() => {
//     let $parentForm = $cloneQuestionnaireFormChildren;
//     let $marketPrice = $parentForm.find('.marketPrice'); // Маска для поля ввода суммы денег
//     let $indicateYourShare = $parentForm.find('.shareOfProperty'); // Маска для доли в жилье
//     let $INN = $parentForm.find('.inn');
//     let $numberContract = $parentForm.find('.number'); // Номер договора
//     let $yearInQuestionnaire = $parentForm.find('.yearInQuestionnaire');
//
//     $INN.inputmask("9{10}", {"placeholder": ""});
//     $numberContract.inputmask("(9){+|1}-(9){+|1}", {"placeholder": "0"});
//     $yearInQuestionnaire.inputmask("9999 г.");
//
//     $marketPrice.inputmask({
//       mask: "( 999){+|1} ₽",
//       radixPoint: ",",
//       _radixDance: true,
//       numericInput: true,
//       placeholder: ""
//     });
//
//     $indicateYourShare.inputmask({
//       mask: "X9/X9",
//       placeholder: "",
//       definitions: {
//         "X": {
//           validator: "[1-9]",
//           placeholder: "1"
//         }
//       }
//     });
//   }, 100);
// }
//
// // function validateAllInputs() {
// //   const buttonSendQuestionnaire = document.querySelector('button[name="sendQuestionnaire"]');
// //   const owlStageParent = document.querySelector('.owl-stage');
// //   const owlItemChildren = owlStageParent.querySelectorAll('.owl-item');
// //
// //   for (let i = 0; i < owlItemChildren.length; i++) {
// //     let owlItemChildrenInput = owlItemChildren[i].querySelectorAll('input[]');
// //
// //     for (let x = 0; x < owlItemChildrenInput.length; x++) {
// //
// //     }
// //   }
// // }
//
//
// // validateAllInputs();
//
//
