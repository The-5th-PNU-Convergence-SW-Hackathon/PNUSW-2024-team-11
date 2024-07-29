$(document).ready(() => {
    let id_oldVal = "";
    let pw_oldVal = "";
    let pw_chk_oldVal = "";
    let name_oldVal = "";
    let phone_front_oldVal = "010";
    let phone_back_oldVal = "";
    let email_oldVal = "";
    let stu_num_oldVal = "";
    let nickname_oldVal = "";
    let chk_arr = {
        "#id": 0,
        "#pw": 0,
        "#pw_chk": 0,
        "#name": 0,
        "#phone_back": 0,
        "#email": 0,
        "#departmentSelect": 0,
        "#stu_num": 0,
        "#nickname": 0,
    };

    function check_inputs() {
        for(const i of Object.values(chk_arr)) {
            // console.log(i);
            if(!i) {
                $("#register").attr("disabled", true);
                return;
            }
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
            $("#email_check").attr("disabled", true);
        }
        else {
            incorrect("#email", "이메일 중복검사를 해주세요.");
            $("#email_check").attr("disabled", false);
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
            $("#first-page").fadeOut(200, () => {
                $("#second-page").fadeIn(200);
                $("#before-btn").fadeIn(200, reset_status());
            });
            $("#register-txt").text("회원가입 (2/3)");
        } else if (clickCount == 2) {
            $("#second-page").fadeOut(200, () => {
                $("#third-page").fadeIn(200);
                $("#next-btn").fadeOut(200, reset_status());
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
            $("#second-page").fadeOut(200, () => {
                $("#first-page").fadeIn(200);
                $("#before-btn").fadeOut(200, reset_status());
            });
            $("#register-txt").text("회원가입 (1/3)");
        } else if (clickCount == 1) {
            $("#third-page").fadeOut(200, () => {
                $("#second-page").fadeIn(200);
                $("#next-btn").fadeIn(200, reset_status());
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

    $("#email_check").on("click", () => {
        let value = $("#email").val();
        $.ajax({
            url : "/ajax/check_email",
            type : "POST",
            dataType : "JSON",
            data : {"email" : value}
        })
        .done(json => {
            if(json.status) {
                incorrect("#email", "이미 존재하는 이메일입니다.");
            }
            else {
                correct("#email", "사용 가능한 이메일입니다.");
            }
        })
        .fail((xhr, status, error) => console.log(error));
    });
    
    let deptData ;
    fetch('../json/deptData.json')
    .then(response => response.json())
    .then(data => {
        deptData = data;
    })
    .catch(error => console.error('Error loading JSON data:', error));

    $('#collegeSelect').change(function() {
        const collegeSelect = $(this).val();
        const deptSelect = $("#departmentSelect");
        deptSelect.empty();
            $(deptSelect).append($("<option>", {
                selected: true,
                text: "학과를 선택하세요."
            }));
        if(collegeSelect == "단과대학을 선택하세요.") {
            deptSelect.prop('disabled', true);
        }
        else {
            deptSelect.prop('disabled', false);

            $.map(deptData[collegeSelect], (dept) => {
                $(deptSelect).append($("<option>", {
                    value: dept,
                    text: dept
                }));
            })
        }
        // console.log(collegeSelect);
        
    });

    $('#departmentSelect').change(function() {
        const collator = new Intl.Collator('ko');
        const result = collator.compare($(this).val(), '학과를 선택하세요.');
        // console.log($(this).val(), result == 0);
        if(result === 0) chk_arr['#departmentSelect'] = 0;
        else chk_arr['#departmentSelect'] = 1;
        check_inputs();
    });
});
