'use strict';

let commentValue = '';

function validateForm(form) {
  let fail = false;
  let comment = form.comment,
      formTooltip = form.querySelectorAll('.form__tooltip'),
      formTooltipSpan = form.querySelector('.form__tooltip span'),
      button = form.button;

  comment.classList.add('visible');

  if (comment.value === "" || comment.value.length < 10 || comment.value.indexOf('  ') >= 0) {
    comment.style.cssText = `
      border-color: #fe4f3e; 
      box-shadow: 0 0 12px rgba(252, 78, 63, 0.5);`;

    formTooltip.forEach(elem => {
      elem.style.cssText = `
        visibility: visible; 
        opacity: 1;
        bottom: 0;`;
    });

    comment.oninput = function () {
      formTooltip.forEach((elem) => {
        elem.style.cssText = `
          visibility: visible; 
          opacity: 1;
          bottom: 0;`;

        button.innerText = 'Отменить перевод';
        formTooltipSpan.innerText = this.value.length;
        comment.style.cssText = `
          border-color: #fe4f3e; 
          box-shadow: 0 0 12px rgba(252, 78, 63, 0.5);`;

        if (comment.value.indexOf('  ') >= 0) {
          comment.setAttribute('disabled', 'disabled');
          comment.placeholder = 'Запрещается вводить 2 пробела подряд! Для продолжения ввода комментария отмените перевод и запросите снова.';
          formTooltipSpan.innerText = 'Вы ввели 2 пробела подряд!';
          commentValue = cleanDoubleSpaces(this.value);
          comment.value = '';
        }

        if (comment.value.length >= 10) {
          button.innerText = 'Направить перевод';
          elem.removeAttribute('style');
          comment.removeAttribute('style');
        }
      });
    };

    if (button.innerText === 'Отменить перевод') {
      button.innerText = 'Запросить перевод';
      comment.classList.remove('visible');
      comment.removeAttribute('style');
      comment.removeAttribute('disabled');
      comment.placeholder = 'Введите комментарий';

      if (commentValue !== '') {
        comment.value = `${commentValue}`;
      }

      formTooltip.forEach(elem => {
        elem.removeAttribute('style');
      });

      formTooltipSpan.innerText = '0';

      return fail;
    }

    fail = "Отменить перевод";

  } else if (comment.value.length > 10 && button.innerText === 'Запросить перевод') {
    comment.removeAttribute('style');
    formTooltip.forEach((elem) => {
      elem.removeAttribute('style');
    });

    fail = "Направить перевод";
  }

  if (fail) {
    button.innerText = `${fail}`;
    return false;

  } else {
    button.setAttribute('disabled', 'disabled');
    comment.setAttribute('disabled', 'disabled');
    comment.classList.add('hidden');
    formTooltip.forEach(elem => {
      elem.classList.add('success');
      elem.innerHTML = 'Запрос на перевод отправлен';
    });

    return true;
  }

}

function cleanDoubleSpaces(str) {
  return str.replace(/\s{2,}/g, '');
}
