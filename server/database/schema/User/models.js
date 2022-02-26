const Builder = require('../../middleware/schema')

const UserSchema = Builder.schema({
    email: {type: String, default: ''},
    isEmailVerified: Boolean,

    password: String,
    passwordResetToken: String,
    passwordResetExpires: Date,

    phoneVerificationOTP: String,
    phoneVerificationExpires: Date,
    isMobileVerified: Boolean,

    _createdAt: {type: String, default: ''},
    _updatedAt: {type: String, default: ''},
    _deletedAt: {type: String, default: ''},

    address: {type: String, default: ''},
    username: {type: String, unique: true},
    fullname: {type: String, default: ''},
    phoneNumber: {type: String, default: ''},
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
    Builder.bcrypt().genSalt(10, function (err, salt) {
        if (err) {
            return next(err);
        }
        Builder.bcrypt().hash(user.password, salt, null, function (err, hash) {
            if (err) {
                return next(err);
            }
            user.password = hash;
            next();
        });
    });
});

Builder.paginate(UserSchema)

const User = Builder.model('User', UserSchema);

module.exports = User;