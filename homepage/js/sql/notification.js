const mysql         = require('mysql2/promise');
const dbconfig      = require('../../config/database.js'); 
const pool          = mysql.createPool(dbconfig);
const crypto        = require("../crypto.js");

let get_notification = async (req, res) => {
    let arr = [];
    const id = req.session.USER[0];
    const connection = await pool.getConnection(async(conn) => conn);
    await connection.query(`SELECT * FROM NOTIFICATION WHERE USER_ID = '${id}';`)
        .then(row => {
            for(i of row[0]) {
                arr.push({type: i["TYPE"], detail: i["DETAIL"], time: i["TIME"], read_status: i["READ_STATUS"]});
            }
        })
        .catch(error => {
            console.log(error);
            res.redirect("/error");
        });
    connection.release();
    res.json(arr);
};

module.exports = {get_notification};