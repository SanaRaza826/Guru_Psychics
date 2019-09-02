const {User} = require('./../models/user');

const admin_auth = (req, res, next) => {

    const admin_access = req.user.admin_access;

    if (admin_access) {
        next();
    } else {
        res.status(401).send();
    }
};

module.exports = {admin_auth};
