"use strict";

/** При загрузке удалить из cookie - PHPSESSID, чтобы не возникали проблемы при повторной авторизации пользователей **/

/*window.addEventListener('DOMContentLoaded', () => {
 function deleteCookie(cookieName) {
 const cookie_date = new Date(); // Текущая дата и время
 cookie_date.setTime(cookie_date.getTime() - 1);
 document.cookie = cookieName += "=; expires=" + cookie_date.toUTCString();
 }

 deleteCookie("PHPSESSID");
 });*/

/*function deleteCookie(name) {
	let cookie_date = new Date();
	cookie_date.setMonth(cookie_date.getMonth() - 1);
	document.cookie = `"${name}=; expires="` + cookie_date.toUTCString();
	// console.log(name);
}

window.onload = () => {
	deleteCookie('PHPSESSID');
};*/

/*function deleteCookie() {
	const cookies = document.cookie.split(/;/);
	for (let i = 0, len = cookies.length; i < len; i++) {
		const cookie = cookies[i].split(/=/);
		document.cookie = cookie[0] + "=;max-age=-1";
	}
}

window.onload = () => deleteCookie();*/


window.addEventListener('DOMContentLoaded', () => {
	function CookiesDelete() {
		const cookies = document.cookie.split(";");
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i];
			const eqPos = cookie.indexOf("=");
			const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
			document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}
	}

	CookiesDelete();
});
