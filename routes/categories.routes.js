const { Router } = require('express');
const { check, query } = require('express-validator');

const {
    postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory,
} = require('../controllers/categories.controller');

const { existsCategoryId, isValidName } = require('../helpers')

const { validateJWT, validateFields, isAdminRole } = require('../middlewares');

const router = Router();

// Public
router.get(
    '/',
    [
        query('limit', 'limit has to be a number').isNumeric().optional(),
        query('from', 'from has to be a number').isNumeric().optional(),
        validateFields,
    ],
    getCategories
);

// Public
router.get(
    '/:id',
    [
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsCategoryId),
        validateFields,
    ],
    getCategory
);

// Create a new Categorie (Private -> Any User registered)
router.post(
    '/',
    [
        validateJWT,
        check('name', 'name is required').not().isEmpty(),
        check('name').custom(isValidName),
        validateFields,
    ],
    postCategory
);

// Update a Category (Private -> Any User registered)
router.put(
    '/:id',
    [
        validateJWT,
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsCategoryId),
        check('name').custom(isValidName),
        validateFields,
    ],
    putCategory
);

// Delete a Category (ADMIN_USER only)
router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsCategoryId),
        validateFields,
    ],
    deleteCategory
);

module.exports = router;
