$(document).ready(() => {
    let last_date = "";
    let away_online = false;
    $.ajax({
        url : "/ajax/chat",
        type : 'POST', 
        dataType: 'JSON',
        data: {}
    })
    .done(json => {
        $.ajax({
            url : '/ajax/session/chat/away_nickname',
            type : 'post',
            dataType : 'JSON',
            data : {}
        })
        .done(({nickname}) => {
            console.log(nickname);
            $('#away_nickname').text(nickname);
        })
        .fail((xhr, status, error) => console.error(error));
        for(i of json) {
            const date = new Date(i.time);
            // console.log(date);
            const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
            const date_str = date.getMonth() + "월 " + date.getDate() + "일";
            if(last_date === "" || last_date != date_str) {
                $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
                last_date = date_str;
            }
            $('#chatlist').append(`<div class="msgLine ${i.sender ? 'my_line' : 'away_line'}"><div class="msgBox ${i.sender ? 'my_chat' : 'away_chat'}">${i.chat}<div class="time">${time_str}</div>${i.sender ? ("<div class='read_status'>" + (i.read ? "읽음" : "읽지 않음") + "</div>") : ""}</div></div>`);
        }
    })
    .fail((xhr, status, error) => console.error(error));

    const socket = io();

    // away online
    socket.on('status', data => {
        away_online = data == 2;
        $('#online').text(away_online ? 'away_online' : 'away_offline');
        if(away_online) {
            $('.read_status').each((index, item) => { if($(item).text() == '읽지 않음') $(item).text('읽음') });
        }
    });

	// receiving a message
	socket.on('msg', function (data) {
		var msgLine = $('<div class="msgLine away_line">');
		var msgBox = $('<div class="msgBox away_chat">');
		msgBox.append(data);
        const date = new Date();
        const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
        const date_str = date.getMonth() + "월 " + date.getDate() + "일";
        if(last_date === "" || last_date != date_str) {
            $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
            last_date = date_str;
        }
        msgBox.append(`<div class="time">${time_str}</div>`);
        // msgBox.css('display', 'inline-block');
        msgLine.append(msgBox);
        $('#chatlist').append(msgLine);
	  	// auto scorll down when a user send something
		chat.scrollTop = chat.scrollHeight;
	});

	// sending a message
    function send() {
        var msgLine = $('<div class="msgLine my_line">');
        var msgBox = $('<div class="msgBox my_chat">');
        msgBox.append($("#chat").val());
        const date = new Date();
        const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
        const date_str = date.getMonth() + "월 " + date.getDate() + "일";
        if(last_date === "" || last_date != date_str) {
            $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
            last_date = date_str;
        }
        msgBox.append(`<div class="time">${time_str}</div>`);
        msgBox.append(`<div class='read_status'>${(away_online ? "읽음" : "읽지 않음")}</div>`);
        // msgBox.css('display', 'inline-block');
        // msgLine.css('text-align', 'right');
        msgLine.append(msgBox);
        $('#chatlist').append(msgLine);
        socket.emit('msg', $("#chat").val());
        $.post('/chat/send', {'chat': $('#chat').val(), 'away_online': away_online});
        $("#chat").val("");
        chat.scrollTop = chat.scrollHeight;
    }

	$("#chat").on("keyup", function () {
		if (window.event.keyCode == 13 && $(this).val() != "") {
			send();
        }
	});

    $("#send").on('click', () => {
        if($("#chat").val() != "") {
            send();
        }
    });
});