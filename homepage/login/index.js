$(document).ready(() => {
    $.ajax({
        url : "/ajax/session/login_status", // get login status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        if(json.login_status) {
            location.href = '/';
        }
        else if(json.login_status == 0) {
            $("#success_label").show();
        }
    })
    .fail((xhr, status, error) => console.log(error))
});