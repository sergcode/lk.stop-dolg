/**
 * Функция запускает модальное с сообщением при загрузке страницы.
 * В начале функции присваиваем переменной имя cookies, чтобы проверить первый вход в ЛК.
 * Присваиваем прозрачной, темной подложке атрибут data-modal
 * с таким же значением как у модального окна. Это нужно для того, чтобы при клике на
 * подложку закрылось нужное модальное окно.
 */

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
      '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)'));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

let showMessageClientPTF = getCookie('messageForClientPTF');

document.addEventListener('DOMContentLoaded', () => {
  let toggleModalId = document.getElementById('messageForClientPTF'),
      toggleModalIdDataModal = toggleModalId.getAttribute('data-modal');
  let overlay = document.querySelector('.js-overlay-modal');
  overlay.setAttribute('data-modal', '' + toggleModalIdDataModal + '');
  let closeButtons = document.querySelectorAll('.js-modal-close');

  if (showMessageClientPTF !== 'no') {
    toggleModalId.classList.add('active');
    overlay.classList.add('active');

    let date = new Date;
    date.setDate(date.getDate() + 1);
    document.cookie = 'messageForClientPTF=no; path=/; expires=' + date.toUTCString();

  }

  closeButtons.forEach(item => {
    item.addEventListener('click', function () {
      let parentModalClose = this.closest('.toggle-modal');
      parentModalClose.classList.add("remove");
      overlay.classList.add("remove");

      setTimeout(() => {
        parentModalClose.classList.remove('active');
        parentModalClose.classList.remove("remove");
        overlay.classList.remove('active');
        overlay.classList.remove("remove");
      }, 300);
    });
  });

  overlay.addEventListener('click', function() {
    let modalId = this.getAttribute('data-modal'),
        modalElem = document.querySelector('.toggle-modal[data-modal="' + modalId + '"]');
    modalElem.classList.add("remove");
    overlay.classList.add("remove");

    setTimeout(() => {
      modalElem.classList.remove('active');
      modalElem.classList.remove("remove");
      overlay.classList.remove('active');
      overlay.classList.remove("remove");

    }, 300);
  });
});
