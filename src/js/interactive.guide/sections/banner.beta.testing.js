"use strict";

window.addEventListener('DOMContentLoaded', () => {

	/* todo base setup */
	const tourBannerBeta = new Tour({
		name: 'tourBannerBeta',
		storage: window.localStorage,
		debug: true,
		backdrop: true,
		backdropPadding: 5,
		template: `
			<div class='popover tour' role="tooltip">
			  <div class='arrow'></div>
			  <div class='popover-content'></div>
			  <div class='popover-navigation'>
					<button class='btn btn-sm btn-default' data-role='prev' role="button">« Назад</button>
			    <button class='btn btn-sm btn-default' data-role='end' role="button">Завершить</button>
			  </div>
			</div>`
	});

	tourBannerBeta.addStep({
		placement: 'auto',
		title: 'Внимание!',
		content: `
			Раздел "Ход дела" находится в экспериментальном режиме и мы стараемся предоставить вам достоверную информацию. 
			Если вы обнаружили некорректные данные приносим извинения и просим вас сообщить нам в чат.`,
		animation: false,
		backdropPadding: 0,
		orphan: true,
		template: `
			<div class='popover popover__default-style-none popover__md tour' role="tooltip">
				<div class="popover__wrapper">
				  <h3 class='popover-title popover-title__bg_green popover-title_middle popover-title_center popover-title__color_white'></h3>
				  <div class='popover-content popover-content__middle'></div>
				  <div class='popover-navigation popover-navigation__height_middle'>
				    <button class='btn btn-sm btn-default green tourBannerBeta__close' data-role='end' role="button">Закрыть</button>
				  </div>
				</div>
			</div>`
	});

	tourBannerBeta.init();
	tourBannerBeta.start();
});


