'use strict';

(function ($) {
	$(function () {
		const $main = $('#office-auth-form'),
				$form = $('#office-auth-login'),
				$buttonChangeMask = $main.find('.button'),
				$inputTelEmail = $form.find('.login__input'),
				$loginLabel = $form.find('.login__label'),
				regularEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		function inputFocusAndBlur(inputSelect, inputMask) {
			inputSelect.on('focus', function () {
				if (inputSelect.val().length === 0) {
					$(this).inputmask(inputMask);
				}
			});
			inputSelect.on('blur', function () {
				$(this).inputmask('remove');
			});
		}

		function loginLabel(text) {
			$($loginLabel).text(text);
		}

		inputFocusAndBlur($inputTelEmail, '8 (999) 999-9999');

		$.each($buttonChangeMask, (index, btnArr) => {

			$(btnArr).on('click', function () {
				$buttonChangeMask.removeClass('active');
				$(this).addClass('active');
				$inputTelEmail.val('');
				$inputTelEmail.removeClass('invalid');
				$inputTelEmail.removeAttr('placeholder');
				$inputTelEmail.removeAttr('type');

				if ($(this).hasClass('active') && $(this).attr('name') === 'email') {
					loginLabel('Введите ваш email');
					$inputTelEmail.attr('type', 'email');

					$inputTelEmail.on('focus', function () {
						if ($(this).attr('type') === 'email') {
							$(this).inputmask('remove');
							$(this).attr('placeholder', 'example@example.ru');
						}
					});

					$inputTelEmail.on('blur', function () {
						if ($(this).attr('type') === 'email') {
							$(this).removeAttr('placeholder');

							if ($(this).val().length > 0 && !regularEmail.test($(this).val())) {
								$(this).addClass('invalid');
							}
						}
					});

					$inputTelEmail.on('input', function () {
						if ($(this).attr('type') === 'email') {
							if ($(this).val().length > 0 && regularEmail.test($(this).val()) || $(this).val().length === 0) {
								$(this).removeClass('invalid');
							}
						}
					});

				} else {
					loginLabel('Введите ваш номер телефона');
					inputFocusAndBlur($inputTelEmail, '8 (999) 999-9999');
				}
			});
		});
	});
})(jQuery);
