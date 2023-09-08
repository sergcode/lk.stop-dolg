/** TooltipFadeInDown - появление подсказки снизу **/
(function () {
  $('.tooltip__default_fadeInDown').tooltipster({
    animation: 'fade',
    trigger: 'hover',
    position: 'bottom',
    maxWidth: 350,
    debug: false,
    theme: 'tooltipster-default',
    touchDevices: false,
  });
})(jQuery);
