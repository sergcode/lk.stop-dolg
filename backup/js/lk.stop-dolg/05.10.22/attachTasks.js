"use strict";

/** Убирает расширение, точку и оставляет только имя файла **/
function nameFilesAttach() {
    String.prototype.beforeLastIndex = function (delimiter) {
        return this.substr(0, this.lastIndexOf(delimiter)) || this + ""
    }
}

nameFilesAttach();

/** Добавление файлов **/
window.addEventListener('DOMContentLoaded', () => {

    /** Создание определенного цвета для отдельных форматов файлов  **/
    function colorExtensionsFiles(extension) {
        let color;

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'tif':
            case 'bmp':
                color = 'task__accordion_item__purple';
                break;
            case 'pdf':
                color = 'task__accordion_item__red';
                break;
            case 'doc':
            case 'docx':
            case 'odt':
            case 'txt':
                color = 'task__accordion_item__dark-blue';
                break;
            case 'xls':
            case 'xlsx':
                color = 'task__accordion_item__green';
                break;
            case 'ppt':
            case 'pptx':
                color = 'task__accordion_item__orange';
                break;
            case 'rar':
            case 'zip':
            case '7z':
            case 'tar':
            case 'arj':
            case 'jar':
                color = 'task__accordion_item__gold';
                break;
            default:
                color = 'task__accordion_item__neutral';
                break;
        }

        return color;
    }

    /** Разметка нового поля **/
    function createAttachFile(fileName, fileExtension, colorExtension) {
        const attachFile = document.createElement('div');
        attachFile.classList.add('attach__file', 'attach__item--attached');
        attachFile.innerHTML = `	
			<div class="attach__file_wrapper ${colorExtension}">
				<p>${fileExtension}</p>
				<div class="attach__name">${fileName}</div>
			</div>
		  <button class="attach__delete" title="Удалить файл" role="button"></button>
		`;

        return attachFile;
    }

    /** Сортировка элементов массива **/
    const sortArr = (arr) => {
        arr.sort();
    };

    let arrayOfAddedFiles = []; // Имена файлов с расширением
    let files = new Object(); // Массив файлов для отправки

    /** Добавляем все имена файлов в массив с расширениями файлов **/
    function addFilesToArray(attachInput, parent) {
        for (let i = 0; i < attachInput[0].files.length; i++) {
            let filenameWithExtension = attachInput[0].files[i].name, // Имя файла с расширением
                filenameWithoutExtension = filenameWithExtension.beforeLastIndex("."), // Убрать расширения файлов и оставить только имена файлов
                fileExtension = filenameWithExtension.split('.').pop(); // Убрать имена файлов и оставить только их расширения

            arrayOfAddedFiles.push(filenameWithExtension); // Добавить в массив файлы с расширением
            sortArr(arrayOfAddedFiles); // Отсортировать файлы в массиве

            /** Создаем визуальные обертки для файлов с
             * именем (filenameWithoutExtension), расширением (fileExtension) и
             * цветом расширения (colorExtensionsFiles(fileExtension)) файлов
             */
            parent.append(createAttachFile(filenameWithoutExtension, fileExtension, colorExtensionsFiles(fileExtension)));
            if (!files[attachInput.data('id')]) files[attachInput.data('id')] = [];
            files[attachInput.data('id')].push(attachInput[0].files[i]);
            console.log(files);
        }
    }

    /** Установить одинаковую высоту родительского блока и дочернего **/
    function maxHeightAddingFiles(commonParentWrapper, parentWrapperMoreInfo, childrenWrapper) {
        parentWrapperMoreInfo.css('max-height', childrenWrapper.outerHeight());
        commonParentWrapper.css('max-height', commonParentWrapper.outerHeight() + parentWrapperMoreInfo.outerHeight());
    }

    $(".send-files").on("click", function (e) {
        e.preventDefault();
        let id = $(this).data('id');

        var fd = new FormData();

        fd.append('action', 'sendFormFiles');
        fd.append('id', id);

        files[id].forEach((v, i) => {
            fd.append('files' + i, v);
        })

        $.ajax({
            type: "POST",
            url: "/assets/ajax.php",
            data: fd,
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: () => {
                $(this).find("span").html("Подождите!");
                $(this).attr("disabled", "disabled");
            },
            success: function (res) {
                console.log(res);
                res = JSON.parse(res);
                if (res.success) {
                    $("#activeTask .task__filters_num")[0].textContent--;
					$(".task__accordion-btn[name='activeTask'] span")[0].textContent--;
					$("#onCheckTask .task__filters_num")[0].textContent++;
					$(".task__accordion-btn[name='onCheckTask'] span")[0].textContent++;

					$("#wrapper-"+id).removeClass("is-open");
					$("#wrapper-"+id).addClass("filesPosted");



					setTimeout(()=>{
						$("#wrapper-"+id).removeClass("filesPosted");
						$("#wrapper-"+id).removeClass("warning");

						$("#task-info-"+id).removeAttr("style");

						$(".task__accordion-btn").removeClass("is-open");

						$(".tasks_on_check").prepend($("#task-info-"+id));
						$(".tasks_on_check").prepend($("#wrapper-"+id));

						$("#task-info-"+id+" .task__accordion_item--buttons").html(`
									<div class="task__accordion_item--buttons-wrapper">
			              <ul>
			                <li>Прикреплённые файлы:</li>
			              </ul>
			            </div>
								`);
						$("#wrapper-"+id+" .task__accordion_item--deadline").html(`Срок выполнения задачи: ${res.task.planDate}`);

						$("#wrapper-"+id+" .task__accordion_item--right-elements").prepend(
							`<span class="task__accordion_item--info-in-processing">
								<svg width="35" height="40" viewBox="0 0 35 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M12.2 4.4C11.8 4.4 11.6 4.6 11.6 5V11.8L4.7 14.7C4.4 14.8 4.3 15.2 4.4 15.5C4.5 15.8 4.7 15.9 5 15.9C5.1 15.9 5.2 15.9 5.3 15.8L12.6 12.7C12.9 12.6 13 12.4 13 12.1V5C12.8 4.6 12.6 4.4 12.2 4.4ZM12.2 24.4C5.4 24.4 0 18.9 0 12.2C0 5.4 5.6 0 12.2 0C18.6 0 24.1 5.1 24.4 11.7H31.7C33.1 11.7 34.2 12.8 34.2 14.2V16.1C34.2 16.5 33.9 16.7 33.6 16.7H32.8C32.1 17.9 29.5 22.3 27.2 24.9C26.8 25.4 26.8 26.2 27.2 26.7C29.4 29.3 32.1 33.8 32.8 35H33.7C34.1 35 34.3 35.3 34.3 35.6V38.1C34.3 39.2 33.5 40 32.4 40H16.4C15.3 40 14.5 39.2 14.5 38.1V35.6C14.5 35.2 14.8 35 15.1 35H16C16.7 33.8 19.3 29.4 21.6 26.7C22 26.2 22 25.4 21.6 24.9C20.8 24 20.1 23 19.3 22C17.3 23.6 14.8 24.4 12.2 24.4ZM33 38.1V36.2C28.9 36.2 19.8 36.2 15.8 36.2V38.1C15.8 38.5 16 38.7 16.4 38.7H32.4C32.8 38.8 33 38.5 33 38.1ZM26.2 24.1C28.1 21.9 30.3 18.3 31.3 16.7H17.4C18.4 18.4 20.6 22 22.5 24.1C23.4 25 23.4 26.5 22.5 27.5C20.6 29.7 18.4 33.2 17.4 34.9H31.3C30.3 33.2 28.1 29.6 26.2 27.5C25.3 26.6 25.3 25.1 26.2 24.1ZM33 14.2C33 13.5 32.4 12.9 31.8 12.9H17C16.3 12.9 15.7 13.5 15.7 14.2V15.5C20 15.5 28.6 15.5 32.9 15.5V14.2H33ZM17 11.7C15.6 11.7 14.5 12.8 14.5 14.2V16.1C14.5 16.5 14.8 16.7 15.1 16.7H15.9C16.3 17.4 17.3 19.1 18.6 21C16.9 22.2 14.8 23 12.7 23.1V22.5C12.7 22.1 12.4 21.9 12.1 21.9C11.7 21.9 11.5 22.1 11.5 22.5V23.1C8.9 23 6.6 21.9 4.9 20.3L5.3 19.9C5.6 19.6 5.6 19.3 5.3 19C5 18.7 4.7 18.7 4.4 19L4 19.4C2.4 17.6 1.4 15.3 1.2 12.8H1.8C2.2 12.8 2.4 12.5 2.4 12.2C2.4 11.9 2.1 11.6 1.8 11.6H1.3C1.4 9 2.5 6.7 4.1 4.9L4.5 5.3C4.8 5.6 5.1 5.6 5.4 5.3C5.7 5 5.7 4.7 5.4 4.4L4.9 4.1C6.8 2.4 9 1.4 11.6 1.3V1.9C11.6 2.3 11.9 2.5 12.2 2.5C12.5 2.5 12.8 2.2 12.8 1.9V1.3C15.4 1.4 17.7 2.5 19.4 4L19 4.5C18.7 4.8 18.7 5.1 19 5.4C19.3 5.7 19.6 5.7 19.9 5.4L20.3 5C21.9 6.8 22.9 9.2 23 11.7H17ZM22.2 31.3V32.6C22.2 33 22.5 33.2 22.8 33.2C23.1 33.2 23.4 32.9 23.4 32.6V31.3C23.4 30.9 23.1 30.7 22.8 30.7C22.5 30.7 22.2 30.9 22.2 31.3ZM25.9 33.1C26.3 33.1 26.5 32.8 26.5 32.5V31.2C26.5 30.8 26.2 30.6 25.9 30.6C25.5 30.6 25.3 30.9 25.3 31.2V32.5C25.3 32.8 25.6 33.1 25.9 33.1ZM24.4 21.8C24.8 21.8 25 21.5 25 21.2V19.9C25 19.5 24.7 19.3 24.4 19.3C24 19.3 23.8 19.6 23.8 19.9V21.2C23.8 21.5 24 21.8 24.4 21.8Z" fill="#275957"></path></svg>
								<span>Информация в обработке</span>
							</span>`);
						res.data.forEach((li)=>{
							$("#task-info-"+id+" .task__accordion_item--buttons-wrapper>ul").append(li);
						});

						$(".task__accordion-btn[name='onCheckTask']").click();
					},200);


                }
                //   var wrapper = document.getElementById('wrapper[[+id]]');
                //   wrapper.classList.remove("is-unread");
                //   wrapper.classList.add("is-read");
            },
            complete: () => {
                $(this).find("span").html("Файлы отправлены!");
                $(this).removeAttr("disabled");
            }
        });
        return false;
    })

    /** При изменении input **/
    $('.attach__input').change(function (e) {
        e.preventDefault();

        const thisInput = $(this),
            taskAccordionItemMoreInfo = thisInput.closest('.task__accordion_item--more-info'),
            taskAccordionWrapper = taskAccordionItemMoreInfo.closest('.task__accordion_wrapper'),
            taskAccordionItemMoreWrapper = taskAccordionItemMoreInfo.find('.task__accordion_item--more-wrapper'),
            wrapperParentCreatedFiles = taskAccordionItemMoreWrapper.find('.attach__wrapper-created-files');

        /* Создаем визуальную обертку для файлов. Добавляем все имена файлов с расширениями в массив.*/
        addFilesToArray(thisInput, wrapperParentCreatedFiles);
        deleteAttachedFile(taskAccordionWrapper, taskAccordionItemMoreInfo, taskAccordionItemMoreWrapper);

        /* Установить одинаковую высоту родительского блока и дочернего*/
        maxHeightAddingFiles(taskAccordionWrapper, taskAccordionItemMoreInfo, taskAccordionItemMoreWrapper);

        /* Если есть прикрепленные файлы, то разблокируем кнопку Отправить файлы */
        if (wrapperParentCreatedFiles.children().length > 0) {
            taskAccordionItemMoreWrapper.find('[name="taskAccordionAttach"]').removeAttr('disabled');
        }
    });

    /** Удалить прикрепленный файл **/
    function deleteAttachedFile(commonParentWrapper, parentWrapperMoreInfo, childrenWrapper) {
        $.each($('.attach__wrapper-created-files'), (i, wrapperCreatedFiles) => {
            const btnDel = $(wrapperCreatedFiles).find('.attach__delete');

            $.each(btnDel, (i, btn) => {
                $(btn).on('click', function (e) {
                    e.preventDefault();

                    const parentOfBtnDelete = $(this).closest('.attach__file'),
                        itemButtonsParent = parentOfBtnDelete.closest('.task__accordion_item--buttons');

                    parentOfBtnDelete.remove();
                    arrayOfAddedFiles.splice(i, 1); // Удалить из массива элемент: i - какой элемент удалить, 1 - сколько элементов удалить
                    files.splice(i, 1); // Удалить файл из массива файлов
                    if ($(wrapperCreatedFiles).children().length <= 0) {
                        arrayOfAddedFiles = [];
                        itemButtonsParent.find('[name="taskAccordionAttach"]').attr('disabled', 'disabled');
                    }
                });
            })

            /* Установить одинаковую высоту родительского блока и дочернего*/
            if (parentWrapperMoreInfo.outerHeight() > childrenWrapper.outerHeight()) {
                maxHeightAddingFiles(commonParentWrapper, parentWrapperMoreInfo, childrenWrapper);
            }
        });
    }
});


