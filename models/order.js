var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
var Schema = mongoose.Schema;

const schema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, required: true},
    address: {type: String, required: true},
    name: {type: String, required: true},
});
module.exports = mongoose.model('Order', schema);