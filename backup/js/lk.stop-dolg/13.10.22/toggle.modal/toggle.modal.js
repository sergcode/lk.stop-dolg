"use strict";

window.addEventListener('DOMContentLoaded', () => {
  const mediaQueryTaskSmart = window.matchMedia('(max-width: 440.98px)');
  const toggleModalBg = document.createElement('div');
  toggleModalBg.classList.add('toggle-modal-bg', 'js-overlay-modal');
  document.body.append(toggleModalBg);
  const modalButtons = document.querySelectorAll('.js-open-modal'),
        overlay = document.querySelector('.js-overlay-modal'),
        closeButtons = document.querySelectorAll('.js-modal-close'),
        tabButton = document.querySelector('button.tab__button[data-modal]'),
        toggleModal = document.querySelectorAll('.toggle-modal'),
        wrapperCreatedFilesScroll = 'attach__wrapper-created-files_scroll';
  toggleModal.forEach(modal => {
    closeModalBtn(closeButtons);
    keyCloseModal(modal);
    closeModalOverlay(modal);
    handleOrientationChangeSmartphone(mediaQueryTaskSmart, modal);
  });
  /** todo Открыть модальное окно  */

  function openModal() {
    modalButtons.forEach(item => {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal'),
              modalElem = document.querySelector('.toggle-modal[data-modal="' + modalId + '"]'),
              wrapperCreatedFiles = modalElem.querySelector('.attach__wrapper-created-files');
        modalElem.classList.add('active');
        overlay.classList.add('active');
        if (wrapperCreatedFiles) addScroll(wrapperCreatedFiles);
        handleOrientationChangeSmartphone(mediaQueryTaskSmart, modalElem);
      });
    });
  }
  /** todo Закрыть модальное окно кнопкой */


  function closeModalBtn(closeElement) {
    closeElement.forEach(item => {
      item.addEventListener('click', function () {
        const parentModalClose = this.closest('.toggle-modal');

        if (parentModalClose.classList.contains('active') && parentModalClose.getAttribute('style')) {
          parentModalClose.removeAttribute('style');
        }

        if (parentModalClose.classList.contains('active')) {
          parentModalClose.classList.add("remove");
          overlay.classList.add("remove");
          setTimeoutCloseModal(parentModalClose);
        }
      });
    });
  }
  /** todo Закрыть модальное окно кликом по фону */


  function closeModalOverlay(modal) {
    overlay.addEventListener('click', e => {
      e.preventDefault();

      if (modal.classList.contains('active')) {
        modal.classList.add("remove");
        overlay.classList.add("remove");
        setTimeoutCloseModal(modal);
      }
    });
  }
  /** todo Закрыть модальное окно нажатием на клавишу Escape */


  function keyCloseModal(modal) {
    document.body.addEventListener('keyup', e => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.add("remove");
        overlay.classList.add("remove");
        setTimeoutCloseModal(modal);
      }
    });
  }
  /** todo Удаление классов и атрибутов у элементов модального окна через 300ms */


  function setTimeoutCloseModal(parentModalClose) {
    setTimeout(() => {
      parentModalClose.classList.remove('active');
      parentModalClose.classList.remove("remove");
      overlay.classList.remove('active');
      overlay.classList.remove("remove");
      tabAction();
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

  function handleOrientationChangeSmartphone(mqts, modalElem) {
    if (modalElem && modalElem.classList.contains('active')) {
      const innerHeight = window.innerHeight,
            modalBox = modalElem.querySelector('.toggle-modal__box'),
            wrapperCreatedFiles = modalElem.querySelector('.attach__wrapper-created-files');

      if (mqts.matches) {
        if (modalElem.classList.contains('toggle-modal__scroll')) {
          modalElem.classList.add('toggle-modal__animation-hide');
          modalElem.classList.remove('toggle-modal__scroll');
          modalBox.removeAttribute('style');
          setTimeout(() => modalElem.classList.remove('toggle-modal__animation-hide'), 1000);
        }
      } else {
        if (wrapperCreatedFiles && wrapperCreatedFiles.classList.contains(wrapperCreatedFilesScroll)) {
          wrapperCreatedFiles.classList.remove(wrapperCreatedFilesScroll);
        }

        if (modalBox.scrollHeight > innerHeight && !modalElem.classList.contains('toggle-modal__scroll')) {
          modalElem.classList.add('toggle-modal__scroll');
          modalBox.style.maxHeight = `${innerHeight}px`;
        }
      }
    }
  }
  /** todo Если размер экрана равен смартфону, то добавить скролл для блока с прикрепленными файлами, если файлов больше трех */


  function addScroll(parent) {
    if (mediaQueryTaskSmart.matches) {
      if (parent.childElementCount > 2) {
        parent.classList.add(wrapperCreatedFilesScroll);
      } else {
        parent.classList.remove(wrapperCreatedFilesScroll);
      }
    }
  }
  /*function screenSize(modal, mediaQueryTaskSmart) {
  	const innerHeight = window.innerHeight,
  				modalBox = modal.querySelector('.toggle-modal__box');
  
  	if (mediaQueryTaskSmart.matches) {
  		if (modalBox.scrollHeight < innerHeight) {
  			if (modal.classList.contains('toggle-modal__scroll')) {
  				modal.classList.add('toggle-modal__animation-hide');
  				modal.classList.remove('toggle-modal__scroll');
  				modalBox.removeAttribute('style');
  				setTimeout(() => modal.classList.remove('toggle-modal__animation-hide'), 1000);
  			}
  		}
  	} else {
  		if (modalBox.scrollHeight > innerHeight) {
  			if (!modal.classList.contains('toggle-modal__scroll')) {
  				modal.classList.add('toggle-modal__scroll');
  				modalBox.style.height = `${innerHeight}px`;
  			}
  		}
  	}
  }*/


  tabAction();
  openModal();
  mediaQueryTaskSmart.addEventListener('change', handleOrientationChangeSmartphone);
});