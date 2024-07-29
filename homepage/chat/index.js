$(document).ready(() => {
    let arr = [];
    let nickname = [];
    $.ajax({
        url : "/ajax/chatroom", // get login status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done((json) => {
        arr = json.arr;
        nickname = json.nickname;
        const ul = $("#chat_list")
        for(let i = 0; i < arr.length; i++) {
            $(ul).append(`<li><button class="btn btn-dark" id="${i}" onclick="go_chat_room(${i})"> ` + nickname[i] + "과의 대화방</button></li>");
        }
    })
    .fail((xhr, status, error) => console.log(error));

    function go_chat_room(num) {
        $.post('./room', {chatroom: num}, {
            
        })
    }
});