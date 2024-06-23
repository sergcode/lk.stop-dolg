$(document).on("click", ".del_file", function(){
	let id = $(this).data("id");
	
	$("#f_"+id).remove();
});