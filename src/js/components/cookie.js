"use strict";

window.addEventListener('DOMContentLoaded', () => {

	function createdCookieMessage() {
		const createParent = document.createElement('div');
		createParent.classList.add('cookie');
		createParent.id = 'cookie';
		createParent.innerHTML = `
			<div class="cookie__content">
        <div class="cookie__content_text">
          <p class="text__title">
            Мы используем cookie
          </p>
          <p class="text__block">
            Продолжая использовать наш сайт, вы даете согласие на обработку <a href="https://base.garant.ru/12148567/" target="_blank" title="ФЗ «О персональных данных»">файлов cookie, пользовательских данных</a> 
            (сведения о местоположении; тип и версия ОС; тип и версия Браузера; тип устройства и разрешение его экрана; источник откуда пришел на сайт пользователь;
            с какого сайта или по какой рекламе; язык ОС и Браузера; какие страницы открывает и на какие кнопки нажимает пользователь; ip-адрес)
            в целях функционирования сайта, проведения ретаргетинга и проведения статистических исследований и обзоров. Если вы не хотите,
            чтобы ваши данные обрабатывались, покиньте сайт.
          </p>
        </div>

        <div class="cookie__content_button">
          <button class="button button--green">ОК</button>
        </div>
      </div>
		`;

		document.querySelector('main').append(createParent);
	}

	/** Конструктор регулярного выражения **/
	function getCookie(name) {
		let matches = document.cookie.match(new RegExp(
				"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	/* todo Определение OS, Браузера и т.д. Начало. */
	const unknown = '-';

	// screen
	let screenSize = '';
	if (screen.width) {
		let width,
				height;
		width = (screen.width) ? screen.width : '';
		height = (screen.height) ? screen.height : '';
		screenSize += '' + width + " x " + height;
	}

	// browser
	let nVer = navigator.appVersion,
			nAgt = navigator.userAgent,
			browser = navigator.appName,
			version = '' + parseFloat(navigator.appVersion),
			majorVersion = parseInt(navigator.appVersion, 10),
			nameOffset, verOffset, ix;

	// Opera
	if ((verOffset = nAgt.indexOf('Opera')) !== -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 6);

		if ((verOffset = nAgt.indexOf('Version')) !== -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}

	// Opera Next
	if ((verOffset = nAgt.indexOf('OPR')) !== -1) {
		browser = 'Opera';
		version = nAgt.substring(verOffset + 4);
	}

	// Legacy Edge
	else if ((verOffset = nAgt.indexOf('Edge')) !== -1) {
		browser = 'Microsoft Legacy Edge';
		version = nAgt.substring(verOffset + 5);
	}

	// Edge (Chromium)
	else if ((verOffset = nAgt.indexOf('Edg')) !== -1) {
		browser = 'Microsoft Edge';
		version = nAgt.substring(verOffset + 4);
	}

	// MSIE
	else if ((verOffset = nAgt.indexOf('MSIE')) !== -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(verOffset + 5);
	}

	// Chrome
	else if ((verOffset = nAgt.indexOf('Chrome')) !== -1) {
		browser = 'Chrome';
		version = nAgt.substring(verOffset + 7);
	}

	// Safari
	else if ((verOffset = nAgt.indexOf('Safari')) !== -1) {
		browser = 'Safari';
		version = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf('Version')) != -1) {
			version = nAgt.substring(verOffset + 8);
		}
	}

	// Firefox
	else if ((verOffset = nAgt.indexOf('Firefox')) !== -1) {
		browser = 'Firefox';
		version = nAgt.substring(verOffset + 8);
	}

	// MSIE 11+
	else if (nAgt.indexOf('Trident/') !== -1) {
		browser = 'Microsoft Internet Explorer';
		version = nAgt.substring(nAgt.indexOf('rv:') + 3);
	}

	// Other browsers
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
		browser = nAgt.substring(nameOffset, verOffset);
		version = nAgt.substring(verOffset + 1);
		if (browser.toLowerCase() === browser.toUpperCase()) {
			browser = navigator.appName;
		}
	}

	// trim the version string
	if ((ix = version.indexOf(';')) !== -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(' ')) !== -1) version = version.substring(0, ix);
	if ((ix = version.indexOf(')')) !== -1) version = version.substring(0, ix);

	majorVersion = parseInt('' + version, 10);
	if (isNaN(majorVersion)) {
		version = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}

	// mobile version
	const mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

	// system
	let os = unknown,
			clientStrings = [
				{s: 'Windows 11', r: /(Windows 11.0|Windows NT 11.0)/},
				{s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
				{s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
				{s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
				{s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
				{s: 'Windows Vista', r: /Windows NT 6.0/},
				{s: 'Windows Server 2003', r: /Windows NT 5.2/},
				{s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
				{s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
				{s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
				{s: 'Windows 98', r: /(Windows 98|Win98)/},
				{s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
				{s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
				{s: 'Windows CE', r: /Windows CE/},
				{s: 'Windows 3.11', r: /Win16/},
				{s: 'Android', r: /Android/},
				{s: 'Open BSD', r: /OpenBSD/},
				{s: 'Sun OS', r: /SunOS/},
				{s: 'Chrome OS', r: /CrOS/},
				{s: 'Linux', r: /(Linux|X11(?!.*CrOS))/},
				{s: 'iOS', r: /(iPhone|iPad|iPod)/},
				{s: 'Mac OS X', r: /Mac OS X/},
				{s: 'Mac OS', r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
				{s: 'QNX', r: /QNX/},
				{s: 'UNIX', r: /UNIX/},
				{s: 'BeOS', r: /BeOS/},
				{s: 'OS/2', r: /OS\/2/},
				{s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
			];
	for (let id in clientStrings) {
		let cs = clientStrings[id];
		if (cs.r.test(nAgt)) {
			os = cs.s;
			break;
		}
	}

	let osVersion = unknown;

	if (/Windows/.test(os)) {
		osVersion = /Windows (.*)/.exec(os)[1];
		os = 'Windows';
	}

	switch (os) {
		case 'Mac OS':
		case 'Mac OS X':
		case 'Android':
			osVersion = /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(nAgt)[1];
			break;

		case 'iOS':
			osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
			osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
			break;
	}

	window.jscd = {
		screen: screenSize,
		browser: browser,
		browserVersion: version,
		browserMajorVersion: majorVersion,
		mobile: mobile,
		os: os,
		osVersion: osVersion
	};

	/* todo Определение OS, Браузера и т.д. Конец. */

	let ip = new Promise((resolve, reject) => {
		setTimeout(() => {
			resolve(fetch('https://ipapi.co/json/').then(d => d.json()).then(d => d.ip));
		},1000);
	});

	let ipData = () => {
		const ipWrap = document.createElement('div');
		ipWrap.classList.add('ipData');
		ipWrap.hidden = true;
		ip.then(result => {
			ipWrap.innerText = `${result}`;
		}).catch(e => console.log(e));
		document.body.append(ipWrap);
	}

	function geoFindMe() {
		function success(position) {
			const latitude  = position.coords.latitude,
					longitude = position.coords.longitude;
			setCookie(
					'registration', 'registered',
					{
						'location': `${latitude}, ${longitude}`
					});
		}

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success);
		}
	}

	const alertWin = getCookie('registration');

	if (alertWin !== 'registered') {
		createdCookieMessage();
		ipData();
	}

	function setCookie(name, value, options = {}) {
		let lifetime = new Date(Date.now() + 86400e3);
		const ipDataText = document.querySelector('.ipData');

		options = {
			path: '/',
			created: new Date, // Дата создания куки
			expires: lifetime.toUTCString(), // Время жизни куки 1 день
			secure: true,
			samesite: 'strict',
			referrer_url: document.referrer, // Откуда пришел посетитель
			ip: ipDataText.innerText,
			browser: `${jscd.browser} ${jscd.browserMajorVersion} ${jscd.browserVersion}`,
			browser_lang: navigator.language || navigator.userLanguage,
			os: `${jscd.os} ${jscd.osVersion}`,
			mobile: `${jscd.mobile}`,
			screen_size: `${jscd.screen}`,

			// при необходимости добавьте другие значения по умолчанию
			...options
		};

		let updatedCookie = `${encodeURIComponent(name)} = ${encodeURIComponent(value)}`;

		for (let optionKey in options) {
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true) {
				updatedCookie += " = " + optionValue;
			}
		}

		document.cookie = updatedCookie;
		// console.log(updatedCookie);
	}

	const cookieParent = document.getElementById('cookie');

	if (cookieParent) {
		const cookieCloseBtn = cookieParent.querySelector('.button');

		cookieCloseBtn.addEventListener('click', e => {
			e.preventDefault();
			const ipDataText = document.querySelector('.ipData');

			cookieParent.classList.add('hidden');
			// geoFindMe();
			setCookie('registration', 'registered', {});
			setTimeout(() => {
				cookieParent.classList.remove('hidden');
				cookieParent.remove();
				ipDataText.remove();
			},300);
		});
	}

	let exportText, // this variable needs to contain your content
			targetFilename = document.cookie;

	function presentExportFile() {
		let download = document.createElement('a');
		// you need to change the contenttype to your needs in the next line.
		download.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(exportText));
		download.setAttribute('download', targetFilename);

		download.style.display = 'none';
		document.body.appendChild(download);

		download.click();

		document.body.removeChild(download);
	}
});
