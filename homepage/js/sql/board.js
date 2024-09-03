const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const fs = require('fs');
const path = require('path'); 
const connection = mysql.createConnection(dbconfig);
const mysql2         = require('mysql2/promise');
const timetabledbconfig = require('../../config/timetable');
const timetablepool = mysql2.createPool(timetabledbconfig);
const crypto = require('../crypto');
const {make_table} = require('./chat');

connection.connect();

// 게시글 목록을 가져오는 함수
let getPosts = (searchQuery, userClass) => {
    return new Promise((resolve, reject) => {
        let sql = `
            SELECT 
                p.PRODUCT_ID as productId,
                p.TITLE as title, 
                p.CONTENT as content, 
                p.PRICE as price, 
                c.NAME as category, 
                pp.PHOTO_URL as photos,
                p.PRODUCT_CONDITION as \`condition\`, 
                p.VIEW_COUNT as views, 
                p.STATUS as status,
                p.UPDATED_AT as updatedAt,
                p.LECTURE as lecture, 
                u.CLASS as sellerClass
            FROM PRODUCT p 
            JOIN CATEGORY c ON p.CATEGORY_ID = c.CATEGORY_ID 
            LEFT JOIN PRODUCT_PHOTO pp ON p.PRODUCT_ID = pp.PRODUCT_ID
            JOIN USER u ON p.SELLER_ID = u.USER_ID
        `;

        let params = [];

        // 검색어가 있는 경우 SQL에 WHERE 절 추가 (유사 검색 기능 추가)
        if (searchQuery) {
            // REGEXP를 사용하여 '컴퓨팅 사고와 인공지능' 검색 시 '컴퓨팅사고와인공지능' 등 유사한 패턴도 검색
            sql += ` WHERE 
                        (p.TITLE LIKE ? OR 
                         p.CONTENT LIKE ? OR 
                         p.TITLE REGEXP ? OR 
                         p.CONTENT REGEXP ? OR 
                         p.LECTURE LIKE ? OR 
                         p.LECTURE REGEXP ?)`;
            
            // 검색어를 공백으로 나누지 않고 전체적으로 LIKE 검색
            params.push(`%${searchQuery}%`, `%${searchQuery}%`, 
                        searchQuery.split('').join('.*'), 
                        searchQuery.split('').join('.*'),
                        `%${searchQuery}%`,
                        searchQuery.split('').join('.*'));
        }

        connection.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                // console.log('Query Results:', results); // 쿼리 결과를 출력
                resolve(results);
            }
        });
    });
};





// 게시글 상세 정보를 가져오는 함수
let getPostDetails = (postId) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                p.PRODUCT_ID as productId,
                p.TITLE as title, 
                p.CONTENT as content, 
                p.PRICE as price, 
                c.NAME as category, 
                GROUP_CONCAT(pp.PHOTO_URL) as photos,
                p.PRODUCT_CONDITION as \`condition\`, 
                p.VIEW_COUNT as views, 
                p.STATUS as status,
                p.UPDATED_AT as updatedAt,
                p.SELLER_ID as sellerId
            FROM PRODUCT p 
            JOIN CATEGORY c ON p.CATEGORY_ID = c.CATEGORY_ID 
            LEFT JOIN PRODUCT_PHOTO pp ON p.PRODUCT_ID = pp.PRODUCT_ID
            WHERE p.PRODUCT_ID = ?
            GROUP BY p.PRODUCT_ID
        `;
        connection.query(sql, [postId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results[0]);
            }
        });
    });
};

// 게시글 조회수를 증가시키는 함수
let incrementViewCount = (postId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE PRODUCT SET VIEW_COUNT = VIEW_COUNT + 1 WHERE PRODUCT_ID = ?';
        connection.query(query, [postId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

// 게시글 삭제 함수
let deletePost = (postId) => {
    return new Promise((resolve, reject) => {
        // 먼저 사진 파일 경로를 가져옴
        const getPhotoQuery = 'SELECT PHOTO_URL FROM PRODUCT_PHOTO WHERE PRODUCT_ID = ?';
        connection.query(getPhotoQuery, [postId], (err, photoResults) => {
            if (err) {
                reject(err);
            } else {
                // 각 사진 파일을 /uploads 폴더에서 삭제
                if (photoResults.length > 0) {
                    photoResults.forEach(photo => {
                        const filePath = path.join(__dirname, '..', '..', 'uploads', path.basename(photo.PHOTO_URL));
                        if (fs.existsSync(filePath)) {
                            fs.unlink(filePath, (err) => {
                                if (err) {
                                    console.error(`Error deleting file ${filePath}:`, err);
                                }
                            });
                        }
                    });
                }

                // PRODUCT_PHOTO 테이블에서 해당 사진 데이터 삭제
                const deletePhotoQuery = 'DELETE FROM PRODUCT_PHOTO WHERE PRODUCT_ID = ?';
                connection.query(deletePhotoQuery, [postId], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        // PRODUCT 테이블에서 게시글 데이터 삭제
                        const deletePostQuery = 'DELETE FROM PRODUCT WHERE PRODUCT_ID = ?';
                        connection.query(deletePostQuery, [postId], (err, result) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        });
                    }
                });
            }
        });
    });
};

// 게시글 수정 함수
let editPost = (postId, postData) => {
    return new Promise((resolve, reject) => {
        const { title, category, price, condition, content, status } = postData;
        const sql = `
            UPDATE PRODUCT
            SET TITLE = ?, CATEGORY_ID = ?, PRICE = ?, PRODUCT_CONDITION = ?, CONTENT = ?, STATUS = ?, UPDATED_AT = NOW()
            WHERE PRODUCT_ID = ?
        `;
        connection.query(sql, [title, category, price, condition, content, status, postId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


// 채팅방 함수

let make_chat = (req, res) => make_table(req, res);

// 매칭 함수

let matching = async (req, res) => {
    let arr = {}, away = {}, ret = [], table_num = 0;
    const timetableconnection = await timetablepool.getConnection(async(conn) => conn);
    await timetableconnection.query(`SELECT TABLE_NUM FROM INFO WHERE USER_ID = '${req.session.USER[0]}';`)
    .then(row => {
        table_num = row[0][0]["TABLE_NUM"];
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    await timetableconnection.query(`SELECT USED FROM \`${table_num}\`;`)
    .then(async row => {
        for await (i[0] of row) {
            arr[`${i["USED"]}`] = 1;
        }
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    let away_id = req.session.chat.away_id;
    await timetableconnection.query(`SELECT TABLE_NUM FROM INFO WHERE USER_ID = '${away_id}';`)
    .then(row => {
        table_num = row[0][0]["TABLE_NUM"];
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    await timetableconnection.query(`SELECT USED FROM \`${table_num}\`;`)
    .then(async row => {
        for await (i[0] of row) {
            away[`${i["USED"]}`] = 1;
        }
    })
    .catch(error => {
        console.log(error);
        return res.json(error);
    });
    timetableconnection.release();

    for(let i = 1; i <= 7; i++) {
        for(let j = 1; j <= 12; j++) {
            if(!(arr[`${i}${j}`] || away[`${i}${j}`])){
                ret.push(parseInt(`${i}${j}`));
            }
        }
    }

    res.json(ret);
}

module.exports = {
    deletePost,
    incrementViewCount,
    getPosts,
    getPostDetails,
    editPost,
    make_chat,
    matching
};
