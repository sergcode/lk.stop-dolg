"use strict";

window.addEventListener('DOMContentLoaded', () => {
	const inDeveloping = document.querySelectorAll('.inDeveloping');

	inDeveloping.forEach(elemChild => {
		elemChild.addEventListener('click', function (e) {
			e.preventDefault();

			this.style.pointerEvents = 'none';
			setTimeout(() => this.style.pointerEvents = null, 1000);
		})
	});
});
