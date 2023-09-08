"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const mediaQueryTourMedium = window.matchMedia('(min-width: 768px)'),
				mediaQueryTourSmall = window.matchMedia('(max-width: 767.98px)'),
				payTr = document.querySelectorAll('.pay__tbody .pay__tr'),
				payRedBtn = document.querySelectorAll('.pay__tbody .pay__tr--red .pay__td'),
				payGreenBtn = document.querySelectorAll('.pay__tbody .pay__tr--green .pay__td'),
				payTd = payTr[0].querySelectorAll('.pay__td');

	const tourPay = new Tour({
		name: 'tourPay',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: 5,
		basePath: '/pay.html#run-guide',
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
		tourPay.addStep({
			element: '.pay',
			placement: 'auto',
			content: 'В этой таблице представлена подробная информация по Вашим договорам.',
			animation: false
		});

		tourPay.addStep({
			element: '.pay__title',
			placement: 'auto',
			content: 'В заголовке таблицы указана сумма по договору, которую осталось внести.',
			animation: false
		});

		tourPay.addStep({
			element: payTr[0],
			placement: 'auto',
			content: 'В каждой строке указана информация по договору.',
			animation: false
		});

		tourPay.addStep({
			element: payTd[0],
			placement: 'auto',
			content: 'Срок оплаты.',
			animation: false
		});

		tourPay.addStep({
			element: payTd[1],
			placement: 'auto',
			content: 'Сумма, которую нужно внести.',
			animation: false
		});

		tourPay.addStep({
			element: payTd[2],
			placement: 'auto',
			content: 'Номер договора.',
			animation: false
		});

		tourPay.addStep({
			element: payTd[3],
			placement: 'auto',
			content: `
					Кнопка оплаты. Если кнопка белая с надписью "Оплачено", то это означает, что Вы оплатили данный договор.
				`,
			animation: false
		});

		tourPay.addStep({
			element: payRedBtn[3],
			placement: 'auto',
			content: `
					Кнопка оплаты. В зависимости от приближения срока оплаты цвет кнопки может быть красным.
					Если цвет кнопки красный, то нужно срочно внести оплату.
				`,
			animation: false
		});

		tourPay.addStep({
			element: payGreenBtn[3],
			placement: 'auto',
			content: `
					Кнопка оплаты. В зависимости от приближения срока оплаты цвет кнопки может быть зеленым.
				`,
			animation: false
		});

	}

	/* todo Mobile */
	if (mediaQueryTourSmall.matches) {

	}

	if (window.location.hash === '#run-guide') {
		tourPay.init();
		tourPay.restart();
	}

});



