const {member_insert, check_id, check_nickname, check_email} = require('./sql/register');
const {login} = require('./sql/login');
const {post_insert} = require('./sql/post');
const {get_room_id, make_room, update_room_id} = require('./sql/chat');
const { getPosts } = require('./sql/board');
const {post_checklist, get_checklist} = require('./sql/checklist');
const {get_roommate} = require('./sql/matching');
const {get_notification} = require('./sql/notification.js');


module.exports =    {member_insert, login, check_id, check_nickname, post_insert,
                    check_email, get_room_id, getPosts, make_room, update_room_id,
                    post_checklist, get_checklist, get_roommate, get_notification};