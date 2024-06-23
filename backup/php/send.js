'use strict';

$(document).ready(function () {
	console.log('Работает');
	/*$('form[name=feedback]').each(function () {
		var text_send = 'Отправить';
		var message_compleate = 'Спасибо, ваше сообщение отправлено!';
		var err = false;
		var _this = $(this);
		var btn_send = _this.find('.btn.btn-send');
		var fields = _this.find('input[type=text], textarea, select');
		//проверка на обязательность
		fields.each(function () {
			if ($(this).hasClass('required')) {
				if ($(this).val() == '') {
					$(this).addClass('error').focus();
					err = true;
					return false;
				}
			}
		});
		if (err == true) {
			return false;
		}
		var fdata = $(_this).serialize();
		//Отправка
		$.ajax({
			type: 'POST',
			url: window.location.origin + '/' + 'send.php', //путь к файлу
			data: fdata,
			dataType: 'json',
			success: function (msg) {
				if (msg.status == 'ok') {
					$(_this).slideUp().after('<p style="color: rgb(255, 255, 255); font-size: 28px;" class="message_is_send">' + message_compleate + '</p>');
				} else {
					$(fsend).html(msg.response).addClass('error');
				}
				$(btn_send).removeAttr('disabled', 'disabled').removeClass('disabled').html(text_send);
			}
		});
		return false;
	});*/
});
