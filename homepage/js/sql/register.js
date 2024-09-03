const mysql       = require('mysql');
const dbconfig    = require('../../config/database.js');
const timetabledbconfig = require('../../config/timetable.js');
const connection  = mysql.createConnection(dbconfig);
const timetableconnection = mysql.createConnection(timetabledbconfig);
const crypto = require("../crypto.js");
const { verify } = require('../verify.js');

let member_insert = async (req, res) => {
    let body = req.body;
    let iv = crypto.create_iv();
    req.session.iv = iv;
    // console.log(iv);
    let id = await crypto.create_crypto(body.id);
    let id_aes = await crypto.create_aes(body.id, iv);
    let pw = await crypto.create_crypto(body.pw);
    let name = await crypto.create_aes(body.name, iv);
    let phone = await crypto.create_aes(body.phone_front + body.phone_back, iv);
    let phone_sha = await crypto.create_crypto(body.phone_front + body.phone_back);
    let email = await crypto.create_aes(body.email, iv);
    let email_sha = await crypto.create_crypto(body.email);
    let Class = await crypto.create_aes(body.class, iv);
    let stu_num = await crypto.create_aes(body.stu_num, iv);
    let nickname = await crypto.create_aes(body.nickname, iv);
    let nickname_sha = await crypto.create_crypto(body.nickname);
    let iv_str = iv.toString("hex");

    timetableconnection.query(`SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'p-bud_timetable';`, (error, row) => {
        // console.log(row, "#############");
        if(error) {
            console.log(error, "@@@@@@");
            return res.redirect('/error');
        }
        timetableconnection.query(`INSERT INTO INFO VALUES ('${id}', ${row[0]['COUNT(*)']})`, (error) => {
            if(error) {
                console.log(error, "$$$$$$$$$$$");
                return res.redirect('/error');
            }
        });
        timetableconnection.query(`CREATE TABLE \`${row[0]['COUNT(*)']}\`(\`USED\` INT NOT NULL ) ENGINE = InnoDB;`, (error) => {
            if(error) {
                console.log(error, "!!!!!!!!!!!!!");
                return res.redirect('/error');
            }
        });
    });

    connection.query(`INSERT INTO USER VALUES ('${id}', '${id_aes}', '${pw}', '${name}', '${phone}', '${phone_sha}', '${email}', '${email_sha}', '${Class}', '${stu_num}', '${nickname}', '${nickname_sha}', '${iv_str}', now(), now(), 0, 0);`, (error) => {
        if (error) {
            console.log(error);
            req.session.register_status = false;
            return res.redirect("/register/status");
        }
        else {
            // console.log("register success");
            req.session.register_status = true;
            // req.session.verify_info = [id, body.email, email];
            verify(req, [body.email, id, email]);
            return res.redirect("/register/status");
        }
    });
}

let check_id = async (req, res) => {
    let body = req.body;
    let id = await crypto.create_crypto(body.id);
    let str = `EXISTS (SELECT USER_ID FROM USER WHERE USER_ID = '${id}')`
    connection.query(`SELECT ${str};`, (error, row) => {
        if (error) {
            console.log(error);
            res.redirect("/error");
        }
        else if (row[0][str]) {
            res.json({"status": true});
        }
        else {
            res.json({"status": false});
        }
    });
}

let check_nickname = async (req, res) => {
    let body = req.body;
    let nickname_sha = await crypto.create_crypto(body.nickname);
    let str = `EXISTS (SELECT NICKNAME FROM USER WHERE NICKNAME_SHA = '${nickname_sha}')`;
    connection.query(`SELECT ${str};`, (error, row) => {
        if (error) {
            console.log(error);
            res.redirect("/error");
        }
        else if (row[0][str]) {
            res.json({"status": true});
        }
        else {
            res.json({"status": false});
        }
    });
}

let check_email = async (req, res) => {
    let body = req.body;
    let email_sha = await crypto.create_crypto(body.email);
    let str = `EXISTS (SELECT EMAIL FROM USER WHERE EMAIL_SHA = '${email_sha}')`;
    connection.query(`SELECT ${str};`, (error, row) => {
        if (error) {
            console.log(error);
            res.redirect("/error");
        }
        else if (row[0][str]) {
            res.json({"status": true});
        }
        else {
            res.json({"status": false});
        }
    });
}

module.exports = {member_insert, check_id, check_nickname, check_email};