function resizeHeightTextarea() {
  let tasksIncome = document.querySelectorAll('.zpz-work-task__tasks');
  tasksIncome.forEach(function (tasks) {
    let textarea = tasks.querySelector('textarea');

    if (textarea.textLength > 0) {
      textarea.style.cssText = 'min-height:' + textarea + 'px';
      textarea.style.cssText = 'min-height:' + textarea.scrollHeight + 'px';
    }

    textarea.addEventListener('keydown', autosize);

    function autosize() {
      let el = this;
      setTimeout(function () {
        // el.style.cssText = 'min-height:' + el.textLength + 'px';
        el.style.cssText = 'min-height:' + el.scrollHeight + 'px';
      }, 0);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  resizeHeightTextarea();
});
window.addEventListener('resize', () => {
  resizeHeightTextarea();
});
