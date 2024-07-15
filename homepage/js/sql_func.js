const mysql       = require('mysql');
const dbconfig    = require('../config/database.js');
const connection  = mysql.createConnection(dbconfig);
const crypto = require("./crypto.js")

let member_insert = async (req, res) => {
    let body = req.body;
    let id = await crypto.create_crypto(body.id);
    let pw = await crypto.create_crypto(body.pw);
    let name = await crypto.create_aes(body.name);
    let phone = await crypto.create_aes(body.phone_front + body.phone_back);
    let email = await crypto.create_aes(body.email);
    let Class = await crypto.create_aes(body.class);
    let stu_num = await crypto.create_aes(body.stu_num);
    let nickname = await crypto.create_aes(body.nickname);

    connection.query(`INSERT INTO login_info VALUE ('${id}', '${pw}', '${name}', '${phone}', '${email}', '${Class}', '${stu_num}', '${nickname}');`, (error) => {
        if (error) {
            console.log(error);
            req.session.register_status = false;
            res.redirect("/register/status");
        }
        else {
            console.log("register success");
            req.session.register_status = true;
            res.redirect("/register/status");
        }
    });
}
  
let login = async (req, res) => {
    let body = req.body;
    let id = await crypto.create_crypto(body.studentID);
    let pw = await crypto.create_crypto(body.password);
    connection.query(`SELECT PW, NICKNAME FROM login_info WHERE ID = '${id}'`, async (error, row) => {
        if (error) {
            console.log(error);
            res.redirect("/error");
        }
        else if (pw != row[0]["PW"]) {
            console.log("login fail");
            req.session.login_status = false;
            res.redirect("/login/status");
        }
        else {
            console.log("login success");
            req.session.login_status = true;
            req.session.login_info = [id, await crypto.decrypt_aes(row[0]["NICKNAME"])];
            res.redirect("/login/status");
        }
    });
}

let check_id = async (req, res) => {
    let body = req.body;
    let id = await crypto.create_crypto(body.id);
    let str = `EXISTS (SELECT ID FROM login_info WHERE ID = '${id}')`
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
    let nickname = await crypto.create_aes(body.nickname);
    let str = `EXISTS (SELECT NICKNAME FROM login_info WHERE NICKNAME = '${nickname}')`
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

module.exports = {member_insert, login, check_id, check_nickname};