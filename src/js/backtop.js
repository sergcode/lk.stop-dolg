'use strict';

(function ($) {
	$(document).ready(function () {
		const $element = $('.footer'),
					$backTop = $('.backTop');
		let $counter = 0,
				$timer;

		let refresh = () => {
			$backTop.removeClass('visibleBackTop');
		};

		$(window).bind('scroll', function () {
			const scroll = $(window).scrollTop() + $(window).height();
			// Если скролл до конца элемента
			// const offset = $element.offset().top + $element.height();
			// Если скролл до начала элемента
			const offset = $element.offset().top;

			if ($(window).scrollTop() > 150) {
				$backTop.addClass('visibleBackTop');
				$('.b24-widget-button-position-bottom-right').attr('style', 'bottom: 70px !important');

			} else {
				$backTop.removeClass('visibleBackTop');
				$('.b24-widget-button-position-bottom-right').css('bottom', '');
			}

			/* Отследить, когда пользователь перестает прокручивать */
			// clearTimeout($timer);
			// $timer = setTimeout(refresh, 1500);
			//
			// $backTop.mouseenter(function () {
			// 	clearTimeout($timer);
			//
			// }).mouseleave(function () {
			// 	$timer = setTimeout(refresh, 1500);
			// });

			// if (scroll > offset && $counter == 0) {
			// 	$backTop.css('bottom', `${$element.height() + 15}px`);
			// 	$counter = 1;
			//
			// } else if (scroll < offset && $counter == 1) {
			// 	$backTop.css('bottom', '150px');
			// 	$counter = 0;
			// }
		});

		$backTop.on('click', function () {
			$("html, body").animate({scrollTop: 0}, 650);
		});
	});
})(jQuery);




