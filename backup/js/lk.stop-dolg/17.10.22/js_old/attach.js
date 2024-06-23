$(document).ready(function () {
  $('.attach').each(function () {
    // на случай, если таких групп файлов будет больше одной
    var attach = $(this),
        fieldClass = 'attach__item',
        // класс поля
    attachedClass = 'attach__item--attached',
        // класс поля с файлом
    fields = attach.find('.' + fieldClass).length,
        // начальное кол-во полей
    fieldsAttached = 0; // начальное кол-во полей с файлами

    var newItem = '<div class="attach__item"><label class="attach__button"><span class="attach__up button button__little button--green" role="button"><img src="/assets/images/tasks/add.svg" alt="">Загрузить ещё</span><input class="attach__input" type="file" name="files[]" accept="image/*"/></label><div class="attach__name"></div><div class="attach__delete"><a title="Удалить"><img src="/assets/images/tasks/delete.svg" alt="Удалить"></a></div></div>'; // разметка нового поля
    // При изменении инпута

    attach.on('change', '.attach__input', function (e) {
      var item = $(this).closest('.' + fieldClass),
          fileName = '';

      if (e.target.value) {
        // если value инпута не пустое
        fileName = e.target.value.split('\\').pop(); // оставляем только имя файла и записываем в переменную
      }

      if (fileName) {
        // если имя файла не пустое
        item.find('.attach__name').text(fileName); // подставляем в поле имя файла

        if (!item.hasClass(attachedClass)) {
          // если в поле до этого не было файла
          item.addClass(attachedClass); // отмечаем поле классом

          fieldsAttached++;
        }

        if (fields == fieldsAttached) {
          // если полей меньше 10 и кол-во полей равно
          item.after($(newItem)); // добавляем новое поле

          fields++;
        }
      } else {
        // если имя файла пустое
        if (fields == fieldsAttached + 1) {
          item.remove(); // удаляем поле

          fields--;
        } else {
          item.replaceWith($(newItem)); // заменяем поле на "чистое"
        }

        fieldsAttached--;

        if (fields == 1) {
          // если поле осталось одно
          attach.find('.attach__up').text('Загрузить файл'); // меняем текст
        }
      }
    }); // При нажатии на "Удалить"

    attach.on('click', '.attach__delete', function () {
      var item = $(this).closest('.' + fieldClass);

      if (fields > fieldsAttached) {
        // если полей больше, чем загруженных файлов
        item.remove(); // удаляем поле

        fields--;
      } else {
        // если равно
        item.after($(newItem)); // добавляем новое поле

        item.remove(); // удаляем старое
      }

      fieldsAttached--;

      if (fields == 1) {
        // если поле осталось одно
        attach.find('.attach__up').html('<img src="/assets/images/tasks/add.svg" alt="">Загрузить файл'); // меняем текст
      }
    });
  });
});
//# sourceMappingURL=attach.js.map
