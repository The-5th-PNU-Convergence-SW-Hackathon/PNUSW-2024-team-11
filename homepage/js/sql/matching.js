const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();

let get_roommate = async (req, res) => {
    try {
        const query = `
            SELECT USER_ID, GENDER, SMOKING, DRINKING_FREQUENCY, SLEEP_PATTERN, SLEEP_HABIT, GUEST_VISIT
            FROM ROOMMATE_CHECKLIST;
        `;

        connection.query(query, (err, results) => {
            if (err) {
                console.error('데이터 조회 중 오류 발생:', err);
                res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
                return;
            }

            // 데이터가 성공적으로 조회된 경우 클라이언트에 전달
            res.status(200).json(results);
        });
    } catch (error) {
        console.error("get_roommate 함수 실행 중 오류 발생:", error);
        res.status(500).send("get_roommate 함수 실행 중 오류가 발생했습니다.");
    }
};


module.exports = { get_roommate };