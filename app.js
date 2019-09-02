require('./config/config');
require('./db/mongoose');

const cron = require("node-cron");

const express = require('express');
const cors = require('cors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');


const index = require('./routes/index');
const user = require('./routes/user');
const articles = require('./routes/articles');
const app_api = require('./routes/app_api');
const admin_actiona = require('./routes/admin_actions');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload());

app.use('/', index);
app.use('/user', user);
app.use('/articles', articles);
app.use('/app', app_api);
app.use('/admin', admin_actiona);

app.use(function(req, res, next) {
  if (process.env.NODE_ENV === 'development') {
      const err = new Error('Not Found');
      err.status = 404;
      next(err);
  } else {
    return res.status(404).json({
        message: 'Route not Exist'
    });
  }
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
