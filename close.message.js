"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const dataMessageParent = document.querySelectorAll('[data-message-parent]');

	dataMessageParent.forEach(parent => {

		// Объект для манипуляциями над баннером
		const message = {
			remind: function () {
				this.timeoutID = undefined; // - это числовой ID, который может быть использован позже с window.clearTimeout()
			},
			hideBanner: function (thisHide) { // Действие для скрытия баннера по кнопке или автоматически
				thisHide.classList.add('info__hide');
				thisHide.style.maxHeight = null;

				setTimeout(function () {
					thisHide.remove();
				}, 200);
			},

			hideAutoRemove: function () { // Автоматическое скрытие баннера
				this.timeoutID = setTimeout(function (msg) {
					this.remind(msg);
					message.hideBanner(parent);

				}.bind(this), 5000);
			},

			stopAutoRemove: function () { // Остановить Авто скрытие баннера
				clearTimeout(this.timeoutID)
			}
		};

		// Событие для закрытия баннера по крестику
		document.body.addEventListener('click', (e) => {
			const target = e.target;

			if (target && target.matches('[data-message-close]')) {
				e.preventDefault();
				message.hideBanner(target.closest('[data-message-parent]'))
			}
		});

		// Если у баннера есть класс info__auto-hide, то запустить автоскрытие баннера
		function autoHideClass(selector) {
			if (selector.classList.contains('info__auto-hide')) {
				message.hideAutoRemove();
				selector.addEventListener('mouseover', () => selector.stopAutoRemove());
				selector.addEventListener('mouseout', () => selector.hideAutoRemove());
			}
		}

		if (parent) {
			parent.classList.add('info__anim-hide');
			parent.style.maxHeight = parent.scrollHeight + 'px';

			autoHideClass(parent);
		}
	});
});
