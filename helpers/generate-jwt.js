const jwt = require('jsonwebtoken');
const { User } = require('../models')

// uid => User Identifier

const generateJWT = (uid = '') => {
    return new Promise((resolve, reject) => {
        const payload = { uid };

        jwt.sign(
            payload,
            process.env.SECRET_PRIVATE_KEY,
            {
                expiresIn: '4h',
            },
            (err, token) => {
                if (err) {
                    console.log(err);
                    reject('Token generation failed');
                } else {
                    resolve(token);
                }
            }
        );
    });
};

/** Verify JWT from Sockets */

const checkJWT = async (token) => {

    try {
        if (!token) {
            return null
        }

        const { uid } = jwt.verify(token, process.env.SECRET_PRIVATE_KEY)

        const user = await User.findById(uid)

        if (user && user.status) {
            return user
        } else {
            return null
        }

    } catch (error) {
        return null
    }

}



module.exports = {
    generateJWT,
    checkJWT
};
