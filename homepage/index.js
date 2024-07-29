const express           = require('express');
const config            = require('./js/config.js');
const default_route     = require('./router/index.js');

const app = express();

// configuration =========================
config(app, __dirname);

app.set('port', process.env.PORT || 3000); // site is open the n port

app.use('/', default_route);

app.listen(app.get('port'), () => console.log('Express server listening on port ' + app.get('port')));