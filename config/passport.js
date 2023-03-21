var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;

// przechowywanie użytkownika w sesji
passport.serializeUser(function (user, done) {
    done(null, user.id)
});

// pobieranie id uzytkownika z sesji
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// strategia lokalna w przypadku tworzenia nowego uzytkownika
passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    //sprawdzam poprawnosc hasla za pomoca express-validator
    req.checkBody('password', 'Błędne hasło!').notEmpty().isLength({min: 4});
    const errors = req.validationErrors();
    if (errors) {
        // tablica komunikatów o błędach
        const messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    //znajduje uzytkownika po adresie email
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            return done(err);
        }
        // probuje stworzyc uzytkownika ktory istnieje, albo jego email istnieje
        if (user) {
            return done(null, false, {message: 'Podany email jest już zajęty!'})
        }

        var newUser = new User();
        newUser.email = email;
        // zapisuje zahaszowane haslo
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function (err, result) {
            if (err) {
                return done(err);
            }
            return done(null, newUser);
        });
    });
}));

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req, email, password, done) {
    req.checkBody('password', 'Błędne hasło!').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        const messages = [];
        errors.forEach(function (error) {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }
    User.findOne({'email': email}, function (err, user) {
        if (err) {
            // wystapil blad
            return done(err);
        }
        // probuje stworzyc uzytkownika ktory istnieje (podany e-mail jest w bazie)
        if (!user) {
            return done(null, false, {message: 'Nie znaleziono użytkownika'})
        }
        if (!user.validPassword(password)) {
            return done(null, false, {message: 'Błędne hasło!'})
        }
        return done(null, user);

    });
}))