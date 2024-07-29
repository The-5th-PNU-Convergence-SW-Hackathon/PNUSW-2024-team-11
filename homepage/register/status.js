$(document).ready(() => {
    $.ajax({
        url : "/ajax/session/register_status", // get register status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        if(json.register_status) {
            $("#register_status").text("회원가입 성공!!");
            $("#verify_status").text("이메일 인증용 메일이 발송되었습니다.");
            $("#homepage_btn").addClass('btn-success');
        }
        else {
            $("#register_status").text("회원가입 실패..");
            $("#homepage_btn").addClass('btn-danger');
        }
    })
    .fail((xhr, status, error) => console.log(error));
});
