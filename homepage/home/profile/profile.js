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
                url : "/ajax/session/profile", // get login status 
                type : 'POST', 
                dataType: 'JSON', 
                data: {} 
            }) 
            .done(USER => {
                // USER = info.USER; 
                console.log(USER);
                const YearPart = USER[2].substring(2, 4);
                console.log(`학번 : ${YearPart}`);
                $("#mention").text(`${USER[0]}님 환영합니다.`);
                $("#studentInfo").text(`${USER[1]} ${YearPart}학번`); 
                $("#mention").show();
                $("#btn_login").hide();
                $("#btn_register").hide();
                $("#btn_logout").show();
            })
            .fail((xhr, status, error) => console.log(error));
        }
    })
    .fail((xhr, status, error) => console.log(error));
    $("#timetable").on("click", () => {
    });
    
    $("#logout").on("click", () => {
        location.href = '/logout';
    });

    $("#setting").on("click", () => {

    });

    $("#quit").on("click", () => {

    });
});
