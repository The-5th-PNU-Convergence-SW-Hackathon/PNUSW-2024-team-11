$(document).ready(() => {
    $.ajax({
        url : "/ajax/notification", // get login status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        console.log(json);
        for(i of json) {
            const date = new Date(i.time);
            const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
            const date_str = date.getFullYear() + "년 " + date.getMonth() + "월 " + date.getDate() + "일\n";
            $('#notification_list').append(`<div class="msgLine"><div class="msgBox">${make_notification(i.type, i.detail)}<div class="time">${date_str + time_str}</div>${i.sender ? ("<div class='read_status'>" + (i.read_status ? "읽음" : "읽지 않음") + "</div>") : ""}</div></div>`);
        }
    })
    .fail((xhr, status, error) => console.log(error))
});

function make_notification(n, msg) {
    switch(n) {
        case 1:
            return "";
        case 2:
            return ""; 
        case 3:
            return ""; 
        default:
            return msg + "님에게서 채팅이 왔습니다.";
    }
}