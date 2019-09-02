const {User} = require('./../models/user');

const authenticate = (req, res, next) => {
    const token = req.header('x-sh-auth');

    console.log('token', token);
    User.findByToken(token).then((user) => {
        if (!user) {
            return Promise.reject();
        }
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        console.log('inside auth exception ==>', e);
        res.status(401).send();
    });
};

module.exports = {authenticate};