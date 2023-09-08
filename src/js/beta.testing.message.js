"use strict";

window.addEventListener('DOMContentLoaded', () => {
  const betaMessage = document.querySelector('.beta-message');

  // Объект для манипуляциями над баннером
  const betaBanner = {
    remind: function() {
      this.timeoutID = undefined; // - это числовой ID, который может быть использован позже с window.clearTimeout()
    },
    hideBanner: function () { // Действие для скрытия баннера по кнопке или автоматически
      betaMessage.classList.add('beta-message__hide');
      betaMessage.style.maxHeight = null;

      setTimeout(function () {
        betaMessage.remove();
      },200);
    },

    hideAutoRemove: function () { // Автоматическое скрытие баннера
      this.timeoutID = setTimeout(function (msg) {
        this.remind(msg);
        betaBanner.hideBanner();

      }.bind(this), 5000);
    },
    stopAutoRemove: function () { // Остановить Авто скрытие баннера
      clearTimeout(this.timeoutID)
    }
  };

  // Если у body нет класса tourBannerBeta__auto-remove и у баннера есть класс beta-message__auto-hide, то запустить автоскрытие баннера
  function autoHideClass(selector) {
    if (!document.body.classList.contains('tourBannerBeta__auto-remove') && betaMessage.classList.contains('beta-message__auto-hide')) {
      betaBanner.hideAutoRemove();
      selector.addEventListener('mouseover', () => betaBanner.stopAutoRemove());
      selector.addEventListener('mouseout', () => betaBanner.hideAutoRemove());
    }
  }

  if (betaMessage) {
    const buttonCloseMessage = betaMessage.querySelector(".beta-message__close"),
          eventB24Widget = new Event('click'); // Эмуляция клика

    betaMessage.style.maxHeight = betaMessage.scrollHeight + 'px';

    // Событие для закрытия баннера по крестику
    if (buttonCloseMessage) {
      buttonCloseMessage.addEventListener('click', (e) => {
        e.preventDefault();
        betaBanner.hideBanner()
      });
    }

    // Если ключа tourBannerBeta_end в локальном хранилище нет, то остановить авто скрытие баннера
    if (!localStorage.getItem('tourBannerBeta_end')) {
      betaBanner.stopAutoRemove(); // Остановить авто скрытие баннера
      document.body.classList.add('tourBannerBeta__auto-remove'); // Добавить класс, чтобы потом запустить авто скрытие баннера
    }

    // Проверяем, что нажата кнопка закрытия модалки тура
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList.contains('tourBannerBeta__close')) {
        document.body.classList.remove('tourBannerBeta__auto-remove'); // Удаляем класс из body
        autoHideClass(betaMessage); // Проверяем, если класса tourBannerBeta__auto-remove нет, то запустить авто скрытие баннера
      }
    });

    autoHideClass(betaMessage);

    // При нажатии на кнопку ЧАТ имитируется нажатие на виджет-чат B24
    document.querySelector('.beta-message__chat').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.b24-widget-button-inner-container').dispatchEvent(eventB24Widget);
    });
  }
});
