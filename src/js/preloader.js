'use strict';

window.onload = () => {
	const preloader = document.querySelector('.preloader');
	preloader.classList.add('preloader__hiding');
	setTimeout(() => preloader.classList.add('preloader__hide'), 990);
};



