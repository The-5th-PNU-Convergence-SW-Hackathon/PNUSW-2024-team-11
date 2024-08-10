const mysql = require('mysql');
const dbconfig = require('../../config/database.js');
const fs = require('fs');
const path = require('path'); 
const connection = mysql.createConnection(dbconfig);

connection.connect();

// 게시글 목록을 가져오는 함수
let getPosts = (searchQuery) => {
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
                p.UPDATED_AT as updatedAt 
            FROM PRODUCT p 
            JOIN CATEGORY c ON p.CATEGORY_ID = c.CATEGORY_ID 
            LEFT JOIN PRODUCT_PHOTO pp ON p.PRODUCT_ID = pp.PRODUCT_ID
        `;

        if (searchQuery) {
            sql += ` WHERE p.TITLE LIKE ? OR p.CONTENT LIKE ?`;
        }

        const params = searchQuery ? [`%${searchQuery}%`, `%${searchQuery}%`] : [];

        connection.query(sql, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
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
// let editPost = (postId, postData) => {
//     return new Promise((resolve, reject) => {
//         const { title, category, price, condition, content } = postData;
//         const sql = `
//             UPDATE PRODUCT
//             SET TITLE = ?, CATEGORY_ID = ?, PRICE = ?, PRODUCT_CONDITION = ?, CONTENT = ?, UPDATED_AT = NOW()
//             WHERE PRODUCT_ID = ?
//         `;
//         connection.query(sql, [title, category, price, condition, content, postId], (err, result) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(result);
//             }
//         });
//     });
// };

module.exports = {
    deletePost,
    incrementViewCount,
    getPosts,
    getPostDetails
};
