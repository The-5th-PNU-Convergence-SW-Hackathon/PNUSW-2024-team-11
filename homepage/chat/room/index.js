$(document).ready(() => {
    let last_date = "";
    let away_online = false;
    let away_nickname = "";
    let timetable_chk = false;
    let reportCnt = 0;

    function scrollToBottom() {
        let chatList = $('#chatlist')[0];
        chatList.scrollTop = chatList.scrollHeight;
    }

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
            away_nickname = nickname;
            $('#away_nickname').text(nickname);
            $('#report-info').text(`${away_nickname}의 신고 건수는 ${reportCnt}건 입니다.`);
        })
        .fail((xhr, status, error) => console.error(error));
        for(i of json) {
            const date = new Date(i.time);
            const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
            const date_str = (date.getMonth() + 1) + "월 " + date.getDate() + "일";
            if(last_date === "" || last_date != date_str) {
                $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
                last_date = date_str;
            }
            $('#chatlist').append(`<div class="msgLine ${i.sender ? 'my_line' : 'away_line'}"><div class="msgBox ${i.sender ? 'my_chat' : 'away_chat'}">${i.chat}<div class="time">${time_str}</div>${i.sender ? ("<div class='read_status'>" + (i.read ? "읽음" : "읽지 않음") + "</div>") : ""}</div></div>`);
        }
        // 페이지 로드 시 최하단으로 스크롤 이동
        scrollToBottom();
    })
    .fail((xhr, status, error) => console.error(error));

    const socket = io();

    socket.emit('chatroom', '');
    // away online
    socket.on('status', data => {
        away_online = data == 2;
        $('#online').text(away_online ? '온라인' : '오프라인');
        $('#online').css('color', away_online ? 'green' : 'black');
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
        const date_str = (date.getMonth() + 1) + "월 " + date.getDate() + "일";
        if(last_date === "" || last_date != date_str) {
            $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
            last_date = date_str;
        }
        msgBox.append(`<div class="time">${time_str}</div>`);
        msgLine.append(msgBox);
        $('#chatlist').append(msgLine);
        // 메시지 수신 시 최하단으로 스크롤 이동
        scrollToBottom();
	});

	// sending a message
    function send() {
        var msgLine = $('<div class="msgLine my_line">');
        var msgBox = $('<div class="msgBox my_chat">');
        msgBox.append($("#chat").val());
        const date = new Date();
        const time_str = ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2);
        const date_str = (date.getMonth() + 1) + "월 " + date.getDate() + "일";
        if(last_date === "" || last_date != date_str) {
            $('#chatlist').append(`<div><hr class="date_hr" style="float: left;"><p style="display: inline-block;">${date_str}</p><hr class="date_hr" style="float: right;"></div>`)
            last_date = date_str;
        }
        msgBox.append(`<div class="time">${time_str}</div>`);
        msgBox.append(`<div class='read_status'>${(away_online ? "읽음" : "읽지 않음")}</div>`);
        msgLine.append(msgBox);
        $('#chatlist').append(msgLine);
        socket.emit('msg', $("#chat").val());
        $.post('/chat/send', {'chat': $('#chat').val(), 'away_online': away_online});
        $("#chat").val("");
        // 메시지 전송 시 최하단으로 스크롤 이동
        scrollToBottom();
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
    

    // $("#report").on('click', () => {
    //     if(away_nickname) {
    //         reportCnt+=1;
    //         $('#report-info').text(`${away_nickname}의 신고 건수는 ${reportCnt}건 입니다.`);
    //         alert(`${away_nickname}을(를) 신고하시겠습니까?`);
    //     } else {
    //         alert('상대방 닉네임을 가져오는 중 오류가 발생했습니다.');
    //     }
    // });

    // 신고 버튼 클릭 시 모달 열기
    $("#report").on("click", () => {
        $("#reportModal").show();
    });

    // 모달 닫기 버튼 기능
    $(".close-button").on("click", () => {
        $("#reportModal").hide();
    });

    // 신고 제출 버튼 클릭 시 신고 처리
    $("#reportForm").on("submit", (event) => {
        event.preventDefault(); // 기본 제출 동작 방지
        reportCnt += 1;
        $("#report-info").text(`${away_nickname}의 신고 건수는 ${reportCnt}건 입니다.`);
        alert("신고가 접수되었습니다.");
        $("#reportModal").hide(); // 모달 닫기
    });

    // 모달 외부 클릭 시 모달 닫기
    $(window).on("click", (event) => {
        if ($(event.target).is("#reportModal")) {
            $("#reportModal").hide();
        }
    });

    let day = ['월', '화', '수', '목', '금', '토', '일'];
    let time = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
        , '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];

    $("#timetable").on('click', () => {
        if(timetable_chk) {

        }
        else {
            $.ajax({
                url : "/ajax/matching/recommend",
                type : 'POST', 
                dataType: 'JSON',
                data: {}
            })
            .done(json => {
                // console.log(json);
                for(let i = 0; i < 3; i++) {
                    if (json[i] < 100) {
                        jsonDay = day[Math.floor(json[i]/10) - 1];
                        jsonTime = time[(json[i]%10) - 1];
                    }
                    else {
                        jsonDay = day[Math.floor(json[i]/100) - 1];
                        jsonTime = time[(json[i]%100) - 1];
                    }
                    json[i] = jsonDay + " " + jsonTime;

                    $("#recommend" + i).text(json[i]);
                    $("#recommend" + i).show();
                }
            })
            .fail(err => console.error(err));
            timetable_chk = true;
        }
    })

});