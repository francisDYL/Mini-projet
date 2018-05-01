var express = require('express');
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
const flash = require('connect-flash');
var session = require('express-session');
const expressValidator = require('express-validator');
var cons = require('consolidate');
const mongoose = require('mongoose');
const passport = require('passport');
const crypto=require('crypto');

const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', function(){
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function(err){
  console.log(err);
});

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  }));

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// set static directories
app.use(express.static(path.join(__dirname, 'static')));

// Load View Engine
// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());





app.get('/', function (req, res) {
    res.render('index');
});
app.get('/main.html', function (req, res) {
    res.render('main');
});
app.get('/dashboard.html', function (req, res) {
    res.render('dashboard');
});

//renvoie vrai si la session de l'utlisateur existe déjà et faux sinon
app.post('/issession',function(req,res){
    if(req.session.user){
        res.send({session:true,user:req.session.user});
    }
    else{
        res.send({session:false});
    }
});

/*app.post('/login', function(req, res, next) {
    console.log('logiiiiin 1');
    passport.authenticate('local', function(err, user, info) {
        console.log('logiiiiin');
      if (err) { return  res.send({success:false});}
      if (!user) { return res.send({success:false}); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
          req.session.user={name:"Parcituser",email:"parcit@parcit.com",psw:"parcit"};
          return res.send({success:true,user:req.session.user});
        
      });
    })(req, res, next);
  });
*/
//détruir la session de l'utilisateur
app.post('/deconnexion',function(req,res){
    req.session.destroy();
	req.session=null;
	res.clearCookie();
	res.redirect('/');
});

let users = require('./routes/users');
app.use('/users', users);


var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ',  port);