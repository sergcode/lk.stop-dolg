(function ($) {
	$('.sendFeed').on('click', e => {
		e.preventDefault();
		showModal();
	});

	$('.yesitis').on('click', function (e) {
		e.preventDefault();
		const fd = new FormData();

		fd.append('action', 'getFeedBack');
		fd.append('type', $(this).data("action"));

		$.ajax({
			type: "POST",
			url: "/assets/ajax.php",
			data: fd,
			contentType: false,
			cache: false,
			processData: false,
			success: function (msg) {
				let mass = JSON.parse(msg);
				if (mass.result == "ok") {

				} else {
					alert("Что-то пошло не так. Но мы уже исправляем это.");
				}
			}
		});
	});

	function showModal() {
		const modal = document.querySelector('.modal');

		if (modal) {
			const firstBox = modal.querySelector('.modal__box');

			if (document.body.scrollHeight !== window.innerHeight) {
				document.body.classList.add('overflow-hidden');
			}

			modal.classList.add('active');
			firstBox.classList.add('active');

			modal.onclick = (e) => {
				const target = e.target;

				if (target.hasAttribute('modal-close')) {
					if (document.body.classList.contains('overflow-hidden')) {
						document.body.classList.remove('overflow-hidden');
					}

					modal.classList.add('remove');

					setTimeout(() => {
						modal.classList.remove('active');
						modal.classList.remove('remove');
						modal.querySelector('.modal__box.active').classList.remove('active');
					}, 300);
				}

				if (target.hasAttribute('data-modal-button')) {
					const attr = target.getAttribute('data-modal-button'),
							activeBox = modal.querySelector('.modal__box.active'),
							box = modal.querySelector(`.modal__box[data-modal='${attr}']`);

					activeBox.classList.remove('active');
					box.classList.add('active');
				}
			};
		}
	}
})(jQuery);
