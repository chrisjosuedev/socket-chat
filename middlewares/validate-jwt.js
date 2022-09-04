const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async (req = request, res = response, next) => {
    const token = req.headers.authorization.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'Unauthorized',
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY);

        // User info
        const user = await User.findById(uid);

        // User doesn't exists
        if (!user) {
            return res.status(401).json({
                ok: false,
                msg: "User doesn't exists",
            });
        }

        // Verify uid.status = true
        if (!user.status) {
            return res.status(401).json({
                ok: false,
                msg: 'Invalid Token',
            });
        }

        req.user = user;

        return next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            ok: false,
            msg: 'Invalid Token',
        });
    }
};

module.exports = {
    validateJWT,
};
