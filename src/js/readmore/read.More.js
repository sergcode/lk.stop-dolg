"use strict";

/** todo Анонимный Модуль прослушивания изменения ориентации экрана **/
(function () {
	const mediaQueryList = window.matchMedia("(orientation: portrait)");

	function handleOrientationChange(mql) {
		const dataReadMoreParent = document.querySelectorAll("[data-readmore='readMore']");

		dataReadMoreParent.forEach(parent => {
			const readMoreHidingWrapper = parent.querySelectorAll('.readMore__hiding-wrapper');

			readMoreHidingWrapper.forEach(hidingWrapper => {

				// Прослушать изменение ориентации экрана и закрыть при изменении ориентации
				if (hidingWrapper.classList.contains('show')) {
					const grandparent = hidingWrapper.parentElement.closest('.readMore__hiding-wrapper.show');

					/* Подогнать высоту родительского блока при изменении ориентации экрана */
					const changeParentWrapper = () => {
						if (!grandparent) {
							hidingWrapper.style.maxHeight = '100%'; // Делаем полную высоту блока, чтобы он не обрезался снизу, т.к. возникает баг с этим из-за особенностей css.

							setTimeout(() => {
								hidingWrapper.style.maxHeight = `${hidingWrapper.scrollHeight}px`; // Через 100ms присваиваем высоту блока в пикселях, чтобы плавно закрывался блок
							}, 100);
						}
					};

					/* Закрыть дочерний блок при изменении ориентации экрана */
					const hidingChildrenWrapper = () => {
						if (grandparent) {
							hidingWrapper.style.maxHeight = null;
							grandparent.style.maxHeight = `${Math.round((grandparent.scrollHeight - hidingWrapper.scrollHeight) + hidingWrapper.offsetHeight)}px`;

							setTimeout(() => {
								hidingWrapper.classList.remove('show');
								hidingWrapper.classList.remove('fade');
							}, 200);

							hidingWrapper.nextElementSibling.classList.remove('active');
						}
					};

					if (mql.matches) {
						changeParentWrapper();
						hidingChildrenWrapper();

					} else {
						changeParentWrapper();
						hidingChildrenWrapper();
					}
				}
			});
		});
	}

	mediaQueryList.addEventListener('change', handleOrientationChange);

	handleOrientationChange(mediaQueryList);
}());

/** todo Если в родительском блоке нет скрытой информации. **/
function minimalInfo(parentRead) {
	parentRead.classList.add('minimal-info');
	parentRead.style.paddingBottom = '30px';
}

/** todo Показать или скрыть блок **/
function readMoreShowHideBlock(elem) {
	const increaseMaxHeight = () => elem.style.maxHeight = `${elem.scrollHeight + 10}px`,
			reduceMaxHeight = () => elem.style.maxHeight = null,
			grandparent = elem.parentElement.closest('.readMore__hiding-wrapper.show');

	if (elem.classList.contains('show')) {
		elem.classList.add('fade');

		if (grandparent) {
			reduceMaxHeight();
			grandparent.style.maxHeight = `${Math.round((grandparent.scrollHeight - elem.scrollHeight) + elem.offsetHeight)}px`;
		} else {
			reduceMaxHeight();
		}

		setTimeout(() => {
			elem.classList.remove('show');
			elem.classList.remove('fade');
		}, 200);

	} else {
		elem.classList.add('show');

		if (grandparent) {
			increaseMaxHeight();
			grandparent.style.maxHeight = `${Math.round((grandparent.scrollHeight + elem.scrollHeight) - elem.offsetHeight)}px`;
		} else {
			increaseMaxHeight();
		}
	}
}

/** todo Плавное раскрытие блоков **/
function openHideBlock(parentRead, childHideBlock) {
	if (childHideBlock) {
		if (parentRead.classList.contains('read')) {
			childHideBlock.style.maxHeight = childHideBlock.scrollHeight + 'px';
		} else {
			childHideBlock.style.maxHeight = null;
		}
	}
}

/** todo Создать кнопку **/
function createdBtn(readMoreHidingWrapper, nestingLevelClass) {
	readMoreHidingWrapper.insertAdjacentHTML('afterend', `
    <button class="readMore__btn ${nestingLevelClass}" title="Подробнее" role="button">
        <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"/>
        </svg>
    </button>`
	);
}

/** todo Манипуляции с родительской оберткой скрытого блока и кнопкой подробнее **/
function readMore() {
	const dataReadMoreParent = document.querySelectorAll("[data-readmore='readMore']"),
	      mediaQuerySmartphone = window.matchMedia("(max-width: 479.98px)");

	dataReadMoreParent.forEach(parentRead => {
		const readMoreWrapper = parentRead.querySelectorAll('.readMore__wrapper'),
				textarea = parentRead.querySelectorAll('.textarea'),
				zpzCreditorTasksArrears = parentRead.querySelector('.zpz-creditors__tasks-arrears');

		textarea.forEach(elemTextarea => {
			if (153 < elemTextarea.scrollHeight) {
				elemTextarea.classList.add('readMore__hide-content');
			}

			if (mediaQuerySmartphone.matches) {
				if (120 < elemTextarea.scrollHeight) {
					elemTextarea.classList.add('readMore__hide-content');
				}
			}
		});

		readMoreWrapper.forEach(readMoreParent => {
			const readMoreHidingWrapper = readMoreParent.querySelector('.readMore__hiding-wrapper'),
						zpzCreditorsWrapperTasks = readMoreHidingWrapper.querySelector('.zpz-creditors__wrapper-tasks');

			if (readMoreParent && readMoreHidingWrapper.childElementCount !== 0 && !readMoreParent.parentElement.closest('.readMore__wrapper')) {

				/** Если в обертке нет не одного дочернего элемента, то удалить пустую обертку. **/
				if (zpzCreditorsWrapperTasks && zpzCreditorsWrapperTasks.childElementCount === 0) {
					minimalInfo(parentRead);

				} else {
					createdBtn(readMoreHidingWrapper, 'readMore__btn_parent-block');
				}

				readMoreParent.addEventListener('click', (e) => {
					e.preventDefault();

					if (e.target && e.target.classList.contains('readMore__btn_parent-block')) {
						e.target.classList.toggle('active');

						if (e.target.classList.contains('active')) {
							e.target.setAttribute('title', 'Скрыть');

						} else {
							e.target.setAttribute('title', 'Подробнее');
						}

						parentRead.classList.toggle('read');
						scrollTopJQuery(parentRead);
						openHideBlock(parentRead, zpzCreditorTasksArrears);

						textarea.forEach(elemTextarea => {
							if (parentRead.classList.contains('read')) {
								elemTextarea.classList.remove('readMore__hide-content');

							} else if (!parentRead.classList.contains('read') && 153 < elemTextarea.scrollHeight) {
								elemTextarea.classList.add('readMore__hide-content');
							}
						});

						if (e.target.previousElementSibling.classList.contains('readMore__hiding-wrapper')) {
							readMoreShowHideBlock(e.target.previousElementSibling);
						}
					}
				});
			} else if (readMoreHidingWrapper.childElementCount === 0 && !readMoreParent.parentElement.closest('.readMore__wrapper')) {
				minimalInfo(parentRead);
			}
		});

		if (!parentRead.querySelector('.readMore__wrapper')) {
			minimalInfo(parentRead);
		}
	});
}

/** todo Манипуляции с блоками типа TEXTAREA у которых видна часть скрытого содержимого **/
function readMoreCreateBtnMore(nestedHiddenBlock, maxHeight) {
	const dataReadMoreParent = document.querySelectorAll("[data-readmore='readMore']");

	dataReadMoreParent.forEach(parentRead => {
		const readMoreWrapper = parentRead.querySelectorAll('.readMore__wrapper');

		readMoreWrapper.forEach(readMoreParent => {
			const readMoreHidingWrapper = readMoreParent.querySelector('.readMore__hiding-wrapper');

			if (readMoreHidingWrapper.classList.contains(nestedHiddenBlock)) {
				if (maxHeight < readMoreHidingWrapper.scrollHeight) {
					readMoreHidingWrapper.style.borderRadius = '0';
					createdBtn(readMoreHidingWrapper, 'readMore__btn_child-block');

					readMoreParent.addEventListener('click', (e) => {
						e.preventDefault();

						if (readMoreParent.parentElement.closest('.readMore__wrapper')) {
							if (e.target && e.target.classList.contains('readMore__btn_child-block')) {
								e.target.classList.toggle('active');

								if (e.target.classList.contains('active')) {
									e.target.setAttribute('title', 'Скрыть');

								} else {
									e.target.setAttribute('title', 'Подробнее');
								}

								if (e.target.previousElementSibling.classList.contains('readMore__hiding-wrapper')) {
									readMoreShowHideBlock(e.target.previousElementSibling);
								}
							}
						}
					});
				}
			}
		});
	});
}

/** todo Скролл до элемента **/
function scrollTopJQuery(selector) {
	$('html, body').animate({
		scrollTop: $(selector).offset().top - 200,
	}, {
		duration: 200,
		easing: "linear"
	});
}

readMore();
