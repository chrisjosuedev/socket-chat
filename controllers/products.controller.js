const { request, response } = require('express');

const { Product } = require('../models');

const getProducts = async (req = request, res = response) => {
    const { limit, from } = req.query;

    const query = {
        status: true,
    };

    // Populate -> Show only defined property
    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('user', 'name')
            .populate('category', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
    ]);

    res.status(200).json({
        totalProducts,
        products,
    });
};

const getProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('user', 'name')
        .populate('category', 'name');

    res.status(200).json({
        product,
    });
};

const postProduct = async (req = request, res = response) => {
    const { status, user, ...body } = req.body;

    const data = {
        ...body,
        name: body.name.toUpperCase(),
        user: req.user._id,
    };

    const product = new Product(data);

    await product.save();

    res.status(201).json({
        ok: true,
        msg: 'Product created successfully',
        product,
    });
};

const putProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const { status, user, ...body } = req.body;

    const data = {
        ...body,
        name: body.name.toUpperCase(),
    };

    const product = await Product.findByIdAndUpdate(id, data, { new: true });

    res.status(200).json({
        ok: true,
        msg: 'Product updated successfully',
        product,
    });
};

const deleteProduct = async (req = request, res = response) => {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
    );

    res.status(200).json({
        ok: true,
        msg: 'Product deleted successfully',
        productDeleted: [product],
    });
};

module.exports = {
    postProduct,
    getProducts,
    getProduct,
    putProduct,
    deleteProduct,
};
