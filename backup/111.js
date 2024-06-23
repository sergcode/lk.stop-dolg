$(document).ready(function(){
//Показать товар в наличии
	setTimeout(function(){
		if($('.t-checkbox.js-store-filter-opt-chb[name="Фитнес"]').is(':checked')) {

		} else{
			$('.t-checkbox.js-store-filter-opt-chb[name="Фитнес"]').click();
		}

	}, 1000);

});

$(document).ready(function(){
//Показать товар в наличии
	setTimeout(function(){
		if( $('input.js-store-filter-onlyavail').is(':checked')){
		}else{ $('input.js-store-filter-onlyavail').click();};
	}, 1000);
//Сортировать от нового товара
	setTimeout(function(){
		if( $('select.t-store__sort-select option[data-filter-value="created:desc"]').prop('selected')){
		}else{$('.t-store__filter__custom-sel[data-select-val="created:desc"]').click();};
	}, 2000);
});
