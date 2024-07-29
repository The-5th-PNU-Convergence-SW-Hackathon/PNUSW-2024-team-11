const register_route    = require('./register');
const login_route       = require('./login');
const ajax_route        = require('./ajax');
const post_route        = require('./post');
const profile_route     = require('./profile');
const verify_route      = require('./verify_email');
const test_route        = require('./test');
const chat_route        = require('./chat');

const config = router => {
    router.use('/register', register_route); // routers
    router.use('/login', login_route);
    router.use('/ajax', ajax_route);
    router.use('/post', post_route);
    router.use('/profile', profile_route);
    router.use('/verify_email', verify_route);
    router.use('/test', test_route);
    router.use('/chat', chat_route);
}

module.exports = config;