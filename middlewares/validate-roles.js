const { request, response } = require('express');

const verifyRole = (...roles) => {
    return (req = request, res = response, next) => {
        // if 'undefined', invalid validation
        if (!req.user) {
            return res.status(500).json({
                ok: false,
                msg: 'Attempted to validate role without token verification',
            });
        }

        // Includes Role
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                ok: false,
                msg: "You don't have permissions to complete this action",
            });
        }
        next();
    };
};

const isAdminRole = (req = request, res = response, next) => {
    // if 'undefined', invalid validation
    if (!req.user) {
        return res.status(500).json({
            ok: false,
            msg: 'Attempted to validate role without token verification',
        });
    }

    const { role, name } = req.user;

    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            msg: `User ${name} is not an admin, You don't have permissions to complete this action`,
        });
    }

    next();
};

module.exports = {
    verifyRole,
    isAdminRole,
};
