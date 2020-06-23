var express = require('express');
var route = require('./app');
const asst = require('./config/chatBot');
var cookieParser = require('cookie-parser');
const flash = require('req-flash');
var app = express();

const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const key = require('./config/keys').MongoUri;
const signupDB = require('./DB/SignupDb');

const dialogFlow = require('dialogflow');
const admin = require('./routes/admin');
const cors = require('cors');
const paymentRoute = require('./routes/paymentroute');
require('./config/passport-fun')(passport);
require('./config/google-auth')(passport);




app.set('port', process.env.PORT || 8080);
app.set('view engine', 'ejs');

//app.use(compress); //This line will compress all the static file before sending to the server
app.use('/assets', express.static('assets'));
app.use('/public', express.static('public'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

///passport.use(signupDB.createStrategy());
//passport.serializeUser(signupDB.serializeUser());
//passport.deserializeUser(signupDB.deserializeUser());


mongoose.connect(key, {
    useNewUrlParser: true,
    useUnifiedTopology: true
},(err) =>{
    if(err) throw err;
    console.log('Your are connected to mongoose database');
});

mongoose.set("useCreateIndex", true);



app.use(flash());



app.use(cors());
app.options('*', cors());
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


app.use(route);
app.use(admin);
app.use(paymentRoute);
app.listen(app.get('port'), function () {
    console.log('Server has started at ', app.get('port'));
});

