window.addEventListener('DOMContentLoaded', () => {
  /*(function ($) {
    let readmoreBlock = $('.zpz-creditors__tasks');
    let maxHeight;
    let speedReadmore = 0;
    if (window.matchMedia('(min-width: 768px)').matches) {
      maxHeight = 106;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 576px)').matches) {
      maxHeight = 130;
    }

    readmoreBlock.readmore({
      speed: speedReadmore,
      maxHeight: maxHeight,
      beforeToggle: function (trigger, element, more) {
        if (more) {
          // кнопка "Скрыть" была нажата
          $('html, body').animate({
            scrollTop: element.offset().top - 100
          }, {
            duration: speedReadmore
          });
        }
      },
      afterToggle: function (trigger, element, more) {
        if (!more) {
          // кнопка "Скрыть" была нажата
          $('html, body').animate({
            scrollTop: element.offset().top - 50
          }, {
            duration: speedReadmore
          });
        }
      },
      heightMargin: 16,
      //избегание ломания блоков, которые больше maxHeight (в пикселях)
      moreLink: '<a class="" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
      lessLink: '<a class="active" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
    });
  })(jQuery);*/

  (function ($) {
    const nowInCourt = $('.now-in-court');
    let maxHeight;
    let speedReadmore = 0;

    if (window.matchMedia('(min-width: 768px)').matches) {
      maxHeight = 170;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 700px)').matches) {
      maxHeight = 190;

    } else if (window.matchMedia('(min-width: 536px)').matches) {
      maxHeight = 300;

    } else if (window.matchMedia('(min-width: 480px)').matches) {
      maxHeight = 310;

    } else if (window.matchMedia('(min-width: 381px)').matches) {
      maxHeight = 280;

    } else if (window.matchMedia('(min-width: 0px)').matches) {
      maxHeight = 260;
    }

    $.each(nowInCourt, (index, item) => {
      const taskWrap = item.querySelector('.zpz-creditors__wrapper-tasks');

      if (taskWrap) {
        $(item).readmore({
          speed: speedReadmore,
          maxHeight: maxHeight,
          beforeToggle: function (trigger, element, more) {
            if (more) {
              // кнопка "Скрыть" была нажата
              $('html, body').animate({
                scrollTop: element.offset().top - 100
              }, {
                duration: speedReadmore
              });
            }
          },
          afterToggle: function (trigger, element, more) {
            if (!more) {
              // кнопка "Скрыть" была нажата
              $('html, body').animate({
                scrollTop: element.offset().top - 50
              }, {
                duration: speedReadmore
              });
            }
          },
          heightMargin: 16,
          //избегание ломания блоков, которые больше maxHeight (в пикселях)
          moreLink: '<a class="" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
          lessLink: '<a class="active" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
        });
      } else {
        $(item).readmore('destroy');
      }
    });


  })(jQuery);

  (function ($) {
    const passedTrial = $('.passed-trial');
    let maxHeight;
    let speedReadmore = 0;

    if (window.matchMedia('(min-width: 1440px)').matches) {
      maxHeight = 170;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 1280px)').matches) {
      maxHeight = 290;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 1100px)').matches) {
      maxHeight = 170;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 992px)').matches) {
      maxHeight = 290;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 768px)').matches) {
      maxHeight = 330;
      speedReadmore += 250;

    } else if (window.matchMedia('(min-width: 700px)').matches) {
      maxHeight = 330;

    } else if (window.matchMedia('(min-width: 536px)').matches) {
      maxHeight = 428;

    } else if (window.matchMedia('(min-width: 480px)').matches) {
      maxHeight = 470;

    } else if (window.matchMedia('(min-width: 381px)').matches) {
      maxHeight = 390;

    } else if (window.matchMedia('(min-width: 341px)').matches) {
      maxHeight = 350;

    } else if (window.matchMedia('(min-width: 326px)').matches) {
      maxHeight = 360;

    } else if (window.matchMedia('(min-width: 0px)').matches) {
      maxHeight = 380;
    }

    $.each(passedTrial, (index, item) => {
      const taskWrap = item.querySelector('.zpz-creditors__wrapper-tasks');

      if (taskWrap) {
        $(item).readmore({
          speed: speedReadmore,
          maxHeight: maxHeight,
          beforeToggle: function (trigger, element, more) {
            if (more) {
              // кнопка "Скрыть" была нажата
              $('html, body').animate({
                scrollTop: element.offset().top - 100
              }, {
                duration: speedReadmore
              });
            }
          },
          afterToggle: function (trigger, element, more) {
            if (!more) {
              // кнопка "Скрыть" была нажата
              $('html, body').animate({
                scrollTop: element.offset().top - 50
              }, {
                duration: speedReadmore
              });
            }
          },
          heightMargin: 16,
          //избегание ломания блоков, которые больше maxHeight (в пикселях)
          moreLink: '<a class="" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
          lessLink: '<a class="active" href="#" role="button"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
        });
      } else {
        $(item).readmore('destroy');
      }
    });


  })(jQuery);

  (function ($) {
    const $readmoreContentHiddenAll = $('.readmore__content_hidden--all');
    let speedReadmore = 0;

    if (window.matchMedia('(min-width: 768px)').matches) {
      speedReadmore += 250;
    }

    $readmoreContentHiddenAll.readmore({
      speed: speedReadmore,
      maxHeight: 0,
      beforeToggle: function (trigger, element, more) {
        if (more) {
          // кнопка "Скрыть" была нажата
          $('html, body').animate({
            scrollTop: element.offset().top - 100
          }, {
            duration: speedReadmore
          });
        }
      },
      afterToggle: function (trigger, element, more) {
        if (!more) {
          // кнопка "Показать" была нажата
          $('html, body').animate({
            scrollTop: element.offset().top - 50
          }, {
            duration: speedReadmore
          });
        }
      },
      heightMargin: 16,
      //избегание ломания блоков, которые больше maxHeight (в пикселях)
      moreLink: '<a class="" href="#" role="button" title="Показать"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>',
      lessLink: '<a class="active" href="#" role="button" title="Скрыть"><svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"></path></svg></a>'
    });
  })(jQuery);

});

