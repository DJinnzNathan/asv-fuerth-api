const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

let indexRouter = require('./routes/index');
let matchesRouter = require('./routes/matches');
let tablesRouter = require('./routes/tables');
let squadsRouter = require('./routes/squads');
let weatherRouter = require('./routes/weather');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/matches', matchesRouter);
app.use('/table', tablesRouter);
app.use('/squad', squadsRouter);
app.use('/weather', weatherRouter);

module.exports = app;
