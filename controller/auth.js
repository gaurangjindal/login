const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user-model");
const expressJwt = require('express-jwt');
const crypto = require('crypto');

var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8cfb10720a7a96",
    pass: "6788d815dd877d"
  }
});

exports.signup = (req,res)=>{
  
  const { name, email, password } = req.body;

  const token = jwt.sign(
    { name, email, password },
    process.env.JWT_ACCOUNT_ACTIVATION,
    { expiresIn: "10m" }
  );

  const emailData = {
    to: [
      {
        address: email,
        name: name,
      },
    ],
    from: {
      address: process.env.EMAIL_FROM,
      name: "MERN, AUTH",
    },
    subject: "Account Activation Link",
    html: `
    <div>
    <h1>Account activation link</h1>
    <a href="${process.env.CLIENT_URL}/auth/activate/${token}"  target="_blank">${process.env.CLIENT_URL}/auth/activate/${token}</a>

    <hr />

    <p>Email may contain sensitive information</p>
    <a href="${process.env.CLIENT_URL}" target="_blank">${process.env.CLIENT_URL}</a>
    </div>

    `,
  };

  transport.sendMail(emailData, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: err,
      });
    }

    console.info(info);

    res.json({
      message: `Email has been successfully sent to ${email}`,
    });
  });


  //console.log("req.body",req.body);
  //let user = new User({ name, email, password });

  const user = new User(req.body);
  user.save((err,user)=>{
      if(err){
          return res.status(400).json({
              err
          });
      }
      user.salt = undefined
      user.Hashed_password = undefined
      res.json({
          user
      })
  })



};


exports.activation = (req,res)=>{
  User.findOne({
    activeToken: req.params.activeToken,
    
    // check if the expire time > the current time       activeExpires: {$gt: Date.now()}
}, function (err, user) {
    if (err) return next(err);
    
    // invalid activation code
    if (!user) {
        return res.render('message', {
            title: 'fail to activate',
            content: 'Your activation link is invalid, please <a href="/signup">register</a> again'
        });
    }

    // activate and save
    user.active = true;
    user.save(function (err, user) {
        if (err) return next(err);

        // activation success
        res.render('message', {
            title: 'activation success!',
            content: user.username + 'Please <a href="/signin">login</a>'
        })
    });
});
}




exports.signin = (req,res)=>{
  // find the user based on email
  const {email,password} = req.body
  User.findOne({email},(err,user)=>{
      if(err || !user){
          return res.status(400).json({
              err:'user doesnot exist'
          });
      }
      // if we found user 
      if(!user.authenticate(password)){
          return res.status(401).json({
              err:'email and password does not match'
          })
      }
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
    expiresIn: "7d",
  })
  // persist the token as 't' in cookie with expiry date
  res.cookie('t',token,{expire:new Date() + 9999});
  const {_id, name,email,role} = user;
  return res.json({token,
    user:{
      _id,
      email,
      name,
      role
    },
    message:"signed in successfully",
  });
          
  })
  
}




