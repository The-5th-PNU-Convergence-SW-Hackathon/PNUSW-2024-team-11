const {member_insert, check_id, check_nickname, check_email} = require('./sql/register');
const {login} = require('./sql/login');
const {post_insert} = require('./sql/post');
const {get_room_id} = require('./sql/chat');

module.exports = {member_insert, login, check_id, check_nickname, post_insert, check_email, get_room_id};