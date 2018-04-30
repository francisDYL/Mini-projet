var express = require('express');
var app     = express();
var path    = require("path");
var bodyParser = require('body-parser');
var session = require('express-session');
var cons = require('consolidate');


app.use( session({secret : 's3Cur3',resave: false,saveUninitialized: false, cookie: {
            path: "/",
            httpOnly: true,
            cookieName: 'session'
        }}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// set static directories
app.use(express.static(path.join(__dirname, 'static')));

// Load View Engine

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

app.get('/', function (req, res) {
    res.render('index');
});
app.get('/main.html', function (req, res) {
    res.render('main');
});
app.get('/dashboard.html', function (req, res) {
    res.render('dashboard');
});

//connexion de l'utilisateur
app.post('/login',function(req,res){
    if(req.body.email == "parcit@parcit.com" && req.body.psw == "parcit"){
        req.session.user={name:"Parcituser",email:"parcit@parcit.com",psw:"parcit"};
        res.send({success:true,user:req.session.user});
        
    }else{
        res.send({success:false});
    }
    
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

//détruir la session de l'utilisateur
app.post('/deconnexion',function(req,res){
    req.session.destroy();
	req.session=null;
	res.clearCookie();
	res.redirect('/');
});

var port = process.env.PORT || 3000;
app.listen(port);
console.log('Listening on port ',  port);