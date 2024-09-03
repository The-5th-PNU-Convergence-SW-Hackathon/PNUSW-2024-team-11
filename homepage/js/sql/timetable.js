const mysql         = require('mysql2/promise');
const dbconfig  = require('../../config/timetable'); 
const pool          = mysql.createPool(dbconfig);

async function get_table_num(req, connection) {
    let table_num = 0;
    await connection.query(`SELECT TABLE_NUM FROM INFO WHERE USER_ID = '${req.session.USER[0]}';`)
    .then(row => {
        table_num = row[0][0]["TABLE_NUM"];
    })
    .catch(error => {
        console.log(error);
        return res.redirect("/error");
    });
    return table_num;
}

async function update_timetable(req, res) {
    const connection = await pool.getConnection(async(conn) => conn);
    let table_num = await get_table_num(req, connection);
    await connection.query(`TRUNCATE TABLE \`${table_num}\``)
    .catch(err => {
        console.log(err);
        return res.redirect('/error');
    })
    for(let i = 1; i <= 7; i++) {
        for(let j = 1; j <= 12; j++) {
            if(req.body[`checkbox${i}-${j}`] !== undefined) {
                await connection.query(`INSERT INTO \`${table_num}\` VALUES (${i}${j})`)
                .catch(err => {
                    console.log(err);
                    return res.redirect('/error');
                })
            }
        }
    }
    connection.release();
    res.redirect('back');
}

async function get_timetable(req, res) {
    const connection = await pool.getConnection(async(conn) => conn);
    let arr = [];
    let table_num = await get_table_num(req, connection);
    await connection.query(`SELECT USED FROM \`${table_num}\`;`)
    .then(async row => {
        for await(i of row[0]) {
            arr.push(i.USED);
        }
    })
    .catch(error => {
        console.log(error);
        return res.redirect("/error");
    });
    connection.release();
    res.json(arr);
}

// 매칭 함수

async function get_timetable_double(req, res) {
    let arr = {}, away = {}, table_num = 0;
    const connection = await pool.getConnection(async(conn) => conn);
    await connection.query(`SELECT TABLE_NUM FROM INFO WHERE USER_ID = '${req.session.USER[0]}';`)
    .then(row => {
        table_num = row[0][0]["TABLE_NUM"];
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    await connection.query(`SELECT USED FROM \`${table_num}\`;`)
    .then(async row => {
        for await (i of row[0]) {
            arr[`${i["USED"]}`] = 1;
        }
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    await connection.query(`SELECT TABLE_NUM FROM INFO WHERE USER_ID = '${req.session.chat.away_id}';`)
    .then(row => {
        table_num = row[0][0]["TABLE_NUM"];
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    await connection.query(`SELECT USED FROM \`${table_num}\`;`)
    .then(async row => {
        for await (i of row[0]) {
            away[`${i["USED"]}`] = 1;
        }
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    connection.release();
    return {'arr': arr, 'away': away};
}

let matching = async (req, res) => {
    let arr = {}, away = {}, ret = [];
    const json = await get_timetable_double(req, res);
    arr = json.arr;
    away = json.away;
    for(let i = 1; i <= 7; i++) {
        for(let j = 1; j <= 12; j++) {
            if(!(arr[`${i}${j}`] || away[`${i}${j}`])){
                ret.push(parseInt(`${i}${j}`));
            }
        }
    }
    res.json(ret);
}

async function recommend(req, res) {
    let arr = {}, away = {}, recommend_arr = [[], [], [], [], [], []], ret = [];
    const json = await get_timetable_double(req, res);
    for(let i = 1; i <= 7; i++) {
        arr[`${i}`] = {};
        away[`${i}`] = {};
        for(let j = 1; j <= 12; j++) {
            arr[`${i}`][`${j}`] = json.arr[`${i}${j}`];
            away[`${i}`][`${j}`] = json.away[`${i}${j}`];
        }
    }
    // 수업이 동시에 끝나는 경우 1순위, 수업이 동시에 시작하는 경우 2순위, 수업이 다 끝난 이후 3순위, 둘 다 수업이 시작하기 전 4순위, 늦은 밤 5순위, 주말 6순위
    
    for(let i = 1; i <= 5; i++) {
        let start = 1, end = 1;
        for(let j = 1; j <= 12; j++) {
            const now = parseInt(`${i}${j}`);
            if(j > 1) {
                // 수업이 동시에 끝나는 경우
                if(arr[`${i}${j - 1}`] && away[`${i}${j - 1}`] && !arr[`${i}${j}`] && !away[`${i}${j}`]) {
                    recommend_arr[0].push(now);
                }
                // 수업이 동시에 시작하는 경우
                if(!arr[`${i}${j - 1}`] && !away[`${i}${j - 1}`] && arr[`${i}${j}`] && away[`${i}${j}`]) {
                    recommend_arr[1].push(now);
                }
            }
            if(arr[`${i}${j}`] || away[`${i}${j}`]) {
                // 둘 다 수업이 끝난 이후 기록
                end = j + 1;
                // 둘 다 수업이 시작하기 전 기록
                start = j - 1;
            }
        }
        // 둘 다 수업이 끝난 이후
        if(end <= 10) {
            for(let j = end; j <= 10; j++) {
                recommend_arr[2].push(parseInt(`${i}${j}`));
            }
        }
        // 늦은 밤
        else if(end > 10) {
            for(let j = end; j <= 12; j++) {
                recommend_arr[4].push(parseInt(`${i}${j}`));
            }
        }
        if(start > 0) {
            if(start <= 10) {
                // 둘 다 수업이 시작하기 전
                for(let j = 1; j <= start; j++) {
                    recommend_arr[3].push(parseInt(`${i}${j}`));
                }
            }
            else {
                // 늦은 밤
                for(let j = 11; j <= start; j++) {
                    recommend_arr[4].push(parseInt(`${i}${j}`));
                }
            }
        }
    }
    // 주말
    for(let i = 6; i <= 7; i++) {
        for(let j = 1; j <= 12; j++) {
            if(!(arr[`${i}${j}`] || away[`${i}${j}`])){
                recommend_arr[5].push(parseInt(`${i}${j}`));
            }
        }
    }
    for(let i = 0; i < 6; i++) {
        if(ret.length == 3) return res.json(ret);
        if(recommend_arr[i].length) {
            const num = Math.floor(Math.random() * recommend_arr[i].length);
            ret.push(recommend_arr[i][num]);
            recommend_arr.splice(num, 1);
        }
    }

    res.json(ret);
}

module.exports = {update_timetable, get_timetable, matching, recommend}