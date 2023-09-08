(function ($) {
    const $customerProfile = $('.owl-carousel');
    let $titleH1 = $('h1'),
        $clickedNext = false;

    $customerProfile.owlCarousel({
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        items: 1,
        lazyLoad: true,
        loop: false,
        margin: 10,
        nav: true,
        checkVisible: false,
        mouseDrag: false,
        touchDrag: false,
        smartSpeed: 450,
        autoHeight: true,
        navClass: ['button button__middle button--green button__prev', 'button button__middle button--green button__next'],
        navText: ['Предыдущая страница', 'Следующая страница'],
        onInitialized: function () {
            // Создает нумерацию слайдов с начальными значениями
            $('.owl-dots').after('<div class="pagination-wrapper__number-pages"></div>');
            // Начальные значения
            $('.pagination-wrapper__number-pages').text('Страница 1 из ' + this.items().length);
            // Создаем кнопку для отправки заполненной анкеты
            $('.owl-nav').append('<button class="button button__middle button--green" type="button" name="sendQuestionnaire" style="display: none;">Отправить анкету</button>');
        }
    });

    $customerProfile.on('changed.owl.carousel', function (e) {
        let $owlDot = $('.owl-dot'),
            $owlDotActive = $('.owl-dot.active'),
            $owlItemActive = $('.owl-item.active'),
            $owlItemActiveWrapper = $owlItemActive.find('.questionnaire__form_wrapper'),
            $owlNavNextBtn = $('.button__next'),
            $warningPopup = $('.warning-popup'),
            $warningPopupWrapper = $('.warning-popup__wrapper'),
            $questionnaireForm = $('form'),
            $sendQuestionnaire = $('.button[name="sendQuestionnaire"]'),
            $indexOwlItemActive = $(this).find('.owl-item.active').index();

        /** Добавляет и убирает дополнительный класс для предыдущих активных owl-dot **/
        if ($owlDot.hasClass('active')) {
            $owlDotActive.removeClass('filled');
            $owlDotActive.prevAll().addClass('filled');
            $owlDotActive.nextAll().removeClass('filled');
        }

        /** Вывести номер активного слайда и количество слайдов **/
        $('.pagination-wrapper__number-pages').text('Страница ' + ++e.page.index + ' из ' + e.item.count);

        /** Если кнопки "Следующая страница" навигации по слайдам нет и она имеет класс 'disabled', то создать вместо нее
         * кнопку для отправления данных анкеты.
         */
        if ($owlNavNextBtn.hasClass('disabled')) {
            $sendQuestionnaire.css('display', 'block');

        } else {
            $sendQuestionnaire.css('display', 'none');
        }

        /** Сообщение с предупреждением при переходе на следующий слайд **/
        $warningPopupWrapper.html('<p>Уважаемый клиент, не вся информация на странице заполнена,<br/>вы уверены, что хотите перейти к следующему шагу?</p>');
        $warningPopupWrapper.append(`
            <div class="warning-popup__button">
                <button class="button button__middle button__white" name="nextPage" role="button">
                  Всё равно перейти к следующей странице
                </button>
                <button class="button button__middle button__white" name="continueFilling" role="button">
                  Продолжить заполнение этой страницы
                </button>
            </div>
        `);

        /** Кнопка скрывает предупреждение **/
        let $continueFilling = $('button[name="continueFilling"]');

        /** Кнопка для принудительного перехода на следующий слайд **/
        let $nextPage = $('.button[name="nextPage"]');

        $nextPage.on('click', () => {
            $clickedNext = true;
            $(this).trigger('next.owl.carousel');
            $warningPopup.removeClass('visible');
            $('main').removeAttr('style');
        });

        /** Если кнопка принудительного перехода нажата, то останавливаем цикл для перехода к следующему слайду **/
        if ($clickedNext) {
            $clickedNext = false;
            return;
        }

        /** Предотвращаем появление сообщения с предупреждением при переходе к предыдущему слайду **/
        const $warningPopupMessage = () => {
            if ($indexOwlItemActive < e.page.index) {
                $warningPopup.addClass('visible');
                $warningPopup.removeAttr('style');

                // Останавливаем переход к следующему слайду при не заполненных полях
                $customerProfile.trigger('to.owl.carousel', [$indexOwlItemActive, 0]);

                if ($warningPopup.hasClass('visible')) {
                    $('main').css({'opacity': '0.6', 'pointer-events': 'none'});
                }

                // Кнопка - Продолжить заполнение этой страницы
                $continueFilling.on('click', () => {
                    $warningPopup.removeClass('visible');
                    $('main').removeAttr('style');
                });

                return false;

            } else {
                $warningPopup.removeClass('visible');
            }
        };

        /** Находим все элементы формы активного слайда для проверки **/
        $.each($owlItemActiveWrapper, (index, itemWrapper) => {
            let $owlItemActiveInputs = $(itemWrapper).find('.questionnaire__form_input'),
                $owlItemActiveSelect = $(itemWrapper).find('.questionnaire__form_select'),
                $owlItemActiveSwitches = $(itemWrapper).find('.switches__checkbox'),
                $owlItemActiveRadios = $(itemWrapper).find(':radio'),
                arrItemActiveElements = [$owlItemActiveInputs, $owlItemActiveSelect, $owlItemActiveSwitches, $owlItemActiveRadios],
                $submitMe = true;

            /* Если у инпутов есть атрибут disabled, то отменяем проверку не заполненных полей */
            $.each(arrItemActiveElements, function (index, elementArr) {
                $.each(elementArr, function (index, element) {
                    if ($(element).attr('disabled')) {
                        $sendQuestionnaire.css('display', 'none');
                        $warningPopupWrapper.html('<p>Уважаемый клиент, данные в заполненной анкете не подлежат<br/>изменению и представлены только для ознакомления.</p>');
                        $warningPopupWrapper.append(`
                          <div class="warning-popup__button">
                            <button class="button button__little button__white" name="thanksIGotIt" role="button">
                              Спасибо, я понял
                            </button>
                          </div>
                        `);

                        $warningPopup.addClass('visible');
                        $warningPopup.removeAttr('style');

                        if ($warningPopup.hasClass('visible')) {
                            $('main').css({'opacity': '0.6', 'pointer-events': 'none'});
                        }

                        let $thanksIGotIt = $('button[name="thanksIGotIt"]');

                        $thanksIGotIt.on('click', () => {
                            $warningPopup.removeClass('visible');
                            $('main').removeAttr('style');
                            setTimeout(() => {
                                $warningPopup.remove()
                            }, 300);
                        });
                    }
                });
            });

            $.each($owlItemActiveInputs, function (index, elementInput) {
                if ($(elementInput).val() == '' && !$(elementInput).attr('disabled') || $(elementInput).val() == ' ' && !$(elementInput).attr('disabled')) {
                    $warningPopupMessage();
                }
            });

            $.each($owlItemActiveSelect, function (index, elementSelect) {
                if ($(elementSelect).val() == '' && !$(elementSelect).attr('disabled')) {
                    $warningPopupMessage();
                }
            });

            $.each($owlItemActiveSwitches, function (index, elementSwitch) {
                if ($(elementSwitch).prop('checked') === false && !$(elementSwitch).attr('disabled')) {
                    $warningPopupMessage();
                }
            });

            $.each($owlItemActiveRadios, function () { // Проверить каждую радиокнопку
                let nameActiveRadio = $(this).attr('name'); // Получить имя набора кнопок

                if ($submitMe && !$(`:radio[name="${nameActiveRadio}"]:checked`).length && !$(`:radio[name="${nameActiveRadio}"]`).parent('.jq-radio').hasClass('disabled')) { // Проверить, отмечена ли какая-либо кнопка в наборе
                    $warningPopupMessage();
                    $submitMe = false;
                }
            });

            return $submitMe; // Отменить отправку формы
        });

        /** Если 5-ый слайд с анкетой, то изменить заголовок H1 для этого слайда, иначе вернуть как был **/
        if (e.page.index === 5 && $questionnaireForm.attr('id') === 'formCustomerProfile') {
            $titleH1.text('АНКЕТА (защита прав заёмщика)');

        } else if ($questionnaireForm.attr('id') === 'formCustomerProfile') {
            $titleH1.text('АНКЕТА КЛИЕНТА');
        }

        /** Скролл наверх при переключении на следующий слайд **/
        $('html, body').animate({
            scrollTop: $(this).offset().top - 80
        }, {
            duration: 500
        });
    });

})(jQuery);
