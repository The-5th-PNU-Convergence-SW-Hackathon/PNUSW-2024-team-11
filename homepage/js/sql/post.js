const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // 파일 시스템 모듈 추가

// Define the absolute path for the upload directory
const uploadDir = path.resolve(__dirname, '../../uploads');

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer 설정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the absolute path
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const allowedExts = ['.jpg', '.jpeg', '.png'];
        if (allowedExts.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Unsupported file type'), false);
        }
    }
});

// MySQL 연결 설정
const dbconfig = require('../../config/database.js');
const connection = mysql.createConnection(dbconfig);
connection.connect();

let post_insert = async (req, res) => {
    upload.array('photos')(req, res, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("<script>alert('파일 업로드 실패'); location.href='/board/index.html'; </script>");
        }

        const { title, content, price, category, underline, notes, condition, lecture } = req.body;
        const photos = req.files; // 파일 배열
        const sellerId = req.session.USER ? req.session.USER[0] : null;

        if (!sellerId) {
            return res.status(400).send("<script>alert('로그인 정보가 없습니다'); location.href='/board/index.html'; </script>");
        }

        console.log(req.body);
        console.log(req.files);

        const contentValue = content || null;
        const underlineValue = (underline === 'no') ? 0 : 1;
        const notesValue = (notes === 'no') ? 0 : 1;

        // SQL 쿼리 작성
        const sql = 'INSERT INTO PRODUCT (SELLER_ID, TITLE, CONTENT, PRICE, CATEGORY_ID, UNDERLINE, NOTES, PRODUCT_CONDITION, LECTURE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        connection.query(sql, [sellerId, title, contentValue, price, category, underlineValue, notesValue, condition, lecture], (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).send("<script>alert('상품 등록 실패'); location.href='/board/index.html'; </script>");
            }
            const productId = result.insertId;
            console.log("상품 등록 완료");

            if (photos.length > 0) {
                let photoSql = 'INSERT INTO PRODUCT_PHOTO (PRODUCT_ID, PHOTO_URL) VALUES ?';
                let photoValues = photos.map(photo => {
                    const ext = path.extname(photo.originalname).toLowerCase();
                    const newFileName = `${productId}-${Date.now()}${ext}`;  // 새로운 파일 이름
                    const newPath = path.join(uploadDir, newFileName); // Use the absolute path
                    fs.renameSync(photo.path, newPath); // 파일 이름 변경
                    return [productId, `/uploads/${newFileName}`];
                });

                connection.query(photoSql, [photoValues], (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("<script>alert('사진 등록 실패'); location.href='/board/index.html'; </script>");
                    }
                    console.log("사진 등록 완료");
                    res.send("<script>alert('상품 등록 완료'); location.href='/board'; </script>");
                });
            } else {
                res.send("<script>alert('상품 등록 완료'); location.href='/board'; </script>");
            }
        });
    });
};

module.exports = { post_insert };
