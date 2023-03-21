const createError = require('http-errors');
const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
const csrf = require('csurf');
var bodyParser = require('body-parser');
const logger = require('morgan');
const expressHbs = require('express-handlebars');

const mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
const validator = require('express-validator');

// do przechowywyania sesji
const MongoStore = require('connect-mongo')(session);

const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');


const app = express();


mongoose.set('strictQuery', false);
// zdefiniowane url bazy z ktora chce sie polaczyc
mongoose.connect("mongodb://127.0.0.1/shopping");

require('./config/passport');
const {router} = require("express/lib/application");

// zawsze bedzie wyszukiwalo szablonow  w layout
app.engine('.hbs', expressHbs.engine({defaultLayout: 'layout', extname: '.hbs'}))
//okreslam biblioteke szablonow
app.set('view engine', '.hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.urlencoded({extended: false}));
app.use(validator());
app.use(cookieParser());


// inicjalizacja sesji
app.use(session({
    secret: 'secret',
    resave: false, // nie zapisuje sesji, jeśli nie została zmodyfikowana
    saveUninitialized: false, //nie tworze sesji dopóki coś nie zostanie zapisane
    // inicjalizuje magazyn dla sesji, podaje klucz połączenia
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    }),
    // ustawiam maksymalny wiek życia sesji w milisekundach
    cookie: {maxAge: 180 * 60 * 1000}
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(path.join(__dirname, 'public')));


app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session; // bo chce miec dostep do sesji w widokach
    next();
});

app.use('/user', userRouter);
app.use('/', indexRouter);


app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {

    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
