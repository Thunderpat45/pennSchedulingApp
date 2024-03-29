const createError = require('http-errors');
const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ejsLayouts = require('express-ejs-layouts')
const user = require('./models/userModel')
const bcrypt = require('bcryptjs');
const debug = require('debug')('http')
const compression = require('compression')
const helmet = require('helmet')
const MongoStore = require('connect-mongo')

debug.enabled = true

const app = express();

app.use(helmet());
app.use(compression());

const logInRouter = require('./routes/logIn');
const baseUserRouter = require('./routes/baseUser');


const dotenv = require('dotenv').config()

const mongoose = require('mongoose');
const mongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.enghe.mongodb.net/SchedulingApp?retryWrites=true&w=majority`;
mongoose.connect(mongoDB, {useNewURLParser:true, useUnifiedTopology: true});
const db = mongoose.connection;
const client = db.getClient()
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


app.set('views', path.join(__dirname, 'views'));
app.set('layout', false)
app.set('view engine', 'ejs');


passport.use(new LocalStrategy(async function(username, password, done){
  try{
    const activeUser = await user.findOne({name: username});
    if(activeUser == null){
      return done(null, false, {message: 'Invalid username/password combination'})
    }else{
      const passwordCheck = await bcrypt.compare(password, activeUser.password)
      if(passwordCheck == false){
        return done(null, false, {message: 'Invalid username/password combination'})
      }else{
        return done(null, activeUser)
      }  
    }
    
  }catch(err){
    debug(err)
    return done(err)
  }
}))

passport.serializeUser(function(user,done){
  done(null, {_id: user._id, privilegeLevel: user.privilegeLevel});
})

passport.deserializeUser(async function(_id, done){
  try{
    const activeUser = await user.findOne({_id: _id});
    if(!activeUser){
      return done(new Error('Invalid user profile'))
    }
    return done(null, activeUser)
  }catch(err){
    debug(err)
    return done(err)
  }
  
})

const expiryDate = new Date(Date.now() + 60*60*1000)
app.use(session({
  resave: false, 
  saveUninitialized: true,
  name: 'sessionId',
  secret: process.env.SESSION_SECRET,
  expires: expiryDate,
  store: MongoStore.create({
    client: client,
    collectionName: 'sessions',
    stringify: false,
    autoRemove: 'interval',
    autoRemoveInterval: 1
  })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(ejsLayouts)


app.use('/', logInRouter);
app.use('/user', baseUserRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  debug(err)
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    layout: "./layouts/errorLayout",
    error: null
  })
});

module.exports = app;
