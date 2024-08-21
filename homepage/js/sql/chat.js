const mysql         = require('mysql2/promise');
const dbconfig      = require('../../config/chat.js');
const userdbconfig  = require('../../config/database.js'); 
const sessionconfig = require('../../config/sessiondb')
const pool          = mysql.createPool(dbconfig);
const user_pool     = mysql.createPool(userdbconfig);
const crypto        = require("../crypto.js");
const node_crypto   = require('crypto');

let copy_room_id;

const find_room_id = async (req, res) => {
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
        await user_connecion.query(`SELECT NICKNAME, iv FROM USER WHERE USER_ID = '${i}';`)
        .then(async row => {
            for(j of row[0]) {
                nickname.push(await crypto.decrypt_aes(j["NICKNAME"], await crypto.convert_buffer(j['iv'])));
            }
        })
        .catch(error => {
            console.error(error);
            res.redirect('/error');
        });
    }
    user_connecion.release();
    // console.log(arr, nickname);
    return [arr, nickname];
}

const get_room_id = async (req, res) => {
    if(req.session.USER === undefined) {
        res.redirect('/error');
        return;
    }
    if(req.session.chat !== undefined) delete req.session.chat;
    copy_room_id = null;
    let [arr, nickname] = await find_room_id(req, res);
    res.json({"arr": arr, "nickname": nickname});
};

let check_id = async (req, res) => {
    const room_id = req.session.chat.room_id;
    const id = req.session.USER[0];
    const connection = await pool.getConnection(async(conn) => conn);
    let ret;
    await connection.query(`SELECT USER1, USER2 FROM CHAT_ROOM WHERE ROOM_ID = '${room_id}';`)
    .then(row => {
        row = row[0][0];
        if(id == row['USER1']){
            if(req.session.chat.away_id === undefined) req.session.chat['away_id'] = row['USER2'];
            ret = 1;
        }
        else if(id == row['USER2']) {
            if(req.session.chat.away_id === undefined) req.session.chat['away_id'] = row['USER1'];
            ret = 1;
        }
        else {
            ret = 0;
        }
    })
    .catch(error => {
        console.error(error);
        ret = 0;
    });
    connection.release();
    return ret;
};

let check_room = (req, res) => {
    if(req.session.USER === undefined) {
        res.redirect('/error');
        return;
    }
    if(check_id(req, res)) res.sendFile('index.html', {root: './chat/room'});
    else res.redirect('/login');
}

let make_room = async (req, res) => {
    if(await check_id(req, res) == 0) res.redirect('/login');
    let chat = [];
    const room_id = req.session.chat.room_id;
    const id = req.session.USER[0];
    let away_iv_str = "";
    const iv = await crypto.convert_buffer(req.session.iv);
    const user_connecion = await user_pool.getConnection(async(conn) => conn);
    await user_connecion.query(`SELECT iv FROM USER WHERE USER_ID = '${req.session.chat.away_id}';`)
    .then(row => away_iv_str = row[0][0]['iv'])
    .catch(err => console.error(err));
    user_connecion.release();
    const away_iv = await crypto.convert_buffer(away_iv_str);
    // console.log(away_iv, iv);
    const connection = await pool.getConnection(async(conn) => conn);
    await connection.query(`SELECT * FROM ${room_id} ORDER BY SEND_TIME;`)
        .then(async row => {
            for await(i of row[0]) {
                if(i['ID'] == id) {
                    const decipher = await crypto.decrypt_aes(i['CHAT'], iv);
                    chat.push({'chat': decipher, 'time': i['SEND_TIME'], 'sender': 1, 'read': i['READ_STATUS']});
                }
                else {
                    const decipher = await crypto.decrypt_aes(i['CHAT'], away_iv);
                    chat.push({'chat': decipher, 'time': i['SEND_TIME'], 'sender': 0});
                    if(i['READ_STATUS'] == 0) {
                        connection.query(`UPDATE ${room_id} SET READ_STATUS=1 WHERE hash='${i['hash']}';`)
                        .catch(err => console.log(err));
                    }
                }
            }
        })
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
    connection.release();
    res.json(chat);
};

let send_chat = async (req, res) => {
    const room_id = req.session.chat.room_id;
    if(req.session.USER === undefined) {
        res.redirect('/error');
        return;
    }
    const id = req.session.USER[0];
    if(!check_room(req, res)) res.redirect('/error');
    const away_online = req.body.away_online;
    const connection = await pool.getConnection(async(conn) => conn);
    await connection.query(`INSERT INTO \`${room_id}\` VALUES ('${await crypto.create_aes(req.body.chat, await crypto.convert_buffer(req.session.iv))}', '${id}', ${away_online}, now(), '${node_crypto.randomBytes(32).toString('hex')}');`)
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
    connection.release();
    if(!JSON.parse(away_online)) {
        const userconnection = await user_pool.getConnection(async(conn) => conn);
        await userconnection.query(`INSERT INTO NOTIFICATION VALUES ('${id}', 0, '${req.session.chat.away_nickname}', now(), ${away_online});`)
            .catch(error => {
                console.log(error)
                res.redirect("/error");
            });
        userconnection.release();
    }
    res.json({});
};

let update_room_id = num => {
    copy_room_id = num;
}

let ret_room_id = () => copy_room_id;

let make_table = async (req, res) => {
    let [arr, nickname] = await find_room_id(req, res);
    console.log(arr, nickname, arr.length);
    if(arr.length != 0) {
        req.session.chat = {};
        req.session.chat.room_id = arr[0];
    }
    else {
        const room_id = node_crypto.randomBytes(20).toString('hex');
        req.session.chat.room_id = room_id;
        const connection = await pool.getConnection(async(conn) => conn);
        await connection.query(`CREATE TABLE ${room_id} (
        CHAT TEXT NOT NULL,
        ID VARCHAR(255) NOT NULL,
        READ_STATUS TINYINT(1) NOT NULL,
        SEND_TIME DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        hash VARCHAR(255) NOT NULL,
        CONSTRAINT PRIMARY KEY(hash)
        );`)
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
        await connection.query(`INSERT INTO CHAT_ROOM VALUES ('${room_id}', '${req.session.USER[0]}', '${req.session.chat.away_id}')`)
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
        connection.release();
    }
    res.json({url: '/chat/room'});
}

module.exports = {get_room_id, make_room, check_room, send_chat, update_room_id, ret_room_id, make_table};