(function ($) {
  $('nav a[href^="#"], nav a[href^="/#"]').click(function () {

    let target = $(this).attr('href');

    $('html, body').animate({
      scrollTop: $(target).offset().top - 50
    }, 800);

    return false;
  });
})(jQuery);

(function ($) {
  if (window.location.hash) {
    let target = window.location.hash;

    // убираем хеш из строки(отключаем дефолтный "прыжок")
    window.location.hash = "";

    // анимируем скролл
    $('html, body').animate({
      scrollTop: $(target).offset().top

    }, 900, function () {

      // возращаем хеш
      window.location.hash = target;
    });
  }
})(jQuery);
