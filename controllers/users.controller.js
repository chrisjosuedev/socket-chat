const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const { User } = require('../models');

const getUsers = async (req = request, res = response) => {
    // params = /users?q=something&name=something&apikey=something

    const { limit, from } = req.query;
    const query = {
        status: true,
    };

    // Queries Simultaneas

    const [totalUsers, users] = await Promise.all([
        User.countDocuments(query),
        User.find(query).skip(Number(from)).limit(Number(limit)),
    ]);

    res.status(200).json({
        totalUsers,
        users,
    });
};

const putUsers = async (req = request, res = response) => {
    const { id } = req.params;

    const { _id, password, google, email, ...rest } = req.body;

    if (password) {
        // Crypt Password
        const salt = bcryptjs.genSaltSync();
        rest.password = bcryptjs.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, rest, { new: true });

    res.status(200).json({
        ok: true,
        msg: 'User was updated succesfully',
        user,
    });
};

const patchUsers = (req = request, res = response) => {
    res.json({
        msg: 'patch API - Controller',
    });
};

const postUsers = async (req = request, res = response) => {
    const { name, email, password, role } = req.body;

    const user = new User({
        name,
        email,
        password,
        role,
    });

    // Crypt Password
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt);

    // Save to Database
    await user.save();

    res.status(201).json({
        ok: true,
        msg: 'User was registered succesfully',
        user,
    });
};

const deleteUsers = async (req = request, res = response) => {
    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
        id,
        { status: false },
        { new: true }
    );

    res.status(200).json({
        msg: 'User was deleted successfully',
        userDeleted: [user],
    });
};

module.exports = {
    getUsers,
    putUsers,
    patchUsers,
    postUsers,
    deleteUsers,
};
