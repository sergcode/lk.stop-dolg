"use strict";

window.addEventListener('DOMContentLoaded', () => {
	function createSmartBanner() {
		const smartBanner = document.createElement('div');
		smartBanner.classList.add('smart-banner');
		smartBanner.innerHTML = `
      <div class="smart-banner__install-app">
        <div class="smart-banner__header">
          <div class="smart-banner__close-wrapper">
            <button class="smart-banner__close" role="button"></button>
          </div>
          <div class="login__logo">
            <svg width="125" height="95" viewBox="0 0 125 95" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M38.7261 51.8445H57.8648V0H24.5215C11.0646 0 0 10.7165 0 23.75V71.25C0 84.4284 11.0646 95 24.5215 95H57.7153V81.532H28.8577C23.4749 81.532 19.1388 77.3323 19.1388 72.1189V23.0259C19.1388 17.8125 23.4749 13.6128 28.8577 13.6128H40.3708C39.3242 16.7988 38.7261 20.2744 38.7261 23.8948V51.8445ZM86.4234 71.3948C86.4234 75.0152 85.8254 78.4909 84.7787 81.6768H96.2919C101.675 81.6768 106.011 77.4771 106.011 72.2637V23.0259C106.011 17.8125 101.675 13.6128 96.2919 13.6128L67.2847 13.468V0H100.478C114.085 0 125 10.7165 125 23.75V71.25C125 84.4284 113.935 95 100.478 95H67.2847V43.3003H86.4234V71.3948Z" fill="white"/>
            </svg>
          </div>
          <div class="smart-banner__title">
            <h1>Стопдолг. Личный кабинет клиента</h1>
            <h2>ООО "Правовые технологии Франчайзинг"</h2>
          </div>
      </div>

        <div class="smart-banner__body">
          <p>Работать в мобильном приложение<br/>ещё проще и удобнее</p>
        </div>

        <div class="smart-banner__footer">
          <a href="#" class="button button__big button--green" title="" target="_blank" role="link">
            Скачать приложение
            <svg width="12" height="20" viewBox="0 0 12 20" fill="none" xmlns="http://www.w3.org/2000/svg">
						  <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3031 10.9091C11.6062 10.6061 11.6062 10.303 11.6062 10C11.6062 9.69697 11.6062 9.39394 11.3031 9.09091L2.51526 0.30303C2.21222 0 1.90919 0 1.60616 0C1.0001 0 0.394043 0.60606 0.394043 1.21212C0.394043 1.51515 0.394043 1.81818 0.697073 2.12121L8.87889 10L1.0001 17.8788C0.697073 18.1818 0.697073 18.4848 0.697073 18.7879C0.697073 19.3939 1.30313 20 1.90919 20C2.21222 20 2.51526 20 2.81829 19.697L11.6062 10.9091H11.3031Z" fill="#FEFEFE"/>
						</svg>
          </a>
        </div>
      </div>
    `;
		document.body.prepend(smartBanner);
		toggleFocus(true);
	}

	function closeSmartBanner() {
		const closeBtn = document.querySelector('.smart-banner__close');
		closeBtn.addEventListener('click', (e) => {
			e.preventDefault();
			document.querySelector('.smart-banner').remove();
			toggleFocus(false);
		});
	}

	function toggleFocus(bool) {
		document.querySelectorAll('input').forEach(elem => {
			elem.disabled = bool;
		});
	}

	const userDeviceArray = [
		{device: 'Android', platform: /Android/},
		{device: 'iPhone', platform: /iPhone/},
		{device: 'iPad', platform: /iPad/},
		{device: 'Symbian', platform: /Symbian/},
		{device: 'Windows Phone', platform: /Windows Phone/},
		{device: 'Tablet OS', platform: /Tablet OS/}
	];

	const platform = navigator.userAgent;

	function getPlatform() {
		for (let i in userDeviceArray) {
			if (userDeviceArray[i].platform.test(platform)) {
				return userDeviceArray[i].device;
			}
		}
		return 'Неизвестная платформа!' + platform;
	}

	console.log('Ваша платформа: ' + getPlatform());

	if (getPlatform() === 'Android' || getPlatform() === 'iPhone') {
		createSmartBanner();
		closeSmartBanner();
	}

	const linkInstallApp = document.querySelector('.smart-banner__footer .button');

	switch (getPlatform()) {
		case 'Android':
			linkInstallApp.href = 'https://play.google.com/store/apps/details?id=com.ruyou.stopdebt';
			break;
		case 'iPhone':
			linkInstallApp.href = 'https://apps.apple.com/ru/app/%D1%81%D1%82%D0%BE%D0%BF%D0%B4%D0%BE%D0%BB%D0%B3-%D0%BB%D0%B8%D1%87%D0%BD%D1%8B%D0%B9-%D0%BA%D0%B0%D0%B1%D0%B8%D0%BD%D0%B5%D1%82/id1492454214';
			break;
	}
});
