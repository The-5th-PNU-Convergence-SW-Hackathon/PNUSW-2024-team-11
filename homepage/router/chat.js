const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    if(req.session.login_status) {
        res.sendFile('index.html', {root: './chat'});
    }
    else {
        res.send('<script>alert("먼저 로그인 해주세요."); location.href = "/login"</script>');
    }
});
router.post('/room', (req, res) => {
    
});

module.exports = router;