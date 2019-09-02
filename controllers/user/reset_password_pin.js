const _ = require('lodash');
const {WRONG_PIN_CODE_SENT, USER_NOT_FOUND} = require('../common/error_codes');
const {RENDER_BAD_REQUEST, CHECK_REQUEST_PARAMS} = require('../common/utils');
const {User} = require('../../models/user');

const reset_password_pin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['pin', 'email', 'password', 'device_token', 'platform']);
        const params_required = ['pin', 'email', 'password', 'device_token', 'platform'];

        const req_check = CHECK_REQUEST_PARAMS(body, params_required);
        if (!req_check.all_ok) {
            res.status(400).json({
                code: 400,
                message: 'missing value for :: ' + req_check.missing
            });
        } else {
            const user = await User.findUserByEmail(body.email);
            if (!user) {
                res.status(400).json(USER_NOT_FOUND);
            } else {

                if (body.pin === user.reset_password_code) {
                    user.reset_password_code = '';
                    user.password = body.password;
                    await user.save();

                    const token = await user.generateAuthToken({
                        device_token: body.device_token,
                        platform: body.platform
                    });

                    const fresh_user = await User.findById(user._id);
                    const length = fresh_user.tokens.length;
                    const session_id = fresh_user.tokens[length-1]._id;

                    res.json({
                        code: 200,
                        session_id : session_id,
                        message: 'successfully updated password',
                        user: user,
                        token: token
                    });
                } else {
                    res.status(400).json(WRONG_PIN_CODE_SENT);
                }
            }
        }

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = reset_password_pin;