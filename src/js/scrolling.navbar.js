"use strict";

(function ($) {
  const scrollingNavbarOffsetTop = 50;
  let $lastScrollTop = 0;

  $(window).on('scroll', function () {

    const $positionScroll = $(this).scrollTop(),
          $navbar = $(".header");

    if ($navbar.length) {

      if ($navbar.offset().top > scrollingNavbarOffsetTop) {
        $navbar.addClass("top-nav-collapse");

        if ($positionScroll > $lastScrollTop) {
          $navbar.addClass("scrollDown");

        } else {
          $navbar.removeClass('scrollDown');
        }

      } else {
        $navbar.removeClass("top-nav-collapse");
      }

      $lastScrollTop = $positionScroll;
    }
  });
}(jQuery));
