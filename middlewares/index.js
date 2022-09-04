const validateFields = require('./validate-fields');
const validateJWT = require('./validate-jwt');
const validateRoles = require('./validate-roles');
const validateImg = require('./validate-img')

module.exports = {
    ...validateFields,
    ...validateJWT,
    ...validateRoles,
    ...validateImg
};
