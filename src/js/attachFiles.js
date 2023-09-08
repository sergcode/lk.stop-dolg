"use strict";

/** Убирает расширение, точку и оставляет только имя файла **/
function nameFilesAttach() {
  String.prototype.beforeLastIndex = function (delimiter) {
    return this.substr(0, this.lastIndexOf(delimiter)) || this + ""
  }
}

nameFilesAttach();

window.addEventListener("DOMContentLoaded", () => {

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
});
