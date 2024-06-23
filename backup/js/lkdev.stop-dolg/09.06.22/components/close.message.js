"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const dataMessageParent = document.querySelector('[data-message-parent]');

	// Объект для манипуляциями над баннером
	const message = {
		remind: function() {
			this.timeoutID = undefined; // - это числовой ID, который может быть использован позже с window.clearTimeout()
		},
		hideBanner: function () { // Действие для скрытия баннера по кнопке или автоматически
			dataMessageParent.classList.add('info__hide');
			dataMessageParent.style.maxHeight = null;

			setTimeout(function () {
				dataMessageParent.remove();
			},200);
		},

		hideAutoRemove: function () { // Автоматическое скрытие баннера
			this.timeoutID = setTimeout(function (msg) {
				this.remind(msg);
				dataMessageParent.hideBanner();

			}.bind(this), 5000);
		},

		stopAutoRemove: function () { // Остановить Авто скрытие баннера
			clearTimeout(this.timeoutID)
		}
	};

	if (dataMessageParent) {
		dataMessageParent.style.maxHeight = dataMessageParent.scrollHeight + 'px';
	}

	// Событие для закрытия баннера по крестику
	document.body.addEventListener('click', (e) => {
		const target = e.target;

		if (target && target.matches('[data-message-close]')) {
			e.preventDefault();
			message.hideBanner()
		}
	});

	// Если у баннера есть класс info__auto-hide, то запустить автоскрытие баннера
	function autoHideClass(selector) {
		if (dataMessageParent.classList.contains('info__auto-hide')) {
			message.hideAutoRemove();
			selector.addEventListener('mouseover', () => dataMessageParent.stopAutoRemove());
			selector.addEventListener('mouseout', () => dataMessageParent.hideAutoRemove());
		}
	}

	if (dataMessageParent) {
		autoHideClass(dataMessageParent);
	}
});
