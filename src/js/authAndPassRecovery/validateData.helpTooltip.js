"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const tooltipParent = document.querySelectorAll('.help-tooltip');

	function createTooltipWrapperContent(parent) {
		const tooltipBtnSpanHidden = parent.querySelector('span[hidden]');

		if (tooltipBtnSpanHidden) {
			const	tooltipWrapper = document.createElement('div');

			tooltipWrapper.hidden = true;
			tooltipWrapper.classList.add('help-tooltip__wrapper-tooltip');
			tooltipWrapper.innerHTML = `
			<button class="help-tooltip__wrapper-tooltip_close" role="button">&times;</button>
      <span>${tooltipBtnSpanHidden.textContent}</span>
		`;

			tooltipBtnSpanHidden.remove();
			parent.append(tooltipWrapper);
		}
	}

	function openTooltip(btnOpenTooltip, tooltipWrapper) {
		btnOpenTooltip.classList.add('active');
		tooltipWrapper.hidden = false;
		tooltipWrapper.parentElement.classList.add('activeHelpTooltip');
	}

	function closeTooltip() {
		document.querySelectorAll('.help-tooltip__btn').forEach((btn, i) => {
			const tooltipWrapper = document.querySelectorAll('.help-tooltip__wrapper-tooltip')[i];

			btn.classList.remove('active');
			tooltipWrapper.hidden = true;
			tooltipWrapper.parentElement.classList.remove('activeHelpTooltip');
		});
	}

	function tooltip() {
		if (tooltipParent) {
			tooltipParent.forEach(parent => {
				createTooltipWrapperContent(parent);

				const tooltipButton = parent.querySelector('.help-tooltip__btn'),
						tooltipBtnClose = parent.querySelector('.help-tooltip__wrapper-tooltip_close');

				if (tooltipButton) {
					tooltipButton.addEventListener('click', function (e) {
						e.preventDefault();
						closeTooltip();
						openTooltip(this, parent.querySelector('.help-tooltip__wrapper-tooltip'));
					});
				}

				if (tooltipBtnClose) {
					tooltipBtnClose.addEventListener('click', function (e) {
						e.preventDefault();
						closeTooltip();
					});
				}
			});
		}
	}

	function loginValid() {
		const inputsLogin = document.querySelectorAll('input[type="email"], input[name="username"], input[name="email"]'),
					regularEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

		for (let inputLogin of inputsLogin) {
			inputLogin.addEventListener('focus', function () {
				this.setAttribute('placeholder', 'example@example.ru');
			});

			inputLogin.addEventListener('blur', function (e) {
				const parent = e.target.parentElement,
						helpTooltip = parent.querySelector('.help-tooltip');

				this.removeAttribute('placeholder');

				if (e.target.value.length > 0 && !regularEmail.test(e.target.value)) {
					e.target.classList.add('invalid');

					if (helpTooltip) {
						openTooltip(helpTooltip.querySelector('.help-tooltip__btn'), helpTooltip.querySelector('.help-tooltip__wrapper-tooltip'));
					}
				}
			});

			inputLogin.addEventListener('input', (e) => {
				if (e.target.value.length > 0 && regularEmail.test(e.target.value) || e.target.value.length === 0) {
					closeTooltip();
					e.target.classList.remove('invalid');
				}
			});
		}
	}

	tooltip();
	loginValid();
});
