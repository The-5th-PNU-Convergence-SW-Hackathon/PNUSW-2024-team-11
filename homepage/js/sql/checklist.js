const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();

let post_checklist = async (req, res) => {
    let body = req.body;

    try {
        let user_id = req.session.USER[0];
        let gender = body.gender; // 1 = 남, 2 = 여
        let smoking = body.smoking; // 0 = 비흡연, 1 = 흡연
        let drinking_frequency = body.drinking_frequency; // 주1회미만, 주23회, 주4회이상
        let sleep_pattern = body.sleep_pattern; // 아침형, 저녁형
        let sleep_habit = body.sleep_habit; // 없음, 이갈이, 잠꼬대, 코골이
        let guest_visit = body.guest_visit; // 0 = 불가능, 1 = 상관X, 2 = 사전허락

        // Query to check if a checklist entry exists for the given USER_ID
        const checkQuery = `
            SELECT CHECKLIST_ID
            FROM ROOMMATE_CHECKLIST
            WHERE USER_ID = ?;
        `;

        connection.query(checkQuery, [user_id], (err, results) => {
            if (err) {
                console.error('데이터 조회 중 오류 발생:', err);
                res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
                return;
            }

            if (results.length > 0) {
                // If a record exists, update it
                const checklist_id = results[0].CHECKLIST_ID;

                const updateQuery = `
                    UPDATE ROOMMATE_CHECKLIST
                    SET GENDER = ?, SMOKING = ?, DRINKING_FREQUENCY = ?, SLEEP_PATTERN = ?, SLEEP_HABIT = ?, GUEST_VISIT = ?
                    WHERE CHECKLIST_ID = ?;
                `;

                connection.query(updateQuery, [gender, smoking, drinking_frequency, sleep_pattern, sleep_habit, guest_visit, checklist_id], (err) => {
                    if (err) {
                        console.error('데이터 업데이트 중 오류 발생:', err);
                        res.status(500).send("데이터 업데이트 중 오류가 발생했습니다.");
                        return;
                    }

                    // Successfully updated
                    res.status(200).send("Checklist가 성공적으로 업데이트되었습니다.");
                });
            } else {
                // If no record exists, insert a new one
                const insertQuery = `
                    INSERT INTO ROOMMATE_CHECKLIST (USER_ID, GENDER, SMOKING, DRINKING_FREQUENCY, SLEEP_PATTERN, SLEEP_HABIT, GUEST_VISIT)
                    VALUES (?, ?, ?, ?, ?, ?, ?);
                `;

                connection.query(insertQuery, [user_id, gender, smoking, drinking_frequency, sleep_pattern, sleep_habit, guest_visit], (err) => {
                    if (err) {
                        console.error('데이터 삽입 중 오류 발생:', err);
                        res.status(500).send("데이터 삽입 중 오류가 발생했습니다.");
                        return;
                    }

                    // Successfully inserted
                    res.status(200).send("Checklist가 성공적으로 저장되었습니다.");
                });
            }
        });
    } catch (error) {
        console.error("post_checklist 함수 실행 중 오류 발생:", error);
        res.status(500).send("post_checklist 함수 실행 중 오류가 발생했습니다.");
    }
}

let get_checklist = async (req, res) => {
    try {
        let user_id = req.session.USER[0];

        const selectQuery = `
            SELECT GENDER, SMOKING, DRINKING_FREQUENCY, SLEEP_PATTERN, SLEEP_HABIT, GUEST_VISIT
            FROM ROOMMATE_CHECKLIST
            WHERE USER_ID = ?;
        `;

        connection.query(selectQuery, [user_id], (err, results) => {
            if (err) {
                console.error('데이터 조회 중 오류 발생:', err);
                res.status(500).send("데이터 조회 중 오류가 발생했습니다.");
                return;
            }

            if (results.length > 0) {
                res.status(200).json(results[0]);
            } else {
                res.status(200).json(null);
            }
        });
    } catch (error) {
        console.error("get_checklist 함수 실행 중 오류 발생:", error);
        res.status(500).send("get_checklist 함수 실행 중 오류가 발생했습니다.");
    }
}


module.exports = { post_checklist, get_checklist };