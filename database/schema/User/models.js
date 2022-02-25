const bcrypt = require('bcrypt-nodejs');
const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const UserSchema = new mongoose.Schema({
    _id: {type: String, required: true, default: () => uuid()},
    email: {type: String, default: ''},
    isEmailVerified: Boolean,

    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    phoneNumber: {type: String, default: ''},
    phoneVerificationOTP: String,
    phoneVerificationExpires: Date,
    isMobileVerified: Boolean,

    username: {type: String, unique: true},
    fullname: {type: String, default: ''},
    gender: {type: String, default: ''},
    picture: {type: String, default: ''},

    status: {type: String, default: "active"},

}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true},
    usePushEach: true, 
    collection: 'Users'
});

/**
 * Hash password before save
 */

UserSchema.pre('save', function (next) {
    const user = this;
    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

UserSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', UserSchema);


module.exports = User;