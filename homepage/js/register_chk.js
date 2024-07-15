const check = require('./check.js');
const sql = require('./sql_func.js');

let register = (req, res) => {
    if(!check.check_id(req.body.id)) {
        console.log("id 오류");
        check.make_alert(res, "ID 입력형식이 잘못되었습니다.");
    }
    else if(req.body.pw != req.body.pw_chk) {
        console.log("pw 미일치 오류");
        check.make_alert(res, '비밀번호가 일치하지 않습니다.');  
    }
    else if(!check.check_pw(req.body.pw)) {
        console.log("pw 오류");
        check.make_alert(res, 'PW 입력형식이 잘못되었습니다.');
    }
    else if(check.check_special(req.body.pw)) {
        console.log("pw 특수문자 오류");
        check.make_alert(res, '공백, -;"'+"'\/\\:+=은 사용할 수 없습니다.");
    }
    else if(req.body.phone_front == "010" && !check.check_phone_010(req.body.phone_back) || req.body.phone_front != "010" && !check.check_phone(req.body.phone_back)) {
        console.log("phone 오류");
        console.log(req.body.phone_front, req.body.phone_back);
        check.make_alert(res, '전화번호 양식이 맞지 않습니다.');
    }
    else if(!check.check_email(req.body.email)) {
        console.log("email 오류");
        check.make_alert(res, '이메일 양식이 맞지 않습니다.');
    }
    else if(!check.check_class(req.body.class)) {
        console.log("class 오류");
        check.make_alert(res, '존재하지 않는 학과입니다.');
    }
    else if(!check.check_stu_num(req.body.stu_num)) {
        console.log("stu_num 오류");
        check.make_alert(res, '학번 양식이 맞지 않습니다.');
    }
    else {
        sql.member_insert(req, res);
    }
}

module.exports = {register};