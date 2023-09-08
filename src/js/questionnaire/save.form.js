
$('.owl-carousel').on('changed.owl.carousel', function (e) {
    $.ajax({
        url:"/assets/ajax.php",
        type:"POST",
        data:$("#formCustomerProfile").serialize(),
        success:(data)=>{
            console.log(data);
        }
    })
});