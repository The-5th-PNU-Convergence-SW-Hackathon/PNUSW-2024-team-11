const not_word = /[^a-zA-Z0-9]/;
const special = /[-;'"\/\\:+= ]/;
const name_t = /[^a-zA-Z가-힣]/;
const stu_num = /\d{9}/;
const phone_010 = /\d{8}/;
const phone = /\d{7}/;
const email = /[a-zA-Z0-9_]+@[a-z]+\.[a-z]+/;
const password = /[a-zA-Z]+[0-9]+[`~!@#$%^&*():<>,\.?\{\}\[\]|_]+/;

//정규식

const slang_arr = JSON.parse(JSON.stringify(slang));

let length_check = (str, a, b) => a <= str.length && str.length <= b;
let check_word = str => !not_word.test(str);
let check_special = str => special.test(str);
let check_id = str => check_word(str) && str.length >= 4;
let check_pw = str => !check_special(str) && length_check(str, 8, 16) && password.test(str);
let check_name = str => !name_t.test(str) && length_check(str, 2, 30);
let check_phone_010 = str => phone_010.test(str) && str.length == 8;
let check_phone = str => phone.test(str) && str.length == 7;
let check_email = str => email.test(str);
let check_class = str => true;
let check_stu_num = str => stu_num.test(str);
let check_nickname = str => {
    for(const i of slang_arr) {
        if(i == str) return false;
    }
    return true;
};
let make_alert = (res, str) => {
    res.write("<script>alert("+ str + ");</script>");
    res.redirect("back");
}