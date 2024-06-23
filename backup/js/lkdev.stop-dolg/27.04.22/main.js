"use strict";

function eventListeners() {
	document.addEventListener('DOMContentLoaded', accordionSimple);
}

eventListeners();

window.addEventListener('DOMContentLoaded', (eventDOM) => {
	function menuOpen() {
		const htmlPage = document.documentElement,
				header = document.querySelector('.header'),
				menuButton = header.querySelector('.button-burger'),
				bgBurger = header.querySelector('.bg-burger');

		const bgBurgerCreate = document.createElement('div');
		bgBurgerCreate.className = 'bg-burger';
		header.append(bgBurgerCreate);

		menuButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			menuButton.classList.toggle('active');
			htmlPage.classList.toggle('burger-open');

			if (menuButton.classList.contains('active')) {
				$(bgBurger).fadeIn(300);

			} else {
				$(bgBurger).fadeOut(300);
			}
		});

		document.body.addEventListener('click', (e) => {
			if (e.target && e.target.classList.contains('bg-burger')) {
				e.preventDefault();
				menuButton.classList.remove('active');
				htmlPage.classList.remove('burger-open');
				$(bgBurger).fadeOut(300);
			}
		});
	}

	function userFIOBreak() {
		const userFio = document.querySelector('.user-nav__button p'),
				userFioTextContentArr = userFio.textContent.split(/\s+/),
				userSurname = userFioTextContentArr[0],
				userName = userFioTextContentArr[1],
				userLastname = userFioTextContentArr[2];

		userFio.innerHTML = `${userSurname}<br/>${userName}&nbsp;${userLastname}`;
	}

	function vueAcc() {
		const vueAccClass = document.querySelectorAll('.vue-acc');

		vueAccClass.forEach(item => {
			new Vue({
				el: item,
				components: {
					accordion
				}
			});
		});
	}

	/** Функция удаляет аккордеон, если в нем нет задач или элементов, которые динамически добавляются. **/
	function removeEmptyAccordion() {
		const parent = eventDOM.target.querySelectorAll('.doc__list');

		parent.forEach(parentChild => {
			const wrapperTaskChild = parentChild.querySelectorAll('.zpz-work-task__wrapper-tasks');

			wrapperTaskChild.forEach(child => {
				if (child.childElementCount === 0) {
					parentChild.remove();
				}
			})
		});
	}

	menuOpen();
	userFIOBreak();
	vueAcc();
	removeEmptyAccordion();
});

function dropdown() {
	const block = document.querySelectorAll('.dropdown');

	block.forEach((item) => {
		const button = item.querySelector('.dropdown-button'),
				list = item.querySelector('.dropdown-list');

		button.onclick = (evt) => {
			evt.preventDefault();

			list.classList.toggle('active');
		};
	});
}

function tabs() {
	const tabs = document.querySelector('.tabs'),
			tabItem = document.querySelectorAll('.tab__item');

	tabs.onclick = (evt) => {
		const target = evt.target,
				dataTab = target.getAttribute('data-tab');

		target.classList.remove('active');

		tabItem.forEach((item) => {
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

function accordionSimple() {
	const wrapper = document.querySelectorAll('.acc');

	wrapper.forEach((item) => {
		const button = item.querySelector('.acc__button'),
				blockItem = item.querySelector('.acc__item');

		console.log(button);
		console.log(blockItem);

		button.onclick = (evt) => {
			evt.preventDefault();

			console.log('123');

			if (button.classList.contains('active')) {
				blockItem.style.maxHeight = null;
				button.classList.remove('active');
			} else {
				blockItem.style.maxHeight = blockItem.scrollHeight + 'px';
				button.classList.add('active');
			}
		};
	});
}

function headerSearch() {
	const buttonOpen = document.querySelector('.header__button-search'),
			buttonClose = document.querySelector('.header__search-wrapper .button-close'),
			inputWrapper = document.querySelector('.header__search-wrapper');

	if (inputWrapper != null) {
		buttonOpen.onclick = (evt) => {
			evt.preventDefault();
			inputWrapper.classList.add('active');
		};

		buttonClose.onclick = (evt) => {
			evt.preventDefault();
			inputWrapper.classList.remove('active');
		};
	}
}

headerSearch();

/** Vue components **/
let accordion = {
	props: ['title'],
	data() {
		return {
			active: false,
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
			active: false,
		};
	},
	template: `
        <div class="tab__wrapper">
            <button @click.prevent="active = !active" :class="['tab__button', active?'active':'']">
                {{ title }}
            </button>
            <transition name="fade">
                <div class="tab__content" v-show="active">
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
		// activetab: 1,
		activetab: 61,
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

let vueAccHelpQuestion = new Vue({
	el: '#accHelpQuestion',
	components: {
		accordion
	}
});

let vueAccHelpQuestionClass = document.querySelectorAll('.vue-accHelpQuestion');

vueAccHelpQuestionClass.forEach((item) => {
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

accHelpMobileClass.forEach((item) => {
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

vueAccMobileClass.forEach((item) => {
	let vue = new Vue({
		el: item,
		components: {
			accordion
		}
	});
});

/** Модальное окно с оплатой **/
function showPopup() {
	const body = document.querySelector('body');
	let popup = document.createElement('div');

	body.onclick = (e) => {
		const target = e.target;

		if (target.hasAttribute('data-payment-id')) {
			e.preventDefault();
			popup.className = 'popup';
			popup.setAttribute('role', 'dialog');

			const id = target.getAttribute('data-page_ya');
			const blank = target.getAttribute('data-page_blank');

			popup.innerHTML = `
        <div class="popup__content">
            <button class="popup__close button-close"></button>
            <a href="${blank}" target="_blank" class="button" role="button">Скачать бланк</a>
            <a href="${id}" target="_blank" class="button button--green" role="link">Перейти к оплате</a>
        </div>
        `;
			body.append(popup);
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
	const modal = document.querySelector('.modal');

	if (modal) {
		const firstBox = modal.querySelector('.modal__box');

		modal.classList.add('active');
		firstBox.classList.add('active');

		modal.onclick = (e) => {
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

/** Новый Аккордеон **/
const accord = Vue.component('Expander', {
	template: `
    <div class="Expander" :class="class_status">
        <div class="Expander__trigger" @click="open=!open" :class="open?'active':'beforeBorder'">
            <div class="Expander__trigger_img"></div>
            <div class="Expander__trigger_text">
              <h2 v-html="title"></h2>
              <img class="Expander__trigger-Icon" :class="{open:open}" :src="arrow_open" alt="Открыть">
            </div>
        </div>
        <div class="Expander__wrapper-hidden">
            <transition :name="animation">
                <div class="Expander__body" v-show="open">
                    <slot></slot>
                </div>
            </transition>
        </div>
    </div>
  `,
	props: {
		title: {
			type: String,
			default: 'title'
		},
		animation: {
			type: String,
			default: 'rightToLeft'
			// validator: prop => ['leftToRight', 'bounceIn', 'bottomToTop'].includes(prop)
		},
		image: {
			type: ImageData,
			default: 'image'
		},
		arrow_open: {
			type: ImageData,
			default: 'image'
		},
		class_status: {
			type: String,
			default: ''
		}
	},
	data() {
		return {
			open: false
		}
	}
})

const vm = new Vue({
	el: '#app',
	data: {},
	computed: {},
	methods: {},
	mounted() {
	}
});
