'use strict';

var express = require('express');
var routes = require('./routes.js');

var app = express();

app.use(express.static(process.cwd() + '/static/'));

routes(app);

app.listen(process.env.PORT, function() {
    console.log('Node.js listening on port ' + process.env.PORT);
});
