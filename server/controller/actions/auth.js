const jwt = require('express-jwt');
const User = require('../../database/schema/User/models');

const credential = () => {
    return [
        jwt({
            secret: process.env.JWT_TOKEN_SECRET,
            requestProperty: 'auth',
            credentialsRequired: false,
        }), 
        (err, req, res, next) => {
            res.status(err.status).json({
                auth: false,
                error: err,
            });
        }
    ]
}

const getContext = async (req) => {
    let auth;
    const userId = (req.auth && req.auth.id ) ? req.auth.id : undefined;
    const user = ( userId ) ? await User.findById(userId): undefined;

    if (user) {
        auth = true;
    } else {
        auth = false
    }

    return context = {
        auth,
        user: user,
    }
}

module.exports = { 
    credential,
    getContext
}