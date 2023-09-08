const buttonAddCheck = document.querySelectorAll('.button[name="addCheck"]');
let formAddDataMessage = document.createElement('div');
formAddDataMessage.className = 'message';

eventListeners();

function eventListeners() {
    buttonAddCheck.forEach(elem => {
        document.addEventListener(`DOMContentLoaded`, buttonAddForm(elem));
    });
}

function buttonAddForm(addForm) {
    addForm.onclick = (evenT) => {
        evenT.preventDefault();
        addForm.parentElement.classList.add('hidden');
    }
}

function valid(form) {
    let fail = false;
    let bank = form.bank,
        bik = form.bik,
        inn = form.inn,
        kpp = form.kpp,
        coreCheck = form.coreCheck,
        beneficiaryAccount = form.beneficiaryAccount,
        recipient = form.recipient,
        button = form.button;
    const colorBorder = "#fe4f3e";
    const inputForm = form.querySelectorAll('input');
    form.insertAdjacentElement('beforeend', formAddDataMessage);

    if (bik.value === "" || bik.value === " " || bik.value.length < 9) {
        fail = "БИК должен состоять<br />из 9 - ти цифр.<br />Введено: " + bik.value.length;
        bik.style.borderColor = colorBorder;
        bik.style.WebkitTextFillColor = colorBorder;
        bik.oninput = function () {
            if (this.value.length === 9 || this.value === "") {
                bik.removeAttribute('style');
            }
        }

    } else if (bank.value === "" || bank.value === " " || bank.value.length < 0) {
        fail = "Вы не ввели <br />название банка";
        bank.style.borderColor = colorBorder;
        bank.oninput = function () {
            if (this.value.length > 0) {
                bank.removeAttribute('style');
            }
        };

    } else if (inn.value === "" || inn.value === " " || inn.value.length < 10) {
        fail = "ИНН должен состоять<br />из 10 - ти цифр.<br />Введено: " + inn.value.length;
        inn.style.borderColor = colorBorder;
        inn.style.WebkitTextFillColor = colorBorder;
        inn.oninput = function () {
            if (this.value.length === 10 || this.value === "") {
                inn.removeAttribute('style');
            }
        };

    } else if (kpp.value === "" || kpp.value === " " || kpp.value.length < 9) {
        fail = "КПП должен состоять<br />из 9 - ти цифр.<br />Введено: " + kpp.value.length;
        kpp.style.borderColor = colorBorder;
        kpp.style.WebkitTextFillColor = colorBorder;
        kpp.oninput = function () {
            if (this.value.length === 9 || this.value === "") {
                kpp.removeAttribute('style');
            }
        };

    } else if (coreCheck.value === "" || coreCheck.value === " " || coreCheck.value.length < 20) {
        fail = "Корсчёт должен состоять<br />из 20 - ти цифр.<br />Введено: " + coreCheck.value.length;
        coreCheck.style.borderColor = colorBorder;
        coreCheck.style.WebkitTextFillColor = colorBorder;
        coreCheck.oninput = function () {
            if (this.value.length === 20 || this.value === "") {
                coreCheck.removeAttribute('style');
            }
        };

    } else if (beneficiaryAccount.value === "" || beneficiaryAccount.value === " " || beneficiaryAccount.value.length < 20) {
        fail = "Счёт получателя должен<br />состоять из 20 - ти цифр.<br />Введено: " + beneficiaryAccount.value.length;
        beneficiaryAccount.style.borderColor = colorBorder;
        beneficiaryAccount.style.WebkitTextFillColor = colorBorder;
        beneficiaryAccount.oninput = function () {
            if (this.value.length === 20 || this.value === "") {
                beneficiaryAccount.removeAttribute('style');
            }
        };

    } else if (recipient.value === "" || recipient.value === " " || recipient.value.length < 0) {
        fail = "Вы не ввели <br />получателя";
        recipient.style.borderColor = colorBorder;
        recipient.oninput = function () {
            if (this.value.length > 0) {
                recipient.removeAttribute('style');
            }
        };
    }

    if (fail) {
        // Нужен чтобы плавно показать предупреждение
        setTimeout(() => {
            formAddDataMessage.classList.add('visible');
            formAddDataMessage.innerHTML = `<h2 style="color: #c83a2c;">${fail}</h2>`;
        }, 100);

        // Нужен чтобы плавно скрыть предупреждение через 2 сек.
        setTimeout(() => {
            formAddDataMessage.classList.remove('visible');
        }, 2000);

        return false;

    } else {
        setTimeout(() => {
            formAddDataMessage.classList.add('visible');
            formAddDataMessage.innerHTML = '<h2 style="color: #275957;">Спасибо! <br />Данные успешно <br />сохранены</h2>';
            button.classList.add('hidden-top');
        }, 100);

        setTimeout(() => {
            formAddDataMessage.classList.remove('visible');
            button.remove();
        }, 2000);

        inputForm.forEach(elem => {
            elem.setAttribute('disabled', 'disabled');
        });

        return true;
    }
}
