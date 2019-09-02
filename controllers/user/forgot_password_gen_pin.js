const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');

const forgot_password_gen_pin = async (req, res) => {

    try {
        const body = _.pick(req.body, ['email']);
        const user = await User.findUserByEmail(body.email);
        if (!user) {
            res.status(400).json({
                code: 400,
                message: 'User you are trying to reach not exist in the system'
            });
        }

        else {

            const value = random.integer(1, 9999);

            user.reset_password_code = value;
            await user.save();
            res.json({
                code: 200,
                message: 'reset password code has been emailed to you via email'
            });

        }

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

};

module.exports = forgot_password_gen_pin;
