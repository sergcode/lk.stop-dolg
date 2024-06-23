"use strict";

window.addEventListener('DOMContentLoaded', () => {
  function copyLinkRadioForBtn() {
    const formBtn = document.querySelector('.popup__form .button--green');
    document.body.addEventListener('click', e => {
      const target = e.target,
            jqRadio = target.matches('.popup__form .jq-radio');

      if (target && jqRadio && target.classList.contains('checked')) {
        const jqRadioInput = target.querySelector('input[type="radio"]').getAttribute('data-pay-link');
        formBtn.setAttribute('href', `${jqRadioInput}`);
      }
    });
  }

  copyLinkRadioForBtn();
});