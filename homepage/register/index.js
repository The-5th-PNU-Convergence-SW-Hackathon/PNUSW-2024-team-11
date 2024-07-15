$(document).ready(() => {
    let id_oldVal = "";
    let pw_oldVal = "";
    let pw_chk_oldVal = "";
    let name_oldVal = "";
    let phone_front_oldVal = "010";
    let phone_back_oldVal = "";
    let email_oldVal = "";
    let class_oldVal = "";
    let stu_num_oldVal = "";
    let nickname_oldVal = "";
    let chk_arr = {
        "#id": 0,
        "#pw": 0,
        "#pw_chk": 0,
        "#name": 0,
        "#phone_back": 0,
        "#email": 0,
        "#class": 0,
        "#stu_num": 0,
        "#nickname": 0,
    };

    function check_inputs() {
        for(const i of Object.values(chk_arr)) {
            // console.log(i);
            if(!i) return;
        }
        $("#register").attr("disabled", false);
    }

    function correct(id, str) {
        $(id).removeClass('is-invalid');
        $(id).addClass('is-valid');
        $(`label[for = "${id.substring(1)}"]`).text(str);
        chk_arr[id] = 1;
        check_inputs();
    }

    function incorrect(id, str) {
        $(id).removeClass('is-valid');
        $(id).addClass('is-invalid');
        $(`label[for = "${id.substring(1)}"]`).text(str);
        chk_arr[id] = 0;
        $("#register").attr("disabled", true);
    }

    $("#id").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == id_oldVal) return;
        id_oldVal = currentVal;
        if(!check_id(currentVal)) {
            incorrect("#id", "ID는 영어, 숫자로만 입력가능하며 4자리 이상 16자리 이하여야합니다.");
            $("#id_check").attr("disabled", true);
        }
        else {
            incorrect("#id", "ID 중복검사를 해주세요.");
            $("#id_check").attr("disabled", false);
        }
    });

    $("#pw").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == pw_oldVal) return;
        pw_oldVal = currentVal;
        if(pw_chk_oldVal != currentVal) {
            incorrect("#pw_chk", "비밀번호가 일치하지 않습니다.");
        }
        else {
            correct("#pw_chk", "비밀번호가 일치합니다.");
        }
        if(!check_pw(currentVal)) {
            if(check_special(currentVal)) {
                incorrect("#pw", "사용할 수 없는 특수문자가 포함되었습니다.");
            }
            else {
                incorrect("#pw", "비밀번호는 영어, 숫자, 특수문자로만 입력가능하며 8자리 이상 16자리 이하여야합니다.");
            }
        }
        else {
            correct("#pw", "비밀번호가 정상입니다.");
        }
    });

    $("#pw_chk").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == pw_chk_oldVal) return;
        pw_chk_oldVal = currentVal;
        if(pw_oldVal != currentVal) {
            incorrect("#pw_chk", "비밀번호가 일치하지 않습니다.");
        }
        else {
            correct("#pw_chk", "비밀번호가 일치합니다.");
        }
    });

    $("#name").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == name_oldVal) return;
        name_oldVal = currentVal;
        if(!check_name(currentVal)) {
            incorrect("#name", "유효하지 않은 이름입니다.");
        }
        else {
            correct("#name", "유효한 이름입니다");
        }
    });

    $("#phone_front").on("change", function() {
        let currentVal = $(this).val();
        if(currentVal == phone_front_oldVal) return;
        phone_front_oldVal = currentVal;
        if(currentVal == "010") {
            if(!check_phone_010(phone_back_oldVal)) {
                incorrect("#phone_back", "전화번호는 8자리여야 합니다.");
            }
            else {
                correct("#phone_back", "전화번호 입력이 정상입니다.");
            }
        }
        else {
            if(!check_phone(phone_back_oldVal)) {
                incorrect("#phone_back", "전화번호는 7자리여야 합니다.");
            }
            else {
                correct("#phone_back", "전화번호 입력이 정상입니다.");
            }
            
        }
    });

    $("#phone_back").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == phone_back_oldVal) return;
        phone_back_oldVal = currentVal;
        if(phone_front_oldVal == "010") {
            if(!check_phone_010(currentVal)) {
                incorrect("#phone_back", "전화번호는 8자리여야 합니다.");
            }
            else {
                correct("#phone_back", "전화번호 입력이 정상입니다.");
            }
        }
        else {
            if(!check_phone(currentVal)) {
                incorrect("#phone_back", "전화번호는 7자리여야 합니다.");
            }
            else {
                correct("#phone_back", "전화번호 입력이 정상입니다.");
            }
            
        }
    });

    $("#email").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == email_oldVal) return;
        email_oldVal = currentVal;
        if(!check_email(currentVal)) {
            incorrect("#email", "유효하지 않은 이메일입니다.");
        }
        else {
            correct("#email", "유효한 이메일입니다.");
        }
    });

    $("#class").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == class_oldVal) return;
        class_oldVal = currentVal;
        if(!check_class(currentVal)) {
            incorrect("#class", "유효하지 않은 학과입니다.");
        }
        else {
            correct("#class", "유효한 학과입니다.");
        }
    });

    $("#stu_num").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == stu_num_oldVal) return;
        stu_num_oldVal = currentVal;
        if(!check_stu_num(currentVal)) {
            incorrect("#stu_num", "유효하지 않은 학번입니다.");
        }
        else {
            correct("#stu_num", "유효한 학번입니다.");
        }
    });

    $("#nickname").on("propertychange change keyup paste input", function() {
        let currentVal = $(this).val();
        if(currentVal == nickname_oldVal) return;
        nickname_oldVal = currentVal;
        if(!check_nickname(currentVal)) {
            incorrect("#nickname", "유효하지 않은 닉네임입니다.");
            $("#nickname_check").attr("disabled", true);            
        }
        else {
            incorrect("#nickname", "닉네임 중복검사를 해주세요.");
            $("#nickname_check").attr("disabled", false);
        }
    });

    // 다음 버튼 누르면 넘어가기
    let clickCount = 0;
    let status = 0;

    function reset_status() {
        status = 0;
    }

    $("#next-btn").on("click", () => {
        if(status) return;
        status = 1;
        clickCount++;
        if (clickCount == 1) {
            $("#first-page").fadeOut(500, () => {
                $("#second-page").fadeIn(500);
                $("#before-btn").fadeIn(500, reset_status());
            });
            $("#register-txt").text("회원가입 (2/3)");
        } else if (clickCount == 2) {
            $("#second-page").fadeOut(500, () => {
                $("#third-page").fadeIn(500);
                $("#next-btn").fadeOut(500, reset_status());
            });
            $("#register-txt").text("회원가입 (3/3)");
        }
    });
    $("#before-btn").on("click", () => {
        if(status) return;
        status = 1;
        clickCount--;
        console.log(clickCount);
        if (clickCount == 0) {
            $("#second-page").fadeOut(500, () => {
                $("#first-page").fadeIn(500);
                $("#before-btn").fadeOut(500, reset_status());
            });
            $("#register-txt").text("회원가입 (1/3)");
        } else if (clickCount == 1) {
            $("#third-page").fadeOut(500, () => {
                $("#second-page").fadeIn(500);
                $("#next-btn").fadeIn(500, reset_status());
            });
            $("#register-txt").text("회원가입 (2/3)");
        }
    });

    $("#id_check").on("click", () => {
        let value = $("#id").val();
        if(check_id(value)) {
            // console.log('post ajax');
            $.ajax({
                url : "/ajax/check_id",
                type : "POST",
                dataType : "JSON",
                data : {"id" : value}
            })
            .done(json => {
                if(json.status) {
                    incorrect("#id", "이미 존재하는 아이디입니다.");
                }
                else {
                    correct("#id", "사용 가능한 아이디입니다.");
                }
            })
            .fail((xhr, status, error) => console.log(error));
        }
        else {
            alert("ID를 올바르게 입력해주세요.");
        }
    });

    $("#nickname_check").on("click", () => {
        let value = $("#nickname").val();
        $.ajax({
            url : "/ajax/check_nickname",
            type : "POST",
            dataType : "JSON",
            data : {"nickname" : value}
        })
        .done(json => {
            if(json.status) {
                incorrect("#nickname", "이미 존재하는 닉네임입니다.");
            }
            else {
                correct("#nickname", "사용 가능한 닉네임입니다.");
            }
        })
        .fail((xhr, status, error) => console.log(error));
    });

    const departmentData = {
        "인문대학" : ["국어국문학과", "중어중문학과", "일어일문학과", "영어영문학과", "불어불문학과", 
            "독어독문학과", "노어노문학과", "한문학과", "언어정보학과", "사학과", 
            "철학과", "고고학과"],
        "사회과학대학" : ["행정학과", "정치외교학과", "사회복지학과", "사회학과", "심리학과", 
            "문헌정보학과", "미디어커뮤니케이션학과"],
        "자연과학대학" : ["수학과", "통계학과", "물리학과", "화학과", "생명과학과", 
            "미생물학과", "분자생물학과", "지질환경과학과", "해양학과", "대기환경과학과"],
        "공과대학" : ["기계공학부", "고분자공학과", "유기소재시스템공학과", "화공생명·환경공학부", "재료공학부", 
            "전기전자공학부", "건축공학과", "건축학과", "도시공학과", "사회기반시스템공학과", 
            "항공우주공학과", "산업공학과", "조선해양공학과"],
        "사범대학" : ["교육학과", "국어교육과", "영어교육과", "독어교육과", "불어교육과", 
            "유아교육과", "특수교육과", "일반사회교육과", "역사교육과", "지리교육과", 
            "윤리교육과", "수학교육과", "물리교육과", "화학교육과", "생물교육과", 
            "지구과학교육과", "체육교육과"],
        "경제통상대학" : ["무역학부", "경제학부", "국제학부", "관광컨벤션학과", "공공정책학부"],
        "경영대학" : ["경영학과"],
        "약학대학" : ["약학부"],
        "생활과학대학" : ["의류학과", "식품영향학과", "실내환경디자인학과", "아동가족학과", "스포츠과학과"],
        "예술대학" : ["음악학과", "한국음악학과", "미술학과", "조형학과", "디자인학과", 
            "무용학과", "예술문화영상학과"],
        "나노과학기술대학" : ["광메카트로닉스공학과", "나노메카트로닉스공학과", "나노에너지공학과"],
        "생명자원과학대학" : ["식물생명과학과", "원예생명과학과", "동물생명자원과학과", "식품공학과", "생명환경화학과", 
            "바이오소재과학과", "바이오산업기계공학과", "IT응용공학과", "바이오환경에너지학과", "조경학과", 
            "식품자원경제학과"],
        "간호대학" : ["간호학과"],
        "의과대학" : ["의예과", "의학과"],
        "치의학전문대학원" : ["치의학과"],
        "한의학전문대학원" : ["한의학과"],
        "정보의생명공학대학" : ["의생명융합공학부", "정보컴퓨터공학부"]
    }

    $('#collegeSelect').change(function() {
        const selectedCollege = $("#collegeSelect").val();
        console.log(selectedCollege);
        const departmentSelect = $("#departmentSelect");

        departmentSelect.prop('disabled', false);
        departmentSelect.empty();
        $(departmentSelect).append($("<option>", {
            selected: true,
            text: "학과를 선택하세요."
        }));

        $.map(departmentData[selectedCollege], (department) => {
            $(departmentSelect).append($("<option>", {
                value: department,
                text: department
            }));
        })
    });

});
