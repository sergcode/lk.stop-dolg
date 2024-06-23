window.addEventListener('DOMContentLoaded', () => {
	const $tasksFadeOut = $('.zpz-anticollector__fade-out');
	const $readmoreZpzAnticollTextarea = $('.textarea');
	const $readmoreZpzAnticollTextareaOutcome = $('.textarea-outcome');

	(function ($) {
		let readmoreBlockZPZ = $('.zpz-readmore');
		let maxHeight;
		let speedReadmore = 0;

		if (window.matchMedia('(min-width: 768px)').matches) {
			maxHeight = 230;
			speedReadmore += 250;

		} else if (window.matchMedia('(min-width: 480px)').matches) {
			maxHeight = 390;

		} else if (window.matchMedia('(min-width: 430px)').matches) {
			maxHeight = 327;

		} else if (window.matchMedia('(min-width: 420px)').matches) {
			maxHeight = 330;

		} else if (window.matchMedia('(min-width: 340px)').matches) {
			maxHeight = 340;

		} else if (window.matchMedia('(min-width: 0px)').matches) {
			maxHeight = 370;
		}
		readmoreBlockZPZ.readmore({
			speed: speedReadmore,
			maxHeight: maxHeight,
			beforeToggle: function (trigger, element, more) {
				if (more) {
					$('html, body').animate({
						scrollTop: element.offset().top - 100,
					}, {
						duration: speedReadmore
					});
					$($tasksFadeOut).addClass('hide');
				}
			},
			afterToggle: function (trigger, element, more) {
				if (!more) {
					$('html, body').animate({
						scrollTop: element.offset().top - 50,
					}, {
						duration: speedReadmore
					});
					$($tasksFadeOut).removeClass('hide');
					if (element.find('.readmore__button').hasClass('active')) {
						element.find('.readmore__button').removeClass('active');
						element.find($readmoreZpzAnticollTextarea).each(function (index, value) {
							if ($(this).height() > 153) {
								$(this).removeClass('readmore-js-expanded').addClass('readmore-js-collapsed').css('height', '153px');
								$(this).parent().removeClass('readmore__bg_hidden');
							}
						});
					}
				}
			},
			heightMargin: 16,
			moreLink: '<a class="readmore-js-toggle" href="#" title="Подробнее" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
			lessLink: '<a class="readmore-js-toggle active" href="#" title="Свернуть" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
		});
	})(jQuery);

	(function ($) {
		let zpzCompletedAnticollector = $('.zpz-completed');
		let maxHeightCompletedAnticoll;
		let speedReadmore = 0;

		if (window.matchMedia('(min-width: 1100px)').matches) {
			maxHeightCompletedAnticoll = 230;
			speedReadmore += 250;

		} else if (window.matchMedia('(min-width: 768px)').matches) {
			maxHeightCompletedAnticoll = 370;
			speedReadmore += 250;

		} else if (window.matchMedia('(min-width: 576px)').matches) {
			maxHeightCompletedAnticoll = 595;

		} else if (window.matchMedia('(min-width: 525px)').matches) {
			maxHeightCompletedAnticoll = 575;

		} else if (window.matchMedia('(min-width: 480px)').matches) {
			maxHeightCompletedAnticoll = 600;

		} else if (window.matchMedia('(min-width: 460px)').matches) {
			maxHeightCompletedAnticoll = 530;

		} else if (window.matchMedia('(min-width: 332px)').matches) {
			maxHeightCompletedAnticoll = 580;

		} else if (window.matchMedia('(min-width: 287px)').matches) {
			maxHeightCompletedAnticoll = 600;

		} else if (window.matchMedia('(min-width: 0px)').matches) {
			maxHeightCompletedAnticoll = 620;
		}

		zpzCompletedAnticollector.readmore({
			speed: speedReadmore,
			maxHeight: maxHeightCompletedAnticoll,
			beforeToggle: function (trigger, element, more) {
				if (more) {
					$('html, body').animate({
						scrollTop: element.offset().top - 100,
					}, {
						duration: speedReadmore
					});
				}
			},
			afterToggle: function (trigger, element, more) {
				if (!more) {
					$('html, body').animate({
						scrollTop: element.offset().top - 50,
					}, {
						duration: speedReadmore
					});
					if (element.find('.readmore__button').hasClass('active')) {
						element.find('.readmore__button').removeClass('active');
						element.removeClass('readmore__bg_hidden');
						element.find($readmoreZpzAnticollTextarea).each(function (index, value) {
							if ($(this).height() > 153) {
								$(this).removeClass('readmore-js-expanded').addClass('readmore-js-collapsed').css('height', '153px');
								$(this).parent().removeClass('readmore__bg_hidden');
							}
						});
					}
				}
			},
			heightMargin: 16,
			moreLink: '<a class="readmore-js-toggle" href="#" title="Подробнее" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
			lessLink: '<a class="readmore-js-toggle active" href="#" title="Свернуть" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
		});
	})(jQuery);

	(function ($) {
		let scrollHeight;
		let textLength;
		let speedReadmore = 0;

		if ((window.matchMedia('(min-width: 768)').matches)) {
			speedReadmore += 250;

		} else if ((window.matchMedia('min-width: 654px)').matches)) {
			scrollHeight = 153;
			textLength = 189;

		} else if ((window.matchMedia('(min-width: 576px)').matches)) {
			scrollHeight = 120;
			textLength = 119;

		} else if ((window.matchMedia('(min-width: 480px)').matches)) {
			scrollHeight = 131;
			textLength = 238;

		} else if ((window.matchMedia('(min-width: 404px)').matches)) {
			scrollHeight = 141;
			textLength = 434;

		} else if ((window.matchMedia('(min-width: 280px)').matches)) {
			scrollHeight = 131;
			textLength = 229;
		}

		$readmoreZpzAnticollTextarea.each(function (index, value) {
			if (this.scrollHeight > scrollHeight && $(this).text().length > textLength) {
				$(this).parent().addClass('readmore__bg');
				$(this).readmore({
					speed: speedReadmore,
					maxHeight: 153,
					beforeToggle: function (trigger, element, more) {
						if (more) {
							$(element).parent().addClass('readmore__bg_hidden');
						}
					},
					afterToggle: function (trigger, element, more) {
						if (!more) {
							$(element).parent().removeClass('readmore__bg_hidden');
						}
					},
					heightMargin: 16,
					moreLink: '<a class="readmore__button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
					lessLink: '<a class="readmore__button active"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
				});
			}
		});
		$readmoreZpzAnticollTextareaOutcome.each(function () {
			if (this.scrollHeight > scrollHeight && $(this).text().length > textLength) {
				$(this).parent().addClass('readmore__bg');
			}
		})
	})(jQuery);
});
