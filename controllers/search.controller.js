const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Product, Category } = require('../models');

const allowedCollections = ['users', 'categories', 'products'];

/** Search Users **/
const searchUsers = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if (isMongoID) {
        const user = await User.findById(term);

        return res.status(200).json({
            results: user ? [user] : [],
        });
    }

    // Insensible Mayus / Minus
    const regex = new RegExp(term, 'i');

    const user = await User.find({
        $or: [{ name: regex }, { email: regex }],
        $and: [{ status: true }],
    });

    res.status(200).json({
        results: user,
    });
};

/** Search Category **/
const searchCategory = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if (isMongoID) {
        const category = await Category.findById(term);

        return res.status(200).json({
            results: category ? [category] : [],
        });
    }

    // Insensible Mayus / Minus
    const regex = new RegExp(term, 'i');

    const category = await Category.find({ name: regex, status: true });

    res.status(200).json({
        results: category,
    });
};

/** Search Product **/
const searchProduct = async (term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if (isMongoID) {
        const product = await Product.findById(term).populate(
            'category',
            'name'
        );

        return res.status(200).json({
            results: product ? [product] : [],
        });
    }

    // Insensible Mayus / Minus
    const regex = new RegExp(term, 'i');

    const product = await Product.find({ name: regex, status: true }).populate(
        'category',
        'name'
    );

    res.status(200).json({
        results: product,
    });
};

const search = (req = request, res = response) => {
    const { collection, term } = req.params;

    if (!allowedCollections.includes(collection)) {
        return res.status(400).json({
            ok: false,
            msg: `Allowed Collections are ${allowedCollections}`,
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategory(term, res);
            break;
        case 'products':
            searchProduct(term, res);
            break;
        default:
            res.status(500).json({
                ok: false,
                msg: 'Search not available',
            });
            break;
    }
};

module.exports = {
    search,
};
