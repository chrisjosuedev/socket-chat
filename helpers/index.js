const dbValidators = require('./db-validators')
const generateJWT = require('./generate-jwt')
const googleValidate = require('./google-validate')
const uploadFile = require('./upload-file')

module.exports = {
    ...dbValidators,
    ...generateJWT,
    ...googleValidate,
    ...uploadFile
}