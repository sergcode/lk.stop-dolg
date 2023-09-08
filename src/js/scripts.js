function sendForm(form){
    var data = $(form).serialize();
    if(valid(form)){
        $.ajax({
            url:$(form).data('action'),
            type:"POST",
            data:data,
            success:function(res){
                console.log(res);
            }
        })
    }
}

$(document).ready(function() {
    let form = $("#requestTransfer");
    let comment = $(form).find("textarea");
    let submit = $(form).find("button");
    
    $(submit).on('click', (event) => {
        if (comment.hasClass('visible') && comment.val() && comment.val().length >= 10) {
            form.submit();
            
            return;
        }
        
        validateForm(form[0]);
    });
});

$(document).on('af_complete', function(event, response) {
    var form = response.form;

    // console.log(response)
    
    if (form.attr('id') == 'requestTransfer') {
        if (response.success) {
            let submit = form.find("button");
            let comment = $(form).find("textarea");
            
            response.message = '';
            
            validateForm(form[0]);
        }
    }
});