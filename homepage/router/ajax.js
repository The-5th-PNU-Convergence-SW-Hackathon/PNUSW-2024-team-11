const express = require("express");
const router = express.Router();
const sql = require("../js/sql_func.js");
const session_route = require('./session.js');

router.use('/session', session_route);

router.get('/', (req, res) => !req.session.login_status ? res.json({}) : res.json({"ret":"ajax page"}));
router.post('/check_id', (req, res) => sql.check_id(req, res));
router.post('/check_nickname', (req, res) => sql.check_nickname(req, res));
router.post('/check_email', (req, res) => sql.check_email(req, res));
router.post('/chatroom', (req, res) => !req.session.login_status ? res.json({}) : sql.get_room_id(req, res));
router.post('/makeroom', (req, res) => {
    if(!req.session.login_status) res.json({});
    else {
        req.session.chat = {room_id: req.body.chatroom, away_nickname: req.body.away_nickname};
        sql.update_room_id(req);
        res.json({});
    }
    
});
router.post('/chat', (req, res) => !req.session.login_status ? res.json({}) : sql.make_room(req, res));
router.post('/notification', (req, res) => !req.session.login_status ? res.json({}) : sql.get_notification(req, res));
router.post('/timetable', (req, res) => !req.session.login_status ? res.json({}) : sql.get_timetable(req, res));
router.post('/matching/recommend', (req, res) => !req.session.login_status ? res.json({}) : sql.recommend(req, res));
router.post('/matching/all', (req, res) => !req.session.login_status ? res.json({}) : sql.matching(req, res))

module.exports = router;