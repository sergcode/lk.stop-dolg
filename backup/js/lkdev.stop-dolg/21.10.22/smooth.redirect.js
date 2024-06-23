"use strict";

function smoothRedirect() {
	const preloader = document.querySelector('.preloader');

	document.body.addEventListener('click', (e) => {
		const warningMessage = e.currentTarget.querySelector('.warning-popup.visible');

		if (e.target && e.target.matches('a[href^="/"]') || e.target && e.target.matches('a[itemprop="url"]') || e.target && e.target.matches('a[href="javascript:history.back();"]')) {
			if (warningMessage) { // Проверяем, если есть хоть одно сообщение с предупреждением, то останавливаем выполнение скрипта
				e.preventDefault();

			} else if (!e.target.matches('a[href="/new-useful/"][data-run-onboard]') && !e.target.matches('[data-modal="inDeveloping"]')) {
				preloader.classList.remove('preloader__hiding', 'preloader__hide');
				preloader.classList.add('preloader__show');
			}
		}

		/* Если нажата кнопка, принудительного перехода на другую страницу, в сообщении с предупреждением, то запускаем плавный переход */
		if (e.target && e.target.matches('[name="closeQuestionnaire"]')) {
			preloader.classList.remove('preloader__hiding', 'preloader__hide');
			preloader.classList.add('preloader__show');
		}
	});
}

smoothRedirect();
