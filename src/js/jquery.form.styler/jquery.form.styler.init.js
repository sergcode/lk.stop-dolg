(function ($) {
  $(function () {
    $('.select, .questionnaire__form_row input[type="radio"], .popup__radio input[type="radio"]').styler({
      selectPlaceholder: '',
      selectSmartPositioning: '',
      onSelectOpened: () => {
        $('.toggle-modal .jq-selectbox__dropdown').find('ul').css('max-height', '205px');
      }
    });
  });
})(jQuery);
