let readMoreJsToggle = document.querySelectorAll('.readmore-js-toggle');

let observer = new MutationObserver(mutations => {
  for(let mutation of mutations) {
    // проверим новые узлы
    for(let node of mutation.target.childNodes) {
      console.log(mutation.target.childNodes)
    }

  }
});

let zpzWorkTaskBody = document.getElementById('zpzWorkTaskBody');

observer.observe(zpzWorkTaskBody, {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: true
});

/*const zpzReadMore = zpzWorkTaskBody.querySelectorAll('.zpz-readmore');
zpzReadMore.forEach(zpzReadMoreAll => {

  const textareaWrapper = zpzReadMoreAll.querySelectorAll('.zpz-work-task__textarea_wrapper');
  textareaWrapper.forEach(textareaWrapperAll => {

    let textareaHeight = textareaWrapperAll.querySelectorAll('textarea');
    textareaHeight.forEach(textareaAll => {


      if (textareaAll.clientHeight > 152) {

        textareaWrapperAll.classList.add('readmore__bg');
        textareaAll.style.cssText = 'min-height: 153px;';

        observer.disconnect();
      } else {
        textareaAll.style.cssText = 'min-height: 153px;';
        observer.disconnect();
      }
    });

  });
});*/



function observerEvents() {

}

// observerEvents();
//
// window.addEventListener('resize', () => {
//   observerEvents();
// });

