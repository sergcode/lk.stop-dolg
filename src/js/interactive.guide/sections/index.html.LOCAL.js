"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const mediaQueryTourMain = window.matchMedia('(min-width: 1280px)');

	const tourMain = new Tour({
		name: 'tourMain',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: `${(mediaQueryTourMedium.matches) ? 15 : 10}`,
		basePath: '/#run-guide',
		template: `
			<div class='popover tour' role="tooltip">
			  <div class='arrow'></div>
			  <div class='popover-content'></div>
			  <div class='popover-navigation'>
					<button class='btn btn-sm btn-default' data-role='prev' role="button">
						<img class="zpz-stages_arrow-left" src="/assets/images/stages/arrow-open.png" alt="Плюс">
						Назад
					</button>
			    <button class='btn btn-sm btn-default' data-role='next' role="button">
			      Вперед
			      <img class="zpz-stages_arrow-right" src="/assets/images/stages/arrow-open.png" alt="Плюс">
		      </button>
			    <button class='btn btn-sm btn-default' data-role='end' role="button">Завершить</button>
			  </div>
			</div>`,
		onStart: function () {
			tourStart.end();
		},
		onEnd: function () {
			if (window.location.hash === '#run-guide') {
				history.pushState('', document.title, window.location.pathname);
			}
		}
	});

	tourMain.addStep({
		element: '.sendFeed',
		placement: 'auto',
		content: `Кликнув эту кнопку вы можете заказать бесплатный звонок нашего специалиста.`,
		animation: false,
		onShown: () => tourStartOrFinished('tour-start')
	});

	tourMain.addStep({
		element: '.task__informers',
		placement: 'auto',
		content: `Это <strong>"Информер задач"</strong>, который позволит вам сразу видеть актуальные данные по вашим задачам.
							Кликнув ссылку в "Информере" вы можете перейти к определенной группе задач.`,
		animation: false
	});

	tourMain.addStep({
		element: `${(mediaQueryTourMain.matches) ? '[href="/new-useful.html"]' : ''}`,
		placement: 'right',
		content:
				`В этом разделе вы можете найти для себя много полезной информации:
				<ul role="list">
					<li>Инструкции</li>
					<li>Видео уроки</li>
					<li>Частые вопросы</li>
					<li>Акции</li>
					<li>Обучающий ГИД</li>
				</ul>`,
		animation: false,
		backdropPadding: {
			top: 5,
			right: 0,
			bottom: 5,
			left: 0
		}
	});

	tourMain.addStep({
		element: '.toggle-modal__link[data-modal="3"]',
		placement: 'top',
		content: `Кликнув эту ссылку Вы можете оставить отзыв о работе компании.`,
		animation: false,
		onShown: () => tourStartOrFinished('tour-finished')
	});

	if (window.location.hash === '#run-guide') {
		tourMain.init();
		tourMain.restart();
	}
});


