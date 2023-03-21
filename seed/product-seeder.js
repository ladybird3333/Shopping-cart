var mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect("mongodb://127.0.0.1/shopping", {useNewUrlParser: true});

var Product = require('../models/product');

var products = [
    new Product({
        imagePath: 'https://www.glamour.pl/media/cache/default_medium/uploads/media/default/0004/77/pilates.jpeg',
        title: 'Karnet Pilates',
        description: 'Karnet obejmuje 10 wejść na zajęcia pilatesu z instruktorem.',
        price: '100'

    }),
    new Product({
        imagePath: 'https://www.ekusheyshop.com/uploads/16281563591303-4.jpg',
        title: 'Karnet Joga',
        description: 'Karnet obejmuje 10 wejść na zajęcia jogi z instruktorem.',
        price: '150'
    }),

    new Product({
        imagePath: 'https://www.si.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cq_auto:good%2Cw_1200/MTkyMzk3NjgyNzUxMzE3NTQz/best-gym-memberships_lead.png',
        title: 'Karnet Siłownia',
        description: 'Karnet obejmuje 15 wejść na siłowię.',
        price: '120'
    }),
];

var temp = 0;
//zapis danych w bazie
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        temp++;
        // uzywam tego warunku, aby zapobiec sytuacji w ktorej rozlacze sie z baza a nie zapisze wszystkiego
        // poniewaz zapisywanie jest asynchroniczne
        if (temp === products.length) {
            exit();
        }

    });
}

function exit() {
    mongoose.disconnect();
}
