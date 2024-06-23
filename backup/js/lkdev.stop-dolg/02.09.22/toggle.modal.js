"use strict";

window.addEventListener('DOMContentLoaded', () => {
  const toggleModalBg = document.createElement('div');
  toggleModalBg.classList.add('toggle-modal-bg', 'js-overlay-modal');
  document.body.append(toggleModalBg);

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

  const modalButtons = document.querySelectorAll('.js-open-modal'),
        overlay = document.querySelector('.js-overlay-modal'),
        closeButtons = document.querySelectorAll('.js-modal-close'),
        tabButton = document.querySelector('button.tab__button[data-modal]'),
        checkedStar = document.querySelector('input[name="rating"]'),
        toggleModal = document.querySelectorAll('.toggle-modal');
  let filesArr;
  filesArr = [];
  toggleModal.forEach(modal => {
    const formModalAjaxSave = modal.querySelector('.ajax-save');

    if (formModalAjaxSave) {
      const formSelect = formModalAjaxSave.querySelector('select'),
            formTextarea = formModalAjaxSave.querySelector('textarea'),
            formTooltip = formModalAjaxSave.querySelector('.form-modal__tooltip'),
            formCommentLength = formModalAjaxSave.querySelector('.form-modal__tooltip span'),
            wrapperCreatedFiles = formModalAjaxSave.querySelector('.attach__wrapper-created-files');
      const inputs = formModalAjaxSave.querySelectorAll('input[type="file"]');
      changeSelect(formSelect, formModalAjaxSave);
      inputs.forEach(input => {
        input.addEventListener('change', function () {
          for (let file of this.files) {
            if (filesArr.length > 0) {
              if (filesArr.some(({
                name
              }) => name === file.name)) {
                continue;
              }

              filesArr.push(file);
            } else {
              filesArr.push(file);
            }
          }

          console.log(filesArr);
        });
      });

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
          } // if (inputTypeFiles) {
          // 	const files = inputTypeFiles.files;
          // 	for (let i = 0; i < files.length; i++) filesArr.push(files.item(i));
          // }
          // Проверяет, если поле комментария больше или равно 5-ти символам, то


          if (formTextarea.value.length >= 5) {
            if (filesArr.length) {
              for (let file of filesArr) {
                formData.append("files[]", file);
                console.log(formData);
              }
            }

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
                  setTimeout(() => {
                    // После того как модалку с успешно отправленным отзывом закрыта, очистить textarea через 1c
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
          } else {
            // Показать tooltip уведомление
            formCommentLength.innerText = formTextarea.value.length;
            formTooltip.classList.add('active');
            formTextarea.classList.add('invalid-input-select-textarea');
          }
        });
        formTextarea.addEventListener('focus', function () {
          this.classList.add('valid');
        });
        formTextarea.addEventListener('blur', function () {
          if (!this.value) this.classList.remove('valid');
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
  /* todo Закрыть модальное окно кликом по фону */


  function closeModalOverlay(modal, formTextarea, formTooltip) {
    overlay.addEventListener('click', () => {
      if (modal.classList.contains('active')) {
        modal.classList.add("remove");
        overlay.classList.add("remove");
        setTimeoutCloseModal(modal, formTooltip, formTextarea);
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
      filesArr = [];

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

  tabAction();
  openModal();
});