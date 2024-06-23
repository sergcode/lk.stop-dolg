// Variabless
const menuButton = document.querySelector('.button-bureger'); // Event listeners

eventListeners();
headerSearch();

function eventListeners() {
  document.addEventListener('DOMContentLoaded', menuOpen(menuButton));
  document.addEventListener('DOMContentLoaded', accordionSimple());
} // Functions


function menuOpen(item) {
  const accWrapper = document.querySelector('.header__collapse');

  item.onclick = evt => {
    evt.preventDefault();
    item.classList.toggle('active');

    if (!item.classList.contains('active')) {
      accWrapper.style.maxHeight = null;
    } else {
      accWrapper.style.maxHeight = accWrapper.scrollHeight + "px";
    }

    ;
  };
}

;

function dropdown() {
  const block = document.querySelectorAll('.dropdown');
  block.forEach(item => {
    const button = item.querySelector('.dropdown-button'),
          list = item.querySelector('.dropdown-list');

    button.onclick = evt => {
      evt.preventDefault();
      list.classList.toggle('active');
    };
  });
}

;

function tabs() {
  const tabs = document.querySelector('.tabs'),
        tabItem = document.querySelectorAll('.tab__item');

  tabs.onclick = evt => {
    const target = evt.target,
          dataTab = target.getAttribute('data-tab');
    target.classList.remove('active');
    tabItem.forEach(item => {
      const dataItem = item.getAttribute('data-tab');

      if (dataTab == dataItem) {
        target.classList.add('active');
        item.classList.add('active');
      } else {
        // target.classList.remove('active');
        item.classList.remove('active');
      }
    });
  };
}

;

function accordionSimple() {
  const wrapper = document.querySelectorAll('.acc');
  wrapper.forEach(item => {
    const button = item.querySelector('.acc__button'),
          blockItem = item.querySelector('.acc__item');
    console.log(button);
    console.log(blockItem);

    button.onclick = evt => {
      evt.preventDefault();
      console.log('123');

      if (button.classList.contains('active')) {
        blockItem.style.maxHeight = null;
        button.classList.remove('active');
      } else {
        blockItem.style.maxHeight = blockItem.scrollHeight + "px";
        button.classList.add('active');
      }

      ;
    };
  });
}

;

function headerSearch() {
  const buttonOpen = document.querySelector('.header__button-search'),
        buttonClose = document.querySelector('.header__search-wrapper .button-close'),
        inputWrapper = document.querySelector('.header__search-wrapper');

  if (inputWrapper != null) {
    buttonOpen.onclick = evt => {
      evt.preventDefault();
      inputWrapper.classList.add('active');
    };

    buttonClose.onclick = evt => {
      evt.preventDefault();
      inputWrapper.classList.remove('active');
    };
  }
} // Vue components


let accordion = {
  props: ['title'],

  data() {
    return {
      active: false
    };
  },

  template: `
        <li :class="{ 'active' : active }">
            <button @click.prevent="active = !active" :class="['acc__button', active?'active':'']">
                {{ title }}
            </button>
            <transition name="fade">
                <ul class="acc__sub-list" v-show="active">
                    <slot />
                </ul>
            </transition>
        </li>
    `
};
let accordion_info = {
  props: ['title'],

  data() {
    return {
      active: false
    };
  },

  template: `
        <div class="tab__wrapper">
            <button @click.prevent="active = !active" :class="['tab__button', active?'active':'']">
                {{ title }}
            </button>
            <transition name="fade">
                <div v-show="active">
                    <slot />
                </div>
            </transition>
        </div>
    `
};
const firstTab = document.querySelector('[data-tab]');
let firstTabAttr = null;

if (firstTab) {
  let firstTabAttr = firstTab.getAttribute('data-tab');
}

let vueTab = new Vue({
  el: '#tabs',
  data: {
    activetab: parseInt(firstTabAttr),
    acc: 0
  }
});
let vueTabMobile = new Vue({
  el: '#tabMobile',
  components: {
    accordion_info
  }
});
let vueAcc = new Vue({
  el: '#acc',
  components: {
    accordion
  }
});
let vueAccClass = document.querySelectorAll('.vue-acc');
vueAccClass.forEach(item => {
  let vue = new Vue({
    el: item,
    components: {
      accordion
    }
  });
});
let vueAccHelpQuestion = new Vue({
  el: '#accHelpQuestion',
  components: {
    accordion
  }
});
let vueAccHelpQuestionClass = document.querySelectorAll('.vue-accHelpQuestion');
vueAccHelpQuestionClass.forEach(item => {
  let vue = new Vue({
    el: item,
    components: {
      accordion
    }
  });
});
let accHelpMobile = new Vue({
  el: '#accHelpMobile',
  components: {
    accordion
  }
});
let accHelpMobileClass = document.querySelectorAll('.vue-accHelpMobile');
accHelpMobileClass.forEach(item => {
  let vue = new Vue({
    el: item,
    components: {
      accordion
    }
  });
});
let vueAccMobile = new Vue({
  el: '#accMobile',
  components: {
    accordion
  }
});
let vueAccMobileClass = document.querySelectorAll('.vue-accMobile');
vueAccMobileClass.forEach(item => {
  let vue = new Vue({
    el: item,
    components: {
      accordion
    }
  });
}); // Модальное окно с оплатой

function showPopup() {
  const body = document.querySelector('body');
  let popup = document.createElement('section');

  body.onclick = e => {
    const target = e.target;

    if (target.hasAttribute('data-payment-id')) {
      e.preventDefault();
      popup.className = 'popup';
      const id = target.getAttribute('data-payment-id');
      popup.innerHTML = `
                <div class="popup__content">
                    <button class="popup__close button-close"></button>
                    <a href="${id}" class="button">Скачать бланк</a>
                    <a href="${id}" class="button button--green">Перейти к оплате</a>
                </div>
            `;
      body.appendChild(popup);
    }

    if (e.target.classList.contains('popup') || e.target.classList.contains('popup__close')) {
      const popup = document.querySelector('.popup');
      popup.classList.add('remove');
      setTimeout(() => {
        popup.remove();
      }, 300);
    }
  };
}

showPopup();

function showModal() {
  const modal = document.querySelector(".modal");

  if (modal) {
    const firstBox = modal.querySelector('.modal__box');
    modal.classList.add("active");
    firstBox.classList.add("active");

    modal.onclick = e => {
      const target = e.target;

      if (target.hasAttribute('modal-close')) {
        modal.classList.add('remove');
        setTimeout(() => {
          modal.classList.remove('active');
          modal.classList.remove('remove');
          modal.querySelector('.modal__box.active').classList.remove('active');
        }, 300);
      }

      if (target.hasAttribute('data-modal-button')) {
        const attr = target.getAttribute('data-modal-button');
        const activeBox = modal.querySelector('.modal__box.active');
        const box = modal.querySelector(`.modal__box[data-modal='${attr}']`);
        activeBox.classList.remove('active');
        box.classList.add('active');
      }
    };
  }
}
//# sourceMappingURL=main.js.map
