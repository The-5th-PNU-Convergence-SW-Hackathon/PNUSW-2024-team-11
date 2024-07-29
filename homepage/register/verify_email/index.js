$(document).ready(() => {
    $.ajax({
        url : "/ajax/session/verify_email_status", // get email verify status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        if(json.verify_email_status) {
            $("#verify_status").text("이메일 인증에 성공했습니다.");
            $("#homepage_btn").addClass('btn-success');
        }
        else {
            $("#verify_status").text("이메일 인증에 실패했습니다.");
            $("#homepage_btn").addClass('btn-danger');
        }
    })
    .fail((xhr, status, error) => console.log(error));
});