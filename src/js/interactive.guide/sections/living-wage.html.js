"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const mediaQueryTourMedium = window.matchMedia('(min-width: 768px)'),
				mediaQueryTourSmall = window.matchMedia('(max-width: 767.98px)');

	const tourLivingWage = new Tour({
		name: 'tourLivingWage',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: 5,
		basePath: '/living-wage.html#run-guide',
		template: `
		<div class='popover tour' role="tooltip">
		  <div class='arrow'></div>
		  <div class='popover-content'></div>
		  <div class='popover-navigation'>
				<button class='btn btn-sm btn-default' data-role='prev' role="button">« Назад</button>
		    <button class='btn btn-sm btn-default' data-role='next' role="button">Вперед »</button>
		    <button class='btn btn-sm btn-default' data-role='end' role="button">Завершить</button>
		  </div>
		</div>`
	});

	/* todo Desktop */
	if (mediaQueryTourMedium.matches) {
		tourLivingWage.addStep({
			element: '#requestTransfer',
			placement: 'auto',
			content: 'Здесь Вы можете отправить запрос на перевод прожиточного минимума арбитражному управляющему. Нажмите на кнопку "Запросить перевод", чтобы продолжить.',
			animation: false,
			reflex: true
		});

		tourLivingWage.addStep({
			element: '#requestTransfer .form__row_relative',
			placement: 'auto',
			content: 'Здесь Вы можете ввести необходимый комментарий арбитражному управляющему. Внимание! Это поле обязательное для заполнения и должно быть не короче 10-ти символов.',
			animation: false
		});

		tourLivingWage.addStep({
			element: '#requestTransfer button',
			placement: 'auto',
			content: 'Так же Вы можете отменить запрос на перевод прожиточного минимума. Нажмите на кнопку "Отменить перевод", чтобы продолжить.',
			animation: false,
			reflex: true
		});

		tourLivingWage.addStep({
			element: '.default-template__body .readmore-js-toggle',
			placement: 'auto',
			content: 'Эта кнопка показывает на кого выделяется прожиточный минимум. Нажмите на неё, чтобы продолжить.',
			animation: false,
			reflex: true
		});
	}

	/* todo Mobile */
	if (mediaQueryTourSmall.matches) {

	}

	if (window.location.hash === '#run-guide') {
		tourLivingWage.init();
		tourLivingWage.restart();
	}

});



