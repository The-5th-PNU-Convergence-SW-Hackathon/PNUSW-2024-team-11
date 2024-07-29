const mysql         = require('mysql2/promise');
const dbconfig      = require('../../config/chat.js');
const userdbconfig  = require('../../config/database.js'); 
const pool          = mysql.createPool(dbconfig);
const user_pool     = mysql.createPool(userdbconfig);
const crypto        = require("../crypto.js");

const get_room_id = async (req, res) => {
    const id = req.session.USER[0];
    let arr = [], opponent = [], nickname = [];
    const connection = await pool.getConnection(async(conn) => conn);
    await connection.query(`SELECT ROOM_ID, USER2 FROM CHAT_ROOM WHERE USER1 = '${id}';`)
        .then(row => {
            for(i of row[0]) {
                arr.push(i["ROOM_ID"]);
                opponent.push(i["USER2"]);
            }
        })
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
    await connection.query(`SELECT ROOM_ID, USER1 FROM CHAT_ROOM WHERE USER2 = '${id}';`)
        .then(row => {
            for(i of row[0]) {
                arr.push(i["ROOM_ID"]);
                opponent.push(i["USER1"]);
            }
        })
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
    connection.release();
    const user_connecion = await user_pool.getConnection(async(conn) => conn);
    for(i of opponent) {
        await user_connecion.query(`SELECT NICKNAME, iv FROM USER WHERE USER_ID = '${i}'`)
        .then(async row => {
            for(j of row[0]) {
                nickname.push(await crypto.decrypt_aes(j["NICKNAME"], crypto.convert_buffer(j['iv'])));
            }
        })
        .catch(error => {
            console.error(error);
            res.redirect('/error');
        });
    }
    user_connecion.release();
    res.json({"arr": arr, "nickname": nickname});
};

module.exports = {get_room_id};