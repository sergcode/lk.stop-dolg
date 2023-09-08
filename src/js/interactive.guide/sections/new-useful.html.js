"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const tourNewUseful = new Tour({
		name: 'tourNewUseful',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: `${(mediaQueryTourMedium.matches) ? 15 : 5}`,
		basePath: '/new-useful/',
		template: `
			<div class='popover tour' role="tooltip">
			  <div class='arrow'></div>
			  <div class='popover-content'></div>
			  <div class='popover-navigation'>
					<button class='btn btn-sm btn-default' data-role='prev' role="button">
						<img class="zpz-stages_arrow-left" src="/assets/images/stages/arrow-open.png" alt="Назад">
						Назад
					</button>
			    <button class='btn btn-sm btn-default' data-role='next' role="button">
			      Вперед
			      <img class="zpz-stages_arrow-right" src="/assets/images/stages/arrow-open.png" alt="Вперед">
					</button>
			    <button class='btn btn-sm btn-default' data-role='end' role="button">Завершить</button>
			  </div>
			</div>`
	});

	tourNewUseful.addStep({
		element: `${(mediaQueryTourMedium.matches) ? ".help--desktop" : ".help--mobile"}`,
		placement: "top",
		animation: false,
		content: `
				В разделе Полезная информация находятся "Обучающий ГИД" по всем разделам, 
				ответы на частые вопросы и другая справочная информация.`,
		prev: -1,
		onShown: () => tourStartOrFinished('tour-start')
	});

	tourNewUseful.addStep({
		element: `${(mediaQueryTourMedium.matches) ? ".help--desktop form" : ".help--mobile form"}`,
		placement: 'bottom',
		animation: false,
		content: `Это форма поиска по личному кабинету.`,
		onShown: () => tourStartOrFinished('tour-finished')
	});

	document.body.addEventListener("click", e => {
		if (e.target && e.target.matches('a[data-run-onboard]')) {
			if (e.target.getAttribute('href') === '/new-useful/') {
				e.preventDefault();
				tourStart.end();
				tourNewUseful.init();
				tourNewUseful.restart();

			} else {
				e.target.href += '#run-guide';
			}
		}
	});
});



