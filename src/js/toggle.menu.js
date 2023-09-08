"use strict";

function createdTooltip(text, coordinates) {
	const createdElement = document.createElement('div');

	createdElement.classList.add('nav__link_tooltip');
	createdElement.textContent = text;
	createdElement.style.top = `${coordinates.top - 4}px`;
	createdElement.style.left = `${coordinates.left}px`;

	return createdElement;
}

function toggleMenu() {
	const headerAuth = document.querySelector('.headerAuth'),
			headerAuthWrapper = headerAuth.querySelector('.headerAuth__wrapper'),
			headerAuthWrapperNavLink = headerAuthWrapper.querySelectorAll('.nav__link'),
			headerAuthBtnClose = headerAuthWrapper.querySelector('.headerAuth__button'),
			headerAuthLogo = headerAuthWrapper.querySelector('.header__logo-wrapper a'),
			headerAuthLogoSvg = headerAuthLogo.innerHTML;

	const logoHorizontal = `
		<svg class="logoVertical" width="19" height="73" viewBox="0 0 19 73" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path fill-rule="evenodd" clip-rule="evenodd" d="M12.7158 17.4634H19V0H8.05168C3.63307 0 0 3.60976 0 8V24C0 28.439 3.63307 32 8.05168 32H18.9509V27.4634H9.47545C7.70801 27.4634 6.28424 26.0488 6.28424 24.2927V7.7561C6.28424 6 7.70801 4.58537 9.47545 4.58537H13.2558C12.9121 5.65854 12.7158 6.82927 12.7158 8.04878V17.4634Z" fill="#275957"/>
		<path fill-rule="evenodd" clip-rule="evenodd" d="M6.28424 54.9909H-1.61313e-07L-1.61313e-07 73H10.9483C15.3669 73 19 69.2774 19 64.75L19 48.25C19 43.6723 15.3669 40 10.9483 40H0.0490968V44.6784H9.52455C11.292 44.6784 12.7158 46.1372 12.7158 47.9482L12.7158 65.0015C12.7158 66.8125 11.292 68.2713 9.52455 68.2713H5.74419C6.08786 67.1646 6.28424 65.9573 6.28424 64.6997V54.9909Z" fill="#275957"/>
		</svg>
	`;

	headerAuthBtnClose.addEventListener('click', function (evt) {
		evt.preventDefault();

		headerAuth.classList.toggle('collapsed');

		headerAuthWrapperNavLink.forEach(elemLink => {
			let elemLinkText = elemLink.textContent || elemLink.innerText,
					elemLinkCoordinates = elemLink.querySelector('svg').getBoundingClientRect();

			if (headerAuth.classList.contains('collapsed')) {
				headerAuth.append(createdTooltip(elemLinkText, elemLinkCoordinates));
				headerAuthLogo.innerHTML = logoHorizontal;

			} else {
				headerAuth.querySelectorAll('.nav__link_tooltip').forEach(createdElem => {
					createdElem.remove();
				});
				headerAuthLogo.innerHTML = headerAuthLogoSvg;
			}
		});
	});

	headerAuthWrapperNavLink.forEach(elemLink => {
		elemLink.addEventListener('mouseenter', function () {
			headerAuth.querySelectorAll('.nav__link_tooltip').forEach(createdElem => {
				if (this.innerText === createdElem.innerText) {
					createdElem.classList.add('hover');
				}
			});
		});

		elemLink.addEventListener('mouseleave', function () {
			headerAuth.querySelectorAll('.nav__link_tooltip').forEach(createdElem => {
				if (this.innerText === createdElem.innerText) {
					createdElem.classList.remove('hover');
				}
			});
		});
	});
}

toggleMenu();
