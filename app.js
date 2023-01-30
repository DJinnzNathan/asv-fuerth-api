var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var matchesRouter = require('./routes/matches');
var tablesRouter = require('./routes/tables');
var weatherRouter = require('./routes/weather');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/matches', matchesRouter);
app.use('/table', tablesRouter);
app.use('/weather', weatherRouter);

module.exports = app;
