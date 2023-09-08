function resizeHeightTextarea() {
  let tasksIncome = document.querySelectorAll('.zpz-work-task__tasks');
  tasksIncome.forEach(function (tasks) {
    let textarea = tasks.querySelectorAll('textarea');

    textarea.forEach(function (elem) {
      if (elem.textLength > 0) {
        elem.style.cssText = 'min-height:' + elem + 'px';
        elem.style.cssText = 'min-height:' + elem.scrollHeight + 'px';
      }

      elem.addEventListener('keydown', autosize);

      function autosize() {
        let el = this;
        setTimeout(function () {
          el.style.cssText = 'min-height:' + el.scrollHeight + 'px';
        }, 0);

      }
    })
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resizeHeightTextarea();
});
window.addEventListener('resize', () => {
  resizeHeightTextarea();
});
