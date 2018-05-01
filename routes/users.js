const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/login', function(req, res, next) {
    console.log('logiiiiin 1');
    req.session.UsrType = req.body.type;
    passport.authenticate('local', function(err, user, info) {
        console.log('logiiiiin');
        console.log(req.body.type);
      if (err) { return  res.send({success:false});}
      if (!user) { return res.send({success:false}); }
      req.logIn(user, function(err) {
        if (err) { return next(err); }
          req.session.user={name:"Parcituser",email:"parcit@parcit.com",psw:"parcit"};
          res.send({success:true,user:req.session.user});
        
      });
    })(req, res, next);
  });


/*

router.post('/login', passport.authenticate('local', {
      failureRedirect: '/',
      failureFlash: true
    }), (req, res, next) => {
        req.session.UsrType = req.body.usertype;
        console.log(req.session.UsrType)
        switch(req.body.usertype){
            case 'citizen':
                req.session.user={name:"Parcituser",email:"parcit@parcit.com",psw:"parcit"};
                res.send({success:true,user:req.session.user});
            break;
            case 'serviceprovider':
                req.session.user={name:"Parcituser",email:"parcit@parcit.com",psw:"parcit"};
                res.send({success:true,user:req.session.user});
            break;
            case 'admin':
               
            break;
        }
     
});

*/
module.exports = router;