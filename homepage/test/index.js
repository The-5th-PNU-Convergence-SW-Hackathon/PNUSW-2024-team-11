$(document).ready(() => {
    let login_status = false;
    let USER = [];
    $.ajax({
        url : "/ajax/session/login_status", // get login status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        if(json.login_status) {
            login_status = true;
            $.ajax({
                url : "/ajax/session/USER", // get login status
                type : 'POST', 
                dataType: 'JSON',
                data: {}
            })
            .done(info => {
                USER = info.USER;
                $("#mention").text(`${USER[1]}님 환영합니다.`);
                $("#mention").show();
                $("#btn_login").hide();
                $("#btn_register").hide();
                $("#btn_logout").show();
            })
            .fail((xhr, status, error) => console.log(error));
        }
    })
    .fail((xhr, status, error) => console.log(error));

    $("#btn_register").on("click", () => {
        location.href = '/register';
    });

    $("#btn_login").on("click", () => {
        location.href = '/login';
    });

    $("#btn_logout").on("click", () => {
        location.href = '/logout';
    });
});
