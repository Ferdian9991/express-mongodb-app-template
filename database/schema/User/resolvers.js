const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const UserModels = require('../../schema/User/models');
const option = require('../../../config/options');

const includeAccessToken = (user) => {
    const payload = {id: user.id, username: user.username};
    let userObject = user.toJSON();
    const token = jwt.sign(payload, process.env.JWT_TOKEN_SECRET);
    userObject['_token'] = token;

    return userObject;
};

class UserController {

    constructor(model) {
        this.model = UserModels;
    }

    async auth (options) {
        try {
            const userModel = this.model.findOne({username: options.username}).exec()
            const user = await userModel;

            if (!user) {
                return null
            }

            if (bcrypt.compareSync(options.password, user.password)) {
                return includeAccessToken(user)
            } else {
                return null
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async findByUsername (options) {
        try {
            const record = this.model.findOne({username: options.username}).exec()
            
            return await record
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async findById (options) {
        try {
            const record = this.model.findOne({_id: options.id}).exec()
            
            return await record
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async register (data) {
        try {   
            const record = new this.model(data);
            const user = await record.save()

            const otp = option.generateOtp();

            user.phoneVerificationOTP = otp;
            const todayDate = new Date();
            todayDate.setDate(todayDate.getDate() + 1);
            user.phoneVerificationExpires = todayDate;

            const message = user.mobileVerificationOTP + " is the OTP for your new account";
            
            user._createdAt = new Date().toISOString();
            user._updatedAt = new Date().toISOString();

            const registerData = await user.save();

            includeAccessToken(registerData);
            
            return await registerData
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async update (id, data) {
        try {
            const record = this.model.findOne({_id: id}).exec();
            const user = await record;
            Object.keys(data).map(field => {
                user[field] = data[field];
            });
            const update = await user.save();

            return update
        } catch (err) {
            return err
        }
    }

    async delete (options) {
        try {
            const record = this.model.findOne({_id: options.id}).exec();
            const user = await record;
            user.delete();
            return user;
        } catch (err) {
            console.log(err)
            return err
        }
    }
}
;

module.exports = new UserController();
