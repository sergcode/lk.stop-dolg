"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const inputContainers = document.querySelectorAll('.login__input-container');

	/** todo Создать tooltip **/
	function createTooltipWrapperContent(parent, tooltipSpanTitleHidden, tooltipSpanContentOneHidden, tooltipSpanContentTwoHidden) {
		const tooltipWrapper = document.createElement('div');
		tooltipWrapper.hidden = true;
		tooltipWrapper.classList.add('help-tooltip__wrapper-tooltip', 'help-tooltip__wrapper-tooltip_auto', 'help-tooltip__wrapper-tooltip_bottom', 'help-tooltip__wrapper-tooltip_left');
		tooltipWrapper.innerHTML = `
      <div class="help-tooltip__title">
        ${tooltipSpanTitleHidden.textContent}
      </div>
      <div class="help-tooltip__content">
        ${tooltipSpanContentOneHidden.innerHTML}
      </div>
      <div class="help-tooltip__d-flex">
        ${tooltipSpanContentTwoHidden.innerHTML}
      </div>
		`;

		tooltipSpanTitleHidden.remove();
		tooltipSpanContentOneHidden.remove();
		tooltipSpanContentTwoHidden.remove();
		parent.append(tooltipWrapper);
	}

	for (let inputContainer of inputContainers) {
		const input = inputContainer.querySelector('input'),
				tooltipParent = inputContainer.querySelector('.help-tooltip');

		if (tooltipParent) {
			const tooltipSpanTitleHidden = tooltipParent.querySelector('.help-tooltip__title[hidden]'),
					tooltipSpanContentOneHidden = tooltipParent.querySelector('.help-tooltip__content_one[hidden]'),
					tooltipSpanContentTwoHidden = tooltipParent.querySelector('.help-tooltip__content_two[hidden]');

			createTooltipWrapperContent(tooltipParent, tooltipSpanTitleHidden, tooltipSpanContentOneHidden, tooltipSpanContentTwoHidden);

			/** todo При нажатии на input открыть tooltip **/
			input.addEventListener('focus', e => {
				e.preventDefault();
				const tooltipBtnClose = tooltipParent.querySelector('.help-tooltip__wrapper-tooltip_close');

				openTooltip(tooltipParent);

				if (tooltipBtnClose) {
					tooltipBtnClose.addEventListener('click', e => {
						e.preventDefault();
						closeTooltip(tooltipParent);
					});
				}
			});

			input.addEventListener('input', function (e) {
				e.preventDefault();

				/** todo Отследить, если в input есть хоть один символ, то закрыть tooltip, иначе открыть **/
				if (this.value.length > 0) {
					closeTooltip(tooltipParent);

				} else {
					openTooltip(tooltipParent);
				}
			});
		}
	}

	function openTooltip(parent) {
		const tooltipWrapper = parent.querySelector('.help-tooltip__wrapper-tooltip');
		tooltipWrapper.hidden = false;
		tooltipWrapper.parentElement.classList.add('activeHelpTooltip');
	}

	function closeTooltip(parent) {
		const tooltipWrapper = parent.querySelector('.help-tooltip__wrapper-tooltip'),
					passwordLength = parent.querySelector('.login__password-length');
		tooltipWrapper.hidden = true;
		tooltipWrapper.parentElement.classList.remove('activeHelpTooltip');
		passwordLength.value = 8;
	}
});

