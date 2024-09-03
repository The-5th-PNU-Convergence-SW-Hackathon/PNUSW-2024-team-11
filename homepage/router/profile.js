const express = require("express");
const router = express.Router();
const timetable_sql = require('../js/sql/timetable')

router.get('/', (req, res) => req.session.login_status ? res.sendFile('profile.html', {root: './home/profile'}) : res.redirect('/login'));
router.get('/timetable', (req, res) => req.session.login_status ? res.sendFile('timetable.html', {root: './home/profile/timetable'}) : res.redirect('/login'));
router.get('/faq', (req, res) => req.session.login_status ? res.sendFile('faq.html', {root: './home/profile/faq'}) : res.redirect('/login'));
router.post('/timetable/update', (req, res) => timetable_sql.update_timetable(req, res));

module.exports = router;