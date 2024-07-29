const nodemailer = require('nodemailer');
const email_auth = require('../config/email');
const crypto     = require('crypto');
const sql_verify = require('./sql/verify');

const generate_verify_token = () => crypto.randomBytes(20).toString('hex');

const verify = (req, verify_info) => {
  const expires = new Date();
  expires.setHours(expires.getHours() + 2);
  const str_expires = expires.getFullYear() + "-" + ('0' + (expires.getMonth() + 1)).slice(-2) + "-" + ('0' + expires.getDate()).slice(-2) + " " + ('0' + expires.getHours()).slice(-2) + ":" + ('0' + expires.getMinutes()).slice(-2) + ":" + ('0' + expires.getSeconds()).slice(-2);
  // verify_email(req, req.session.verify_info[0], generate_verify_token(), str_expires, req.session.verify_info[1], req.session.verify_info[2]);
  verify_email(req, verify_info[0], generate_verify_token(), str_expires, verify_info[1], verify_info[2]);
};

const verify_email = async (req, email, token, expires, id, email_aes) => {
  const transporter = nodemailer.createTransport({
    host: 'p-bud.duckdns.org', // 사용할 이메일 서비스의 호스트 주소
    port: 587,
    auth: email_auth,
    tls: {
      rejectUnauthorized: false
    }
  });
  
  const mailOptions = {
    from: 'cert@p-bud.duckdns.org', // 작성자
    to: email, // 수신자
    subject: 'P-BUD 사용자 인증', // 메일 제목
    html: `<p>해당 링크를 눌러 이메일 주소를 인증해주세요.</p>
    <p><a href = 'https://test.p-bud.duckdns.org/verify_email?email=${email_aes}&token=${token}'>이메일 인증</a></p>
    <p>이 링크는 ${expires} 까지 유효합니다.</p>` // 메일 내용
  };
  
  await transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
      sql_verify.set_expires(req, id, email_aes, token, expires);
    }
  })
};

module.exports = {verify};