$(document).ready(() => {
    let arr = [];
    let nickname = [];
    $.ajax({
        url : "/ajax/chatroom", // get login status
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        arr = json.arr;
        nickname = json.nickname;
        const ul = $("#chat_list");
        for(let i = 0; i < arr.length; i++) {
            ul.append(`<li><button class="btn btn-dark btn-dark-color" id="${i}"> ` + nickname[i] + "님과의 대화방</button></li>");
        }
    })
    .fail((xhr, status, error) => console.log(error));

    $(document).on('click', 'button', btn => {
        let id = btn.target.id;
        $.ajax({
            url: '/ajax/makeroom',
            type: 'POST',
            dataType: 'JSON',
            data: {chatroom: arr[id], away_nickname: nickname[id]}
        })
        .done(json => location.href = './room')
        .fail((xhr, status, error) => console.error(error));
    });
});