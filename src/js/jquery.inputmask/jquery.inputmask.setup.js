"use strict";

(function($){
  $(function () {
    const $marketPrice = $('.marketPrice'), // Маска для денежного поля
        $indicateYourShare = $('.shareOfProperty'), // Маска для доли в жилье
        $INN = $('.inn'),
        $numberContract = $('.number'), // Номер договора
        $yearInQuestionnaire = $('.yearInQuestionnaire'),
        $phone = $('input[name="phone"]');

    $INN.inputmask("9{10}", { "placeholder" : ""});
    $numberContract.inputmask("(9){+|1}-(9){+|1}", { "placeholder" : "0" });
    $yearInQuestionnaire.inputmask("9999 г.");

    $marketPrice.inputmask({
      mask: "( 999){+|1} ₽",
      radixPoint: ",",
      _radixDance: true,
      numericInput: true,
      placeholder: ""
    });

    $indicateYourShare.inputmask({
      mask: "X9/X9",
      placeholder: "",
      definitions: {
        "X": {
          validator: "[1-9]",
          placeholder: "1"
        }
      }
    });

    $.fn.hasAttr = function(name) {
      return this.attr(name) !== undefined;
    };

    $phone.on('focus', function () {
      $(this).inputmask('8 (999) 999-9999');
    });
    $phone.on('blur', function () {
      $(this).inputmask('remove');
    });

    $phone.on('input', function () {
      const $thisInput = $(this),
            $thisInputParent = $thisInput.parent();

      if ($thisInputParent.hasClass('error') && $thisInput.val().length > 0) {
        errorMessageRemoveClass(this);
      }
    });
  });
})(jQuery);


function errorMessageRemoveClass(input) {
  const inputContainers = input.parentElement,
      errorMessage = inputContainers.querySelector('.login__error');
  errorMessage.classList.add('hide');
  setTimeout(() => {
    errorMessage.classList.remove('active');
    errorMessage.classList.remove('hide');
  }, 100);
  inputContainers.classList.remove('error');
}
