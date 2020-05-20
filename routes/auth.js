const express= require('express');
const router = express.Router();

const {signup,signin,activation} =require('../controller/auth');
const {userSignupValidator} = require('../validator/auth');


router.post('/signup',userSignupValidator,signup);
router.post('/signin',signin);
router.get('/auth/activate/:activetoken',activation);




module.exports = router;