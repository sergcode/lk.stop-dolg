// /** Добавление файлов **/
// try {
// 	(function ($) {
// 		const fileLoadedTaskSmart = window.matchMedia('(max-width: 440.98px)');
//
// 		$('.task__accordion_item--buttons').each(function () { <!-- На случай, если таких групп кнопок будет больше одной -->
// 			const attach = $(this),
// 					attachFile = 'attach__file',
// 					attachedClass = 'attach__item--attached'; <!-- Класс поля с файлом -->
//
// 			<!--Начальное кол-во полей-->
// 			let fields = attach.find("." + attachFile).length,
// 					fieldsAttached = 0; <!-- Начальное кол-во полей с файлами -->
//
// 			let newItem = '' +
// 					'<div class="attach__file">' +
// 					'<div class="attach__file_wrapper">' +
// 					'<div class="progress" hidden>' +
// 					'<progress max="100" value="0"></progress>' +
// 					'<div class="progress-bg">' +
// 					'<div class="progress-bar">' +
// 					'<div class="progress-value"></div>' +
// 					'</div>' +
// 					'</div>' +
// 					'</div>' +
// 					'<div class="attach__name"></div>' +
// 					'</div>' +
// 					'<button class="attach__delete" title="Удалить файл" role="button"></button>' +
// 					'</div>';
//
// 			<!-- При добавлении файла в input -->
// 			attach.on('change', '.attach__input', function (e) {
//
// 				let fd[[+id]] = new FormData(),
// 						item = $(this).closest(attach).find("." + attachFile),
// 						fileName[[+id]] = '',
// 						taskAccordionItemMoreInfo = $(this).closest('.task__accordion_item--more-info'),
// 						taskAccordionWrapper = taskAccordionItemMoreInfo.closest('.task__accordion_wrapper'),
// 						taskAccordionItemMoreWrapper = taskAccordionItemMoreInfo.find('.task__accordion_item--more-wrapper');
//
// 				if (e.target.value) { <!-- Если value input не пустое -->
// 					fileName[[+id]] = e.target.value.split('\\').pop();  <!-- Оставляем только имя файла и записываем в переменную -->
// 				}
//
// 				fd[[+id]].append('action', 'filesUploaded');
// 				fd[[+id]].append("task", "[[+id]]");
//
// 				for(var x=0; x < fileName[[+id]].length; x++) {
// 					fileName[[+id]] = e.target.files;
// 					fd[[+id]].append('file['+ x +']', fileName[[+id]].item(x));
// 				}
//
// 				let xhr[[+id]] = new XMLHttpRequest();
//
// 				item.each(function () {
// 					const thisItem = $(this),
// 							thisItemWrapper = thisItem.find('.attach__file_wrapper');
//
// 					<!-- Манипуляции с прогресс баром при добавлении файла -->
// 					const smartphoneRange = mqts => {
//
// 						<!-- Отслеживаем процесс загрузки файла -->
// 						xhr[[+id]].upload.onprogress = (event) => {
// 							thisItemWrapper.find('.progress').prop('hidden', false); <!-- Показываем прогресс бар при загрузке файла -->
//
//
// 							<!-- Если размер экрана меньше 441, то -->
// 							if (mqts.matches) {
// 								thisItemWrapper.next('.attach__delete').addClass('fileLoaded'); <!-- Присвоить класс, чтобы расположить по центру кнопку удалить файл -->
//
// 								<!-- Если есть общий объем скаченных данных, то -->
// 								if (event.total) {
// 									thisItemWrapper.find('progress').prop('value', Math.fround((event.loaded / event.total) * 100)); <!-- Узнаем реальный процент скаченных данных, чтобы получить 100 -->
//
// 									<!-- Манипуляции с круговым прогресс баром. Отнимаем от 100 значение прогресс бара, чтобы плавно уменьшать шкалу -->
// 									thisItemWrapper.find('.progress-bg .progress-bar__mobile_progress').css('stroke-dashoffset', Math.fround(100 - thisItemWrapper.find('progress').prop('value')) + '');
// 								}
//
// 								<!-- Ждём завершения отправки -->
// 								xhr.addEventListener('load',  () => {
// 									if (xhr.status === 200) {
// 										thisItemWrapper.find('.progress').prop('hidden', true);
// 										thisItemWrapper.next('.attach__delete').removeClass('fileLoaded');
//
// 									} else {
// 										thisItemWrapper.find('.progress-bar').addClass('errorLoad');
// 									}
// 								});
//
// 							} else {
//
// 								if (event.total) {
// 									thisItemWrapper.find('progress').prop('value', Math.fround((event.loaded / event.total) * 100));
// 									thisItemWrapper.find('.progress-bar').css('width', thisItemWrapper.find('progress').prop('value') + '%');
// 									thisItemWrapper.find('.progress-value').text('Загрузка файла, подождите ' + Math.round(thisItemWrapper.find('progress').prop('value')) + '%');
// 								}
//
// 								<!-- Ждём завершения отправки -->
//
//
// 								xhr[[+id]].onloadend = () => {
// 									if (xhr[[+id]].status === 200) {
// 										console.log(xhr[[+id]].responseText);
// 										thisItemWrapper.find('.progress').prop('hidden', true);
// 										thisItem.after(xhr[[+id]].responseText);
//
// 									} else {
// 										thisItemWrapper.find('.progress-bar').addClass('errorLoad');
// 										thisItemWrapper.find('.progress-value').text('Ошибка при загрузке файла!');
// 									}
// 								};
//
// 								if (thisItemWrapper.next('.attach__delete').hasClass('fileLoaded')) {
// 									thisItemWrapper.next('.attach__delete').removeClass('fileLoaded');
// 								}
//
// 							}
// 						};
//
// 						<!-- Проверка и изменение элементов при изменении размера экрана -->
// 						if (mqts.matches) {
// 							if (xhr[[+id]].status === 200) {
// 								thisItemWrapper.next('.attach__delete').removeClass('fileLoaded');
//
// 							} else {
// 								thisItemWrapper.next('.attach__delete').addClass('fileLoaded');
// 							}
//
// 						} else {
// 							thisItemWrapper.next('.attach__delete').removeClass('fileLoaded');
// 						}
// 					};
//
//
// 					<!--  если имя файла не пустое -->
// 					if (fileName[[+id]]) {
//
// 						<!-- Проверяем, если в поле нет имени файла, то -->
// 						if (!thisItem.find('.attach__name').text()) {
// 							thisItem.find('.attach__name').text(fileName[[+id]]); <!-- Подставляем в поле имя файла -->
//
//
// 							let elemExtension = thisItem.find('.attach__name'),
// 									extension = elemExtension.text().split('.').pop();
// 							elemExtension.text(elemExtension.text().beforeLastIndex("."));
//
// 							thisItemWrapper.prepend('<p />');
//
// 							let extensionWrapper = thisItemWrapper.find('p');
// 							extensionWrapper.text(extension);
//
// 							<!-- Создание определенного цвета для отдельных форматов файлов -->
// 							colorExtensionsFiles(extension, thisItemWrapper)
// 						}
//
// 						if (!thisItem.hasClass(attachedClass)) { <!-- Если в поле до этого не было файла -->
// 							thisItem.addClass(attachedClass); <!-- Отмечаем поле классом -->
// 							thisItem.closest('.attach__container-created-files').next('.task__accordion_item--buttons-wrapper').find('[name="taskAccordionAttach"]').removeAttr('disabled');
// 							fieldsAttached++;
// 						}
//
// 						if (fields === fieldsAttached) { <!-- Если кол-во полей равно -->
// 							thisItemWrapper.find('.progress-bg').append(`
//         							<svg width="34" height="34" class="progress-bar__mobile_svg" viewBox="0 0 34 34">
//         								<circle class="progress-bar__mobile_bg" cx="17" cy="17" r="15" stroke-width="2"></circle>
//         								<circle class="progress-bar__mobile_progress" cx="17" cy="17" r="15" transform="rotate(-90 17 17)" stroke-width="2" style="stroke-dasharray: 100;"></circle>
//         							</svg>
//         						`);
//
// 							<!-- Манипуляции с прогресс баром -->
// 							smartphoneRange(fileLoadedTaskSmart);
// 							fileLoadedTaskSmart.addEventListener('change', smartphoneRange);
//
// 							thisItem.after(xhr[[+id]].responseText); <!-- Добавляем новое поле -->
// 							fields++;
// 						}
//
//
// 					} else {
//
// 						if (fields === fieldsAttached + 1) {
// 							thisItem.remove(); <!-- Удаляем поле -->
// 							fields--;
//
// 						}
//
// 						fieldsAttached--;
// 					}
// 				});
//
// 				xhr[[+id]].open("POST", "/assets/ajax.php");
// 				xhr[[+id]].send(fd[[+id]]);
//
// 				<!-- Установить одинаковую высоту родительского блока и дочернего -->
// 				taskAccordionItemMoreInfo.css('max-height', taskAccordionItemMoreWrapper.outerHeight());
// 				taskAccordionWrapper.css('max-height', taskAccordionWrapper.outerHeight() + taskAccordionItemMoreInfo.outerHeight());
// 			});
// 		});
// 	})(jQuery);
//
// } catch (e) {
// 	alert(e);
// }
