const mysql = require('mysql');
const dbConfig = require('../config/database');

const db = mysql.createConnection(dbConfig);

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

const newUser = {
  USER_ID: 'testuser',
  PW: 'testpassword',
  NAME: 'Test User',
  PHONE: '010-1234-5678',
  EMAIL: 'testuser@example.com',
  CLASS: 'Test Class',
  STU_NUM: 12345678,
  NICKNAME: 'TestNick',
  IS_VERIFIED: true,
  PENALTY_POINTS: 0
};

const query = "INSERT INTO `USER` (`USER_ID`, `PW`, `NAME`, `PHONE`, `EMAIL`, `CLASS`, `STU_NUM`, `NICKNAME`, `IS_VERIFIED`, `PENALTY_POINTS`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

db.query(query, [newUser.USER_ID, newUser.PW, newUser.NAME, newUser.PHONE, newUser.EMAIL, newUser.CLASS, newUser.STU_NUM, newUser.NICKNAME, newUser.IS_VERIFIED, newUser.PENALTY_POINTS], (err, result) => {
  if (err) {
    console.error('Error inserting user:', err);
  } else {
    console.log('User inserted successfully:', result);
  }
  db.end();
});
