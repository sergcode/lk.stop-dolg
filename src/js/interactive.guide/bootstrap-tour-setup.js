"use strict";

const mediaQueryTourMedium = window.matchMedia('(min-width: 768px)'),
		mediaQueryTourSmall = window.matchMedia('(max-width: 767.98px)');
let tourStart;

/* todo run function for Redirect page /new-useful.html */
/*function stepRedirect(selector) {
 tourStart.addStep({
 path: '/new-useful.html',
 element: selector,
 placement: 'top',
 content: `Это список обучающих уроков, который позволит вам в любое время повторить обучение по необходимому разделу личного кабинета.`,
 animation: false,
 onShown: function () {
 const $popover = $('.popover');
 if (!$popover.hasClass('tour-finished')) {
 $popover.addClass('tour-finished');
 }
 },
 reflex: '[data-run-onboard]',
 redirect: function () {
 document.querySelectorAll('[data-run-onboard]').forEach(runOnboard => {
 runOnboard.addEventListener('click', e => {
 document.location.pathname = '/' + e.target.href.split('/').pop();
 });
 });
 }
 });
 }*/

function tourStartOrFinished(tourStatus) {
	const $popover = $('.popover');
	if (!$popover.hasClass(tourStatus)) {
		$popover.addClass(tourStatus);
	}
}

window.addEventListener('DOMContentLoaded', () => {

	/* todo base setup */
	tourStart = new Tour({
		name: 'tourStart',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: `${(mediaQueryTourMedium.matches) ? 15 : 5}`,
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
			</div>`
	});

	/* todo Знакомство с Онбордингом */
	tourStart.addStep({
		path: '/',
		placement: 'auto',
		title: 'Добро пожаловать в личный кабинет Стопдолг!',
		content: `
			<span>Это интерактивный ГИД, он поможет Вам быстрее освоить личный кабинет.</span>
			Хотели бы Вы сейчас пройти краткое обучение, как пользоваться личным кабинетом?`,
		animation: false,
		backdropPadding: 0,
		orphan: true,
		template: `
			<div class='popover popover__default-style-none popover__md tour' role="tooltip">
				<div class="popover__wrapper">
				  <h3 class='popover-title popover-title__bg_green popover-title_middle popover-title_center popover-title__color_white'></h3>
				  <div class='popover-content popover-content__middle'></div>
				  <div class='popover-navigation popover-navigation__height_middle'>
						<button class='btn btn-sm btn-default' data-role='next' role="button">Приступить</button>
				    <button class='btn btn-sm btn-default btn-d-block' data-role='end' role="button">Не сейчас</button>
				  </div>
				</div>
			</div>`,
		onShown: () => tourStartOrFinished('tour-finished')
	});

	tourStart.addStep({
		path: "/new-useful/",
		element: `${(mediaQueryTourMedium.matches) ? ".help--desktop" : ".help--mobile"}`,
		placement: "top",
		animation: false,
		content: `
				Начнем с раздела Полезная информация.<br>
				В этом разделе находятся "Обучающий ГИД" по всем разделам, 
				ответы на частые вопросы и другая справочная информация.`,
		next: -1,
		onShown: () => tourStartOrFinished('tour-finished')
	});

	tourStart.init();
	tourStart.start();
});

