const { Router } = require('express');
const { check, query } = require('express-validator');

const router = Router();

const {
    postProduct,
    getProducts,
    getProduct,
    putProduct,
    deleteProduct,
} = require('../controllers/products.controller');

const {
    isValidProduct,
    existsCategoryId,
    existsProductId,
} = require('../helpers');

const { isAdminRole, validateFields, validateJWT } = require('../middlewares');

// Public
router.get(
    '/',
    [
        query('limit', 'limit has to be a number').isNumeric().optional(),
        query('from', 'from has to be a number').isNumeric().optional(),
        validateFields,
    ],
    getProducts
);

// Public
router.get(
    '/:id',
    [
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsProductId),
        validateFields,
    ],
    getProduct
);

// Create a new Product (Private -> Any User Registered)
router.post(
    '/',
    [
        validateJWT,
        check('name', 'name is required').not().isEmpty(),
        check('description', 'description is required').not().isEmpty(),
        check('category', 'category is required').not().isEmpty(),
        check('category', 'invalid category id').isMongoId(),
        check('category').custom(existsCategoryId),
        check('name').custom(isValidProduct),
        validateFields,
    ],
    postProduct
);

// Update a Product (Private -> Any User Registered)
router.put(
    '/:id',
    [
        validateJWT,
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsProductId),
        check('category', 'invalid category id').isMongoId(),
        check('category').custom(existsCategoryId),
        check('name').custom(isValidProduct),
        validateFields,
    ],
    putProduct
);

// Delete a Product (ADMIN_USER only)
router.delete(
    '/:id',
    [
        validateJWT,
        isAdminRole,
        check('id', 'invalid id').isMongoId(),
        check('id').custom(existsProductId),
        validateFields,
    ],
    deleteProduct
);

module.exports = router;
