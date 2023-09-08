// Скрипт для локального компонента Меню Header-inner.html, который переключает класс Active для пунктом меню.

const url = window.location.pathname;

// Event listeners
borrowerProtectionItemMenu();
navLinkItemMenu();

function borrowerProtectionItemMenu() {
  const borrowerProtection = [
    '/borrower-protection.html',
    '/protection-prior-to-court.html',
    '/protection-in-court.html',
    '/protection-after-trial.html',
    '/lender-cannot-collect-debt.html',
    '/protection-of-income.html',
    '/negotiations-with-creditors.html',
    '/negotiations-with-creditors-tasks.html',
    '/anti-collector-protection.html',
    '/anti-collector-protection-tasks.html',
    '/now-in-court.html',
    '/passed-trial.html',
    '/existing-enforcement-proceedings.html',
    '/closed-performance-plants.html',
    '/lender-cannot-collect-debt-process.html'
  ];
  const navLinkBorrowerProtection = document.querySelector('.nav__link[href="' + borrowerProtection[0] + '"]');

  borrowerProtection.forEach(elem => {
    if (url.indexOf(elem) !== -1) {
      navLinkBorrowerProtection.classList.add('active');
    }
  });

}

function navLinkItemMenu() {
  const navLink = document.querySelectorAll('.nav__link');

  navLink.forEach(elem => {
    const elemHref = elem.getAttribute('href');

    if (url.indexOf(elemHref) !== -1) {
      elem.classList.add('active');
    }
  });
}


