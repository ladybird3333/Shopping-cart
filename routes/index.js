var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
const Product = require('../models/product');
var Order = require('../models/order');


router.get('/', function (req, res, next) {
    Product.find(function (err, docs) {
        const items = [];
        const size_row = 3;
        for (let i = 0; i < docs.length; i += size_row) {
            items.push(docs.slice(i, i + size_row)); // biore tylko trzy produkty do jednego wiersza
        }
        res.render('shop/index', {title: 'Shopping cart', products: items});
    }).lean();
});


router.get('/add-to-cart/:id', function (req, res) {
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});


    Product.findById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }
        cart.add(product, product.id); // przekazuje produkt pobrany z bazy do karty
        req.session.cart = cart; // zapisywanie karty w sesji
        console.log(req.session.cart)
        res.redirect('/');
    });
});

router.get('/delete/:id', function (req, res, next){
    const productId = req.params.id;
    const cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

    cart.deleteItem(productId);
    req.session.cart=cart;
    res.redirect('/shopping-cart');
});

router.get('/shopping-cart', function (req, res, next) {

    if (!req.session.cart) {
        return res.render('shop/shopping-cart', {products: null});
    }
    var cart = new Cart(req.session.cart);

    res.render('shop/shopping-cart', {products: cart.generatearray(), totalPrice: cart.totalPrice});
});

router.get('/checkout', isLoggedIn, function (req, res, next) {
    // sprawdzam czy koszyk/karta istnieją
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    var cart = new Cart(req.session.cart);
    res.render('shop/checkout', {total: cart.totalPrice});
});

router.post('/checkout', isLoggedIn, function (req, res, next) {
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    const cart = new Cart(req.session.cart);
    const order = new Order({
        user: req.user,
        cart: cart,
        address: req.body.address,
        name: req.body.name,
    });
    // zapisuje korzyk/ zamówienie do bazy
    order.save(function (err, result) {
        if (err) {
            req.flash('Error occurred!');
        }
        req.session.cart = null;
        res.redirect('/confirmation');
    });
});
router.get('/confirmation', function (req, res, next) {
    res.render('shop/confirmation');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/user/signin');
}

module.exports = router;