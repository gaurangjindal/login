const express = require('express')
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const CookieParser = require('cookie-parser');
const expressvalidator = require('express-validator');

// import routes
const authRoutes = require('./routes/auth')


// our app
const app = express();

//db connection
// mongodb+srv://blog:blog@ecommerce-2igd7.mongodb.net/test?retryWrites=true&w=majority
// mongodb://localhost:27017/ecommerce
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser :true,
    useCreateIndex:true,
    useUnifiedTopology: true
}).then(()=> console.log('Db connected'));

// middleware
app.use(morgan('dev'));
app.use(bodyparser.json())
app.use(CookieParser())
app.use(expressvalidator());


//routes middleware
app.use("/api",authRoutes)


// here '/' tell us that we are getting to home page of the applicstion or can say default for home page is '/'
// routes
app.get('/',(req,res)=>{
    res.send('Your backend is working fine...');
});


const port = process.env.PORT || 8090
// we use {} bracket to display varibale , hence here variable is port having value 8000

app.listen(port,()=>{
    console.log(`server started at ${port} `);
})



