"use strict";

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

/** Добавление файлов **/
(function ($) {
	$('.task__accordion_item--buttons').each(function () { // На случай, если таких групп кнопок будет больше одной
		const attach = $(this),
				attachFile = 'attach__file',
				attachedClass = 'attach__item--attached'; // Класс поля с файлом

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

		let arrayOfAddedFiles = [], // Имена файлов с расширениями
				arrayOnlyFilenames = []; // Имена файлов без расширений

		/** При изменении input **/
		attach.on('change', '.attach__input', function (e) {

			let item = $(this).closest(attach).find(`.${attachFile}`),
					fileName = '',
					taskAccordionItemMoreInfo = $(this).closest('.task__accordion_item--more-info'),
					taskAccordionWrapper = taskAccordionItemMoreInfo.closest('.task__accordion_wrapper'),
					taskAccordionItemMoreWrapper = taskAccordionItemMoreInfo.find('.task__accordion_item--more-wrapper');

			/* Добавляем все имена файлов в массив с расширениями фалов */
			$.each($(this)[0].files, (index, item) => {
				arrayOfAddedFiles.push(item.name);
			});

			/* Перебираем массив добавленных файлов */
			$.each(arrayOfAddedFiles, (index, item) => {
				arrayOnlyFilenames.push(item.beforeLastIndex(".")); // Добавить в массив только имена файлов без расширения
			});

			/* Перебираем массив созданных блоков с файлами */

			$.each(item, (index, elem) => {

				const thisItem = $(elem),
							thisItemWrapper = thisItem.find('.attach__file_wrapper');

				$.each(fileName, elem => {
					if (elem) { // если имя файла не пустое

						/* Проверяем, если в поле нет имени файла, то */
						if (!thisItem.find('.attach__name').text()) {
							thisItem.find('.attach__name').text(elem); // Подставляем в поле имя файла

							let elemExtension = thisItem.find('.attach__name'),
									extension = elemExtension.text().split('.').pop();
							elemExtension.text(elemExtension.text().beforeLastIndex("."));

							thisItemWrapper.prepend('<p />');

							let extensionWrapper = thisItemWrapper.find('p');
							extensionWrapper.text(extension);

							/** Создание определенного цвета для отдельных форматов файлов  **/
							colorExtensionsFiles(extension, thisItemWrapper)
						}

						if (!thisItem.hasClass(attachedClass)) { // Если в поле до этого не было файла
							thisItem.addClass(attachedClass); // Отмечаем поле классом
							thisItem.closest('.attach__container-created-files').next('.task__accordion_item--buttons-wrapper').find('[name="taskAccordionAttach"]').removeAttr('disabled');
							fieldsAttached++;
						}

						if (fields === fieldsAttached) { // Если кол-во полей равно
							thisItem.after(newItem); // Добавляем новое поле
							fields++;
						}

					} else { // если имя файла пустое

						if (fields === fieldsAttached + 1) {
							thisItem.remove(); // Удаляем поле
							fields--;

						} else {
							thisItem.replaceWith(newItem); // Заменяем поле на "чистое"
						}

						fieldsAttached--;
					}
				});

			});

			/* Установить одинаковую высоту родительского блока и дочернего*/
			taskAccordionItemMoreInfo.css('max-height', taskAccordionItemMoreWrapper.outerHeight());
			taskAccordionWrapper.css('max-height', taskAccordionWrapper.outerHeight() + taskAccordionItemMoreInfo.outerHeight());
		});

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

