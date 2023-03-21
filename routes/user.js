var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Order = require('../models/order');
const Cart = require("../models/cart");

var csrfProtection = csrf();
router.use(csrfProtection); // wszystkie żadania beda chronione przez csrf


router.get('/profile', isLoggedIn, function (req, res, next) {
    // wyszukuje po id klienta zalogowanego zamowienia w bazie danych
    Order.find({user: req.user}, function (err, orders) {
        if (err) {
            return res.write('Error occured!');
        }
        let cart;
// pobieram wszystkie zamowienia i dla kazdego z nich tworze nową kartę
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generatearray();
            order.totalPrice = order.cart.totalPrice;
        });
        res.render('user/profile', {orders: orders});
    });
});


router.get('/logout', isLoggedIn, function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.use('/', isnotLoggedIn, function (req, res, next) {
    next();
});


router.get('/signup', function (req, res, next) {
    const messages = req.flash('error');
    console.log("csruf: " + req.csrfToken());
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    successRedirect: '/user/profile',
    failureRedirect: '/user/signup',
    failureFlash: true
}));

router.get('/signin', function (req, res, next) {
    const messages = req.flash('error');
    console.log("csruf: " + req.csrfToken());
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signin', passport.authenticate('local.signin', {
        successRedirect: '/user/profile',
        failureRedirect: '/user/signin',
        failureFlash: true
    }));

module.exports = router;

function isLoggedIn(req, res, next) {
    // sprawdzenie czy żądanie jest uwierzytelnione- czyli poprawnie sie zalogowalem
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function isnotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}