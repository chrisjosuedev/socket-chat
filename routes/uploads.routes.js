const { Router } = require('express');
const { check } = require('express-validator');

const router = Router();

const {
    uploadFiles,
    updateFile,
    showImg
} = require('../controllers/uploads.controller');

const { allowedCollections } = require('../helpers');
const { validateFields, validateJWT, validateImg } = require('../middlewares');

// Images
router.get('/:collection/:id', [
    validateJWT,
    check('id', 'is is not valid').isMongoId(),
    check('collection').custom((c) =>
        allowedCollections(c, ['users', 'products'])
    ),
    validateFields,
], showImg);

// Upload an image
router.post('/', [validateJWT, validateImg], uploadFiles);

// Update Collection Photo
router.put(
    '/:collection/:id',
    [
        validateJWT,
        check('id', 'is is not valid').isMongoId(),
        check('collection').custom((c) =>
            allowedCollections(c, ['users', 'products'])
        ),
        validateImg,
        validateFields,
    ],
    updateFile
);

module.exports = router;
