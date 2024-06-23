;(function ($){
	$(document).ready(() => {
		if (window.matchMedia('(min-width: 400px)').matches) {
			$("body").css("display", "flex").hide().fadeIn(1000);
		} else {
			$("body").fadeIn(1000);
		}

		$("a.transition").on('click', function (e) {
			e.preventDefault();
			let linkLocation = this.href;

			$("body").fadeOut(700, () => {
				redirectPage(linkLocation);
			});
		});

		function redirectPage(linkLocation) {
			window.location = linkLocation;
		}
	});
})(jQuery);
