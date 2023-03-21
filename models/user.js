var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// pakiet do haszownaia hasla
var bcrypt= require('bcrypt-nodejs');
var userSchema=new Schema({
    email:{type: String, required:true},
    password:{type:String, required: true}
});

userSchema.methods.encryptPassword = function (password){
    // zwraca zaszyfrowane haslo
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

userSchema.methods.validPassword=function (password){
    // sprawdzam czy haslo pasuje do zahaszowanego hasla
    return bcrypt.compareSync(password, this.password);
};

module.exports=mongoose.model('User', userSchema);
