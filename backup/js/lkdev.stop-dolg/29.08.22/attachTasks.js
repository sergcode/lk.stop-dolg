"use strict";
/** Убирает расширение, точку и оставляет только имя файла **/

function nameFilesAttach() {
  String.prototype.beforeLastIndex = function (delimiter) {
    return this.substr(0, this.lastIndexOf(delimiter)) || this + "";
  };
}

nameFilesAttach();
/** Добавление файлов **/

window.addEventListener('DOMContentLoaded', () => {
  const mediaQueryTaskSmart = window.matchMedia('(max-width: 440.98px)');
  /** Создание определенного цвета для отдельных форматов файлов  **/

  function colorExtensionsFiles(extension) {
    let color;

    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'tif':
      case 'bmp':
        color = 'attach__file_wrapper__purple';
        break;

      case 'pdf':
        color = 'attach__file_wrapper__red';
        break;

      case 'doc':
      case 'docx':
      case 'odt':
      case 'txt':
        color = 'attach__file_wrapper__dark-blue';
        break;

      case 'xls':
      case 'xlsx':
        color = 'attach__file_wrapper__green';
        break;

      case 'ppt':
      case 'pptx':
        color = 'attach__file_wrapper__orange';
        break;

      case 'rar':
      case 'zip':
      case '7z':
      case 'tar':
      case 'arj':
      case 'jar':
        color = 'attach__file_wrapper__gold';
        break;

      default:
        color = 'attach__file_wrapper__neutral';
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


  const sortArr = arr => {
    arr.sort();
  };

  let arrayOfAddedFiles = []; // Имена файлов с расширением

  /** Добавляем все имена файлов в массив с расширениями файлов **/

  function addFilesToArray(attachInput, parent) {
    for (let i = 0; i < attachInput[0].files.length; i++) {
      let filenameWithExtension = attachInput[0].files[i].name,
          // Имя файла с расширением
      filenameWithoutExtension = filenameWithExtension.beforeLastIndex("."),
          // Убрать расширения файлов и оставить только имена файлов
      fileExtension = filenameWithExtension.split('.').pop(); // Убрать имена файлов и оставить только их расширения

      arrayOfAddedFiles.push(filenameWithExtension); // Добавить в массив файлы с расширением

      sortArr(arrayOfAddedFiles); // Отсортировать файлы в массиве

      /** Создаем визуальные обертки для файлов с
       * именем (filenameWithoutExtension), расширением (fileExtension) и
       * цветом расширения (colorExtensionsFiles(fileExtension)) файлов
       */

      parent.append(createAttachFile(filenameWithoutExtension, fileExtension, colorExtensionsFiles(fileExtension)));
    }
  }
  /** Установить одинаковую высоту родительского блока и дочернего **/


  function maxHeightAddingFiles(commonParentWrapper, parentWrapperMoreInfo, childrenWrapper) {
    parentWrapperMoreInfo.css('max-height', childrenWrapper.outerHeight());
    commonParentWrapper.css('max-height', commonParentWrapper.outerHeight() + parentWrapperMoreInfo.outerHeight());
  }
  /** При изменении input **/


  (function ($) {
    $.each($('.attach__input'), (i, input) => {
      $(input).change(function (e) {
        e.preventDefault();
        const thisInput = $(this),
              taskAccordionItemMoreInfo = thisInput.closest('.task__accordion_item--more-info'),
              taskAccordionWrapper = taskAccordionItemMoreInfo.closest('.task__accordion_wrapper'),
              taskAccordionItemMoreWrapper = taskAccordionItemMoreInfo.find('.task__accordion_item--more-wrapper'),
              wrapperParentCreatedFiles = taskAccordionItemMoreWrapper.find('.attach__wrapper-created-files'),
              formModalRow = thisInput.closest('.form-modal__row'),
              wrapperCreatedFiles = formModalRow.find('.attach__wrapper-created-files');
        /* Создаем визуальную обертку для файлов. Добавляем все имена файлов с расширениями в массив.*/

        if (taskAccordionItemMoreInfo) {
          /* Создаем визуальную обертку для файлов. Добавляем все имена файлов с расширениями в массив.*/
          addFilesToArray(thisInput, wrapperParentCreatedFiles);
          deleteAttachedFile(taskAccordionWrapper, taskAccordionItemMoreInfo, taskAccordionItemMoreWrapper);
          /* Установить одинаковую высоту родительского блока и дочернего*/

          maxHeightAddingFiles(taskAccordionWrapper, taskAccordionItemMoreInfo, taskAccordionItemMoreWrapper);
          /* Если есть прикрепленные файлы, то разблокируем кнопку Отправить файлы */

          if (wrapperParentCreatedFiles.children().length > 0) {
            taskAccordionItemMoreWrapper.find('[name="taskAccordionAttach"]').removeAttr('disabled');
          }
        }

        if (formModalRow) {
          addFilesToArray(thisInput, wrapperCreatedFiles);
          deleteAttachedFile();
          handleOrientationChangeSmartphone(mediaQueryTaskSmart);
          mediaQueryTaskSmart.addEventListener('change', handleOrientationChangeSmartphone);
        }
      });
    });
  })(jQuery);
  /** Если размер экрана равен смартфону, то добавить скролл, иначе убрать **/


  function handleOrientationChangeSmartphone(mqts) {
    const wrapperCreatedFiles = $('.toggle-modal .attach__wrapper-created-files');
    mqts.matches ? addScroll(wrapperCreatedFiles) : wrapperCreatedFiles.removeClass('attach__wrapper-created-files_scroll');
  }
  /** Добавить скролл для блока с прикрепленными файлами, если файлов больше трех **/


  function addScroll(parent) {
    const classScroll = 'attach__wrapper-created-files_scroll';
    parent.children().length > 3 ? parent.addClass(classScroll) : parent.removeClass(classScroll);
  }
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

          if ($(wrapperCreatedFiles).children().length <= 0) {
            arrayOfAddedFiles = [];
            if (commonParentWrapper) itemButtonsParent.find('[name="taskAccordionAttach"]').attr('disabled', 'disabled');
          }

          handleOrientationChangeSmartphone(mediaQueryTaskSmart);
          mediaQueryTaskSmart.addEventListener('change', handleOrientationChangeSmartphone);
        });
      });
      /* Установить одинаковую высоту родительского блока и дочернего*/

      if (commonParentWrapper) {
        if (parentWrapperMoreInfo.outerHeight() > childrenWrapper.outerHeight()) {
          maxHeightAddingFiles(commonParentWrapper, parentWrapperMoreInfo, childrenWrapper);
        }
      }
    });
  }
});