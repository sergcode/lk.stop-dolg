!function (e) {
  "function" != typeof e.matches && (e.matches = e.msMatchesSelector || e.mozMatchesSelector || e.webkitMatchesSelector || function (e) {
    for (var t = this, o = (t.document || t.ownerDocument).querySelectorAll(e), n = 0; o[n] && o[n] !== t;) ++n;

    return Boolean(o[n]);
  }), "function" != typeof e.closest && (e.closest = function (e) {
    for (var t = this; t && 1 === t.nodeType;) {
      if (t.matches(e)) return t;
      t = t.parentNode;
    }

    return null;
  });
}(window.Element.prototype);

document.addEventListener('DOMContentLoaded', function () {
  /* Записываем в переменные массив элементов-кнопок и подложку.
     Подложке зададим id, чтобы не влиять на другие элементы с классом overlay */
  let modalButtons = document.querySelectorAll('.js-open-modal');
  let overlay = document.querySelector('.js-overlay-modal');
  let closeButtons = document.querySelectorAll('.js-modal-close');
  let parentModal = document.querySelectorAll('.toggle-modal');
  let tabButton = document.querySelector('button.tab__button[data-modal]');
  let formTextarea = document.getElementById('formModalComment');
  let formSubmit = document.querySelector('.form-modal__submit');
  let successfullyComment = document.querySelector('.toggle-modal__successfully');
  let formCommentLength = document.getElementById('formModalCommentLength');
  let formTooltip = document.querySelector('.form-modal__tooltip');
  let checkedStar = document.querySelector('input[name="rating"]');

  /* Перебираем массив кнопок */
  modalButtons.forEach(function (item) {
    /* Назначаем каждой кнопке обработчик клика */
    item.addEventListener('click', function (e) {
      /* Предотвращаем стандартное действие элемента. Так как кнопку разные
         люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
         Нужно подстраховаться. */
      e.preventDefault();
      /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
         и будем искать модальное окно с таким же атрибутом. */

      let modalId = this.getAttribute('data-modal'),
          modalElem = document.querySelector('.toggle-modal[data-modal="' + modalId + '"]');
      /* После того как нашли нужное модальное окно, добавим классы
         подложке и окну чтобы показать их. */

      modalElem.classList.add('active');
      overlay.classList.add('active');
    }); // end click
  }); // end foreach

  function tabAction() {
    if (tabButton) {
      tabButton.onclick = () => {
        tabButton.classList.add('active');
      };

      tabButton.classList.remove("active");
    }
  }
  /* Вызов модалки в табах Полезная информация */

  tabAction();
  /* Отслеживаем события textarea */
  formTextarea.addEventListener("input", function () {
    formCommentLength.innerText = this.value.length; // Считаем и выводим в tooltip количество введенных символов

    if (formTextarea.value.length >= 5) {
      // Если количество введенных символов больше или равно 5-ти, то скрываем tooltip
      formTooltip.removeAttribute('style'); // Иначе если меньше 5-ти, то при нажатии кнопки Отправить отзыв показываем tooltip

      formTextarea.removeAttribute('style');
    }
  });
  /* Отслеживаем событие click на кнопке Оставить отзыв */

  parentModal.forEach(parentModalArray => {

    formSubmit.addEventListener('click', function () {
      if (formTextarea.value.length >= 5) {
        // Проверяем, если поле комментария больше или равно 5-ти символам, то
        parentModalArray.classList.add('remove'); // Скрываем модалку с отзывом и

        setTimeout(() => {
          parentModalArray.classList.remove('active');
          parentModalArray.classList.remove('remove');
          successfullyComment.classList.add('active'); // Вызываем модалку с успешно отправленным отзывом
        }, 300);
        overlay.addEventListener('click', function () {
          // Отслеживаем клик по фону
          successfullyComment.classList.add('remove'); // Скрываем модалку с успешно отправленным отзывом

          setTimeout(() => {
            successfullyComment.classList.remove('active');
            successfullyComment.classList.remove('remove');
          }, 300);
        });
        setTimeout(() => {
          // После того как закрыли модалку с успешно отправленным отзывом, очищаем textarea через 1c
          formTextarea.value = "";
          formCommentLength.innerText = "0"; // Сбросить число введенных символов

          checkedStar.checked = false; // Убираем все чекбоксы со звезд

        }, 1000);

        let fd = new FormData();

        fd.append("action", "sendRating");
        fd.append("rating", $("input[name=rating]:checked").val());
        fd.append("message", $("#formModalComment").val());

        fetch("/assets/ajax.php", {
          method: 'POST',
          body: fd
        }).then(function(result) {
          if (result.status === 200) {
            return result.json();
          }
        });

      } else {
        // Показать tooltip уведомление
        formTooltip.style.cssText = `
            visibility: visible; 
            opacity: 1;
            bottom: -10px;
            `;
        formTextarea.style.cssText = `border: 1px solid #fe4f3e;`; // Сделать красную обводку у textarea
      }
    });
    closeButtons.forEach(function (item) {
      item.addEventListener('click', function (e) {
        let parentModalClose = this.closest('.toggle-modal');
        parentModalClose.classList.add("remove");
        overlay.classList.add("remove");
        setTimeout(() => {
          parentModalClose.classList.remove('active');
          parentModalClose.classList.remove("remove");
          overlay.classList.remove('active');
          overlay.classList.remove("remove");
          tabAction();
          formTooltip.removeAttribute('style');
          formTextarea.removeAttribute('style');
        }, 300);
      });
    });

    document.body.addEventListener('keyup', function (e) {
      let key = e.keyCode;

      if (key == 27) {
        document.querySelector('.toggle-modal.active').classList.remove('active');
        document.querySelector('.toggle-modal-bg').classList.remove('active');
      }
    }, false);

    overlay.addEventListener('click', function () {
      parentModalArray.classList.add("remove");
      overlay.classList.add("remove");
      setTimeout(() => {
        parentModalArray.classList.remove('active');
        parentModalArray.classList.remove("remove");
        overlay.classList.remove('active');
        overlay.classList.remove("remove");
        tabAction();
        formTooltip.removeAttribute('style');
        formTextarea.removeAttribute('style');
      }, 300);
    });
  });
});
