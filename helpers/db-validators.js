const { Role, User, Category, Product } = require('../models');

/** Role Validations **/
const isValidRole = async (role = '') => {
    const roleExists = await Role.findOne({ role });
    if (!roleExists) {
        throw new Error(`${role} doesn't exists`.trim());
    }
    return true
};

/** User Validations **/
const isValidEmail = async (email = '') => {
    const emailExists = await User.findOne({ email });

    if (emailExists) {
        throw new Error(`${email} user has already been registered`);
    }
    return true
};

const existsId = async (id) => {
    const idExists = await User.findById(id);

    if (!idExists) {
        throw new Error(`${id} user doesn't exists`);
    }
    return true
};

/** Category Validations **/
const existsCategoryId = async (id) => {
    const idExistsCategory = await Category.findById(id);

    if (!idExistsCategory) {
        throw new Error(`${id} category doesn't exists`);
    }
    return true
};

const isValidName = async (name = '') => {
    const category = await Category.findOne({ name: name.toUpperCase() });

    if (category) {
        throw new Error(`${category.name} category is already registered`);
    }
    return true
};

/** Product Validations **/
const isValidProduct = async (name = '') => {
    const product = await Product.findOne({ name: name.toUpperCase() });

    if (product) {
        throw new Error(`${product.name} product is already registered`);
    }
    return true
};

const existsProductId = async (id) => {
    const idExistsProduct = await Product.findById(id);

    if (!idExistsProduct || !idExistsProduct.status) {
        throw new Error(`${id} product doesn't exists`);
    }
    return true
};

/** Allowed Collections **/
const allowedCollections = (collection = '', listCollections = []) => {
    if (!listCollections.includes(collection)) {
        throw new Error(`${collection} is not allowed, ${listCollections}`);
    }
    return true
}

module.exports = {
    isValidRole,
    isValidEmail,
    existsId,
    existsCategoryId,
    isValidName,
    isValidProduct,
    existsProductId,
    allowedCollections
};
