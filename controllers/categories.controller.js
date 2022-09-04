const { request, response } = require('express');

const { Category } = require('../models');

const getCategories = async (req = response, res = response) => {
    const { limit, from } = req.query;

    const query = {
        status: true,
    };

    // Populate -> Show only defined property
    const [totalCategories, categories] = await Promise.all([
        Category.countDocuments(query),
        Category.find(query)
            .populate('user', 'name')
            .skip(Number(from))
            .limit(Number(limit)),
    ]);

    res.status(200).json({
        totalCategories,
        categories,
    });
};

const getCategory = async (req = response, res = response) => {
    const { id } = req.params;

    // Populate -> Excludes _id, __v, password
    const category = await Category.findById(id).populate(
        'user',
        '-_id -__v -password'
    );

    if (!category.status) {
        return res.status(400).json({
            ok: false,
            msg: 'Category is not available',
        });
    }

    res.status(200).json({
        category,
    });
};

const postCategory = async (req = response, res = response) => {
    const name = req.body.name.toUpperCase();

    // Data
    const data = {
        name,
        user: req.user._id,
    };

    const category = new Category(data);
    await category.save();

    res.status(201).json({
        ok: true,
        msg: 'Category created successfully',
        category,
    });
};

const putCategory = async (req = response, res = response) => {
    const { id } = req.params;

    const name = req.body.name.toUpperCase();

    const category = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true }
    );

    res.status(200).json({
        ok: true,
        msg: 'Category updated successfully',
        category,
    });
};

const deleteCategory = async (req = response, res = response) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category.status) {
        return res.status(400).json({
            ok: false,
            msg: `${category.name} is already deleted`,
        });
    }

    const deleteCategory = await Category.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
    );

    res.status(200).json({
        ok: true,
        msg: 'Category deleted successfully',
        categoryDeleted: [deleteCategory],
    });
};

module.exports = {
    postCategory,
    getCategories,
    getCategory,
    putCategory,
    deleteCategory,
};
