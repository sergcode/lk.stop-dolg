document.addEventListener('DOMContentLoaded', () => {
  readMoreElement();
});
window.addEventListener('resize', () => {
  readMoreElement();
});

function readMoreElement() {
  const zpzWorkTaskBody = document.querySelector('.zpz-work-task__body');
  const zpzReadMore = zpzWorkTaskBody.querySelectorAll('.zpz-readmore');
  const textareaWrapper = zpzWorkTaskBody.querySelectorAll('.zpz-work-task__textarea_wrapper');

  textareaWrapper.forEach(textareaWrapperEl => {
    let textareaHeight = textareaWrapperEl.querySelectorAll('textarea');
    let readMoreButton = document.createElement('a');
    readMoreButton.className = 'readmore__button';
    readMoreButton.innerHTML = '<svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg>';

    textareaHeight.forEach(textarAll => {
      let textareaHeightOrigin = textarAll;
      let textareaHeightDefault = textareaHeightOrigin.style.cssText = 'min-height: ' + textarAll.scrollHeight + 'px;';

      if (textarAll.clientHeight > 152) {
        textareaWrapperEl.classList.add('readmore__bg');
        textareaWrapperEl.insertAdjacentElement('beforeend', readMoreButton);
        textareaHeightOrigin.style.cssText = 'min-height: 153px;';

        readMoreButton.addEventListener('click', function (b) {
          b.preventDefault();
          this.classList.toggle('active');
          textareaWrapperEl.classList.add('readmore__bg');
          textareaWrapperEl.classList.toggle('readmore__bg_hidden');
          textareaHeightOrigin.style.cssText = textareaHeightDefault;

          this.addEventListener('click', () => {
            if (textareaHeightOrigin.clientHeight > 152) {
              textareaHeightOrigin.style.cssText = 'min-height: 153px;';
            }
          });
        });
      }
    })

    // Начинаю отслеживать изменения
    zpzWorkTaskBody.addEventListener('DOMNodeInserted', function (event) {
      let readMoreJsToggle = this.querySelectorAll('.readmore-js-toggle');

      readMoreJsToggle.forEach(readMoreJsToggleItem => { // Создал массив круглых кнопок (>)
        readMoreJsToggleItem.addEventListener('click', function (e) { // Присвоил всем кнопкам обработчик клика
          e.preventDefault();

          let i = setInterval(() => { // Слежу на изменениями
            let readMoreJsToggleActive = this.classList.contains('active');
            zpzReadMore.forEach(elem => { // Создал массив обертки для textarea
              let textarea = zpzWorkTaskBody.querySelectorAll('textarea');

              let f = setInterval(() => { // Слежу на изменениями
                if (elem.classList.contains('readmore-js-expanded')) {
                  clearInterval(f);

                  textarea.forEach(textareaHeightEl => { // Создал массив для textarea

                    if (textareaHeightEl.scrollHeight < 153) { // Если textarea меньше 153
                      clearInterval(i);

                      textareaHeightEl.style.cssText = 'min-height:' + textareaHeightEl.scrollHeight + 'px;';

                      for (let i = 0; i < textareaHeightEl.parentElement.childNodes.length; i++) {
                        if (textareaHeightEl.parentElement.childNodes[i].className === 'readmore__button') {
                          textareaHeightEl.parentElement.childNodes[i].classList.add('hide');

                          if (textareaHeightEl.parentElement.classList.contains('readmore__bg')) {
                            textareaHeightEl.parentElement.classList.add('readmore__visible');
                          }
                        }
                      }
                    }
                  });
                } else if (elem.classList.contains('close-readmore')) {
                  textarea.forEach(textareaAll => {
                    if (textareaAll.scrollHeight > 153) {
                      clearInterval(f);
                      textareaAll.style.cssText = 'min-height: 153px;';
                      readMoreButton.classList.remove('active');
                      for (let i = 0; i < textareaAll.parentElement.childNodes.length; i++) {
                        if (textareaAll.parentElement.childNodes[i].className === 'readmore__button') {
                          textareaAll.parentElement.childNodes[i].classList.remove('hide');

                          textareaAll.parentElement.classList.add('readmore__bg');
                        }
                      }
                    }
                  });
                }
              });
            });

            if (readMoreJsToggleActive) {
              clearInterval(i);
              console.log(readMoreJsToggleActive);
              let readMoreJsToggleActiveAll = zpzWorkTaskBody.querySelectorAll(readMoreJsToggleActive);
              readMoreJsToggleActiveAll.forEach(arrayReadMoreJs => {


              });
            }

          });
        });
      });
    }, false);
  });
}




