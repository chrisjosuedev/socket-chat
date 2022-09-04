const { Router } = require('express');
const { check, query } = require('express-validator');

const router = Router();

const {
    getUsers,
    putUsers,
    postUsers,
    deleteUsers,
    patchUsers,
} = require('../controllers/users.controller');

const {
    validateFields,
    validateJWT,
    isAdminRole,
    verifyRole,
} = require('../middlewares');

const {
    isValidRole,
    isValidEmail,
    existsId,
} = require('../helpers/db-validators');

// GET -> Get Data
router.get(
    '/',
    [
        query('limit', 'limit has to be a number').isNumeric().optional(),
        query('from', 'from has to be a number').isNumeric().optional(),
        validateFields,
    ],
    getUsers
);

// PUT -> Modify Data
router.put(
    '/:id',
    [
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsId),
        check('role').custom(isValidRole),
        validateFields,
    ],
    putUsers
);

// PATCH -> Partial Changes in Data
router.patch('/', patchUsers);

// POST -> Insert Data
router.post(
    '/',
    [
        check('name', 'name is required').not().isEmpty(),
        check('password', 'password must have at least 6 characters').isLength({
            min: 6,
        }),
        check('email', 'email is invalid or is empty').isEmail(),
        // Or -> email => isValidEmail(email)
        check('email').custom(isValidEmail),
        // Or -> role => isValidRole(role)
        check('role').custom(isValidRole),
        validateFields,
    ],
    postUsers
);

// DELETE -> Delete Data
router.delete(
    '/:id',
    [
        validateJWT,
        // isAdminRole,
        verifyRole('ADMIN_ROLE', 'USER_ROLE'),
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsId),
        validateFields,
    ],
    deleteUsers
);

module.exports = router;
