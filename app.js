var express = require('express');
var path = require('path');
// var cookieParser = require('cookie-parser');
require('colors');
var logger = require('morgan');
require('dotenv').config()
var indexRouter = require('./routes/index');
const mongoose = require('mongoose')
const passport = require('passport');
const userRoutes = require('./routes/userRoutes.js');
const BasicInfoRoutes = require('./routes/BasicInfo.js');
const connectDB = require('./config/db.js');
const formData = require('express-form-data');
const morgan = require('morgan');
var app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
});
  app.use(passport.initialize())
  require('./security/passport')(passport)
  connectDB();

  app.use(formData.parse());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



// connect to db =
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to db"))
.catch(err=>console.log(err))
app.use('/api', indexRouter);
app.use('/api/users', userRoutes);
app.use('/api/basicInfo', BasicInfoRoutes);


module.exports = app;