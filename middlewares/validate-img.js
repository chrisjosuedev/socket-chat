const { request, response } = require('express');

const validateImg = (req = request, res = response, next) => {

    // req.files.file -> Body Front

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.file) {       
        return res.status(400).json({
            ok: false,
            msg: 'No files were uploaded',
        });
    }
    next()
}

module.exports = {
    validateImg
}