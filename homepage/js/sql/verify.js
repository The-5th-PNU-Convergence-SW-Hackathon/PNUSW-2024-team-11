const mysql       = require('mysql');
const dbconfig    = require('../../config/database.js');
const connection  = mysql.createConnection(dbconfig);

const set_expires = (req, id, email, token, expires) => {
    connection.query(`INSERT INTO VERIFY VALUES ('${id}', '${email}', '${token}', '${expires}');`, (error) => {
        if (error) {
            console.log(error);
            req.session.send_verify = false;
        }
        else {
            console.log("send verify success");
            req.session.send_verify = true;
        }
    });
}

const check_verify = (email, token) =>  new Promise (res => {
    connection.query(`SELECT ID, EXPIRES, TOKEN FROM VERIFY WHERE EMAIL = '${email}';`, (error, row) => {
        if(error) {
            console.log(error);
        }
        else if(row.length == 0) {
            console.log("no email exist");
            res(0);
        }
        else if(new Date(row[0]["EXPIRES"]) < new Date()) {
            console.log("link is expire");
            res(-1);
        }
        else if(token != row[0]["TOKEN"]) {
            console.log("token is invalid");
            res(-2);
        }
        else {
            // console.log("verify success");
            connection.query(`UPDATE USER SET IS_VERIFIED=1 WHERE USER_ID = '${row[0]['ID']}';`, error => {
                if(error) {
                    console.log(error);
                    res(2);
                }
                else {
                    // console.log('update complate');
                    connection.query(`DELETE FROM VERIFY WHERE EMAIL = '${email}';`, error => {
                        if(error) {
                            console.log(error);
                            res(3);
                        }
                    });
                    res(1);
                }
            });
        }
    })
});

module.exports = {set_expires, check_verify};