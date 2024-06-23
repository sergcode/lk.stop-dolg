"use strict";

const fileLoadedTaskSmart = window.matchMedia('(max-width: 440.98px)');

/** Убирает расширение, точку и оставляет только имя файла **/
function nameFilesAttach() {
	String.prototype.beforeLastIndex = function (delimiter) {
		return this.substr(0, this.lastIndexOf(delimiter)) || this + ""
	}
}

nameFilesAttach();

/** Создание определенного цвета для отдельных форматов файлов  **/
function colorExtensionsFiles(extension, elem) {
	switch (extension) {
		case 'jpg':
		case 'jpeg':
		case 'png':
		case 'tif':
		case 'bmp':
			elem.addClass('task__accordion_item__purple');
			break;
		case 'pdf':
			elem.addClass('task__accordion_item__red');
			break;
		case 'doc':
		case 'docx':
		case 'odt':
		case 'txt':
			elem.addClass('task__accordion_item__dark-blue');
			break;
		case 'xls':
		case 'xlsx':
			elem.addClass('task__accordion_item__green');
			break;
		case 'ppt':
		case 'pptx':
			elem.addClass('task__accordion_item__orange');
			break;
		case 'rar':
		case 'zip':
		case '7z':
		case 'tar':
		case 'arj':
		case 'jar':
			elem.addClass('task__accordion_item__gold');
			break;
		default:
			elem.addClass('task__accordion_item__neutral');
			break;
	}
}

/** Удалить добавленный файл файлов **/
(function ($) {
	$('.task__accordion_item--buttons').each(function () { // На случай, если таких групп кнопок будет больше одной
		const attach = $(this),
				attachFile = 'attach__file'; // Класс поля с файлом

		let fields = attach.find(`.${attachFile}`).length, // Начальное кол-во полей
				fieldsAttached = 0; // Начальное кол-во полей с файлами



		/** Разметка нового поля **/
		let newItem = `	
			<div class="attach__file">
				<div class="attach__file_wrapper">
					<div class="progress" hidden>
			      <progress max="100" value="0"></progress>
			      <div class="progress-bg">
			        <div class="progress-bar">
			          <div class="progress-value"></div>
							</div>
		        </div>
			    </div>
					<div class="attach__name"></div>
				</div>
			  <button class="attach__delete" title="Удалить файл" role="button"></button>
			</div>`;

		/** При нажатии на кнопку "Удалить" **/
		attach.on('click', '.attach__delete', function () {
			const item = $(this).closest(`.${attachFile}`),
					itemParent = item.closest('.attach__container-created-files');

			let taskAccordionItemMoreInfo = $(this).closest('.task__accordion_item--more-info'),
					taskAccordionWrapper = taskAccordionItemMoreInfo.closest('.task__accordion_wrapper'),
					taskAccordionItemMoreWrapper = taskAccordionItemMoreInfo.find('.task__accordion_item--more-wrapper');

			itemParent.next('.task__accordion_item--buttons-wrapper').find('.task__add-file')[0].reset();

			if (fields > fieldsAttached) { // Если полей больше, чем загруженных файлов
				item.remove(); // удаляем поле
				fields--;

			} else { // Если равно
				item.after(newItem); // Добавляем новое поле
				item.remove(); // Удаляем старое
			}

			fieldsAttached--;

			if (fieldsAttached <= 0) { // Если загруженные файлы все удалены
				itemParent.next('.task__accordion_item--buttons-wrapper').find('[name="taskAccordionAttach"]').attr('disabled', 'disabled'); // То блокируем кнопку отправки файлов
			}

			/* Если высота родительского блока больше чем дочернего, то установить одинаковую высоту */
			if (taskAccordionItemMoreInfo.outerHeight() > taskAccordionItemMoreWrapper.outerHeight()) {
				taskAccordionItemMoreInfo.css('max-height', taskAccordionItemMoreWrapper.outerHeight());
				taskAccordionWrapper.css('max-height', taskAccordionWrapper.outerHeight() + taskAccordionItemMoreInfo.outerHeight());
			}
		});
	});

})(jQuery);

