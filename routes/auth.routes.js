const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();

const { login, googleSingIn, updateToken } = require('../controllers/auth.controller');
const { validateFields, validateJWT } = require('../middlewares');

router.post(
    '/login',
    [
        check('email', 'email is required').isEmail(),
        check('password', 'password is required').not().isEmpty(),
        validateFields,
    ],
    login
);

router.post(
    '/google',
    [
        check('id_token', 'google token is required').not().isEmpty(),
        validateFields,
    ],
    googleSingIn
);

router.get('/', validateJWT, updateToken)

module.exports = router;
