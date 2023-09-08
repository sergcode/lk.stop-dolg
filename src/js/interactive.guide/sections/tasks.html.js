"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const tourTasks = new Tour({
		name: 'tourTasks',
		// storage: false,
		debug: true,
		backdrop: true,
		backdropPadding: 5,
		basePath: '/tasks.html#run-guide',
		template: `
		<div class='popover tour' role="tooltip">
		  <div class='arrow'></div>
		  <div class='popover-content'></div>
		  <div class='popover-navigation'>
				<button class='btn btn-sm btn-default' data-role='prev' role="button">« Назад</button>
		    <button class='btn btn-sm btn-default' data-role='next' role="button">Вперед »</button>
		    <button class='btn btn-sm btn-default' data-role='end' role="button">Завершить</button>
		  </div>
		</div>`,
		onEnd: function () {
			if (window.location.hash === '#run-guide') {
				history.pushState('', document.title, window.location.pathname);
			}
		}
	});

	tourTasks.addStep({
		element: '.task',
		placement: 'auto',
		content:
			`В разделе Задачи отображается вся информация по Вашим действующим и завершенным задачам, 
			а так же задачи, которые на проверке у юриста.`,
		animation: false,
		backdropPadding: 0
	});

	tourTasks.addStep({
		element: '.task__filters',
		placement: 'bottom',
		content:
			`Это кнопки фильтра задач. При активации кнопок фильтра 
			можно оставить только выбранные группы задач, остальные будут скрыты,
			но при необходимости можно нажать на кнопку "Все задачи", чтобы отобразить все группы задач.
			Кнопка "Все задачи", появится при активации любой кнопки фильтра.`,
		animation: false
	});

	tourTasks.addStep({
		element: '.task__accordion',
		placement: 'auto',
		content:
			`Это группы задач. Цифры расположенные справа от названий групп - это число задач, 
			которые в процессе будут меняться. Вся подробная информация по Вашим задачам отображается 
			при нажатии на необходимую группу.`,
		animation: false,
		backdropPadding: 0
	});

	/** todo activeTask **/
	if (document.querySelector('[name="activeTask"] span').textContent !== '0') {

		tourTasks.addStep({
			element: '[name="activeTask"]',
			placement: 'auto',
			content: `Нажмите на группу "Активные задачи", чтобы продолжить и посмотреть список активных задач.`,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"]',
			placement: 'auto',
			content:
				`Это все Ваши активные задачи, которые ждут ваших действий. 
				При нажатии на любую задачу мы получаем от Вас статус ознакомлен с ней. 
				Нажмите на любую задачу, чтобы подробнее ознакомиться с ней.`,
			animation: false,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion-item-btn.is-open .task__accordion_item--header',
			placement: 'auto',
			content: `Это наименование задачи.`,
			animation: false
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion-item-btn.is-open .task__accordion_item--deadline',
			placement: 'auto',
			content: `Под наименованием задачи указывается её срок выполнения или предупреждение о сроках выполнения задачи.`,
			animation: false
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion_item--more-info[style*="max-height"]',
			placement: 'auto',
			content: `Здесь представлена подробная информация о задаче.`,
			animation: false,
			backdropPadding: {
				top: 10,
				right: 0,
				bottom: 0,
				left: 0
			}
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion-item-btn.is-open + .task__accordion_item--more-info[style*="max-height"] .task__accordion_item--text-task',
			placement: 'auto',
			content: `Под сроком выполнения задачи указывается пояснение к задаче.`,
			animation: false
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion-item-btn.is-open + .task__accordion_item--more-info[style*="max-height"] .task__accordion_item--add-info',
			placement: 'auto',
			content: `Под пояснением к задачи представлена дополнительная информация.`,
			animation: false
		});

		tourTasks.addStep({
			element: '[name="activeTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion_item--more-info[style*="max-height"] .task__accordion_item--buttons-wrapper',
			placement: 'auto',
			content: `У разных задач есть свои определенные кнопки, которые нужны для выполнения задачи.`,
			animation: false
		});
	}

	/** todo onCheckTask **/
	if (document.querySelector('[name="onCheckTask"] span').textContent !== '0') {
		tourTasks.addStep({
			element: '[name="onCheckTask"]',
			placement: 'top',
			content: `Нажмите на группу "Задачи на проверке у юриста", чтобы продолжить и посмотреть список проверяемых задач.`,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="onCheckTask"] + .task__accordion_wrapper[style*="max-height"]',
			placement: 'top',
			content:
				`Здесь все Ваши задачи, которые Вы выполнили и они находятся на проверке у юриста.
				Нажмите на любую задачу, чтобы подробнее ознакомиться с ней.`,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="onCheckTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion_item--more-info[style*="max-height"]',
			placement: 'top',
			content: `Здесь представлена подробная информация о задаче.`,
			backdropPadding: {
				top: 10,
				right: 0,
				bottom: 0,
				left: 0
			}
		});

		tourTasks.addStep({
			element: '[name="onCheckTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion_item--more-info[style*="max-height"] .task__accordion_item--buttons-wrapper ul',
			placement: 'top',
			content: `В этом блоке представлены все ваши прикрепленные файлы, которые Вы можете скачать.`,
			backdropPadding: 10
		});
	}

	/** todo completedTask **/
	if (document.querySelector('[name="completedTask"] span').textContent !== '0') {
		tourTasks.addStep({
			element: '[name="completedTask"]',
			placement: 'top',
			content: `Нажмите на группу "Завершённые задачи", чтобы продолжить и посмотреть список завершенных задач.`,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="completedTask"] + .task__accordion_wrapper[style*="max-height"]',
			placement: 'top',
			content:
				`Здесь все Ваши завершенные задачи, которые Вы выполнили и они прошли проверку у юриста.
				Нажмите на любую задачу, чтобы подробнее ознакомиться с ней.`,
			backdropPadding: 0,
			reflex: true
		});

		tourTasks.addStep({
			element: '[name="completedTask"] + .task__accordion_wrapper[style*="max-height"] .task__accordion_item--more-info[style*="max-height"]',
			placement: 'top',
			content: `Здесь представлена подробная информация о задаче.`,
			backdropPadding: {
				top: 10,
				right: 0,
				bottom: 0,
				left: 0
			}
		});
	}

	if (window.location.hash === '#run-guide') {
		tourTasks.init();
		tourTasks.restart();
	}
});





