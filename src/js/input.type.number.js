/* Разрешает ввод только цифр в input */

function validateNumber(evt) {
  const {event} = window;
  let theEvent = evt || event;
  let key = theEvent.keyCode || theEvent.which;
  key = String.fromCharCode(key);
  let regex = /[0-9]|\./;

  if (!regex.test(key)) {
    theEvent.returnValue = false;
    if (theEvent.preventDefault) theEvent.preventDefault();
  }
}
