const _ = require('lodash');
const {USER_NOT_FOUND} = require('../common/error_codes');
const {RENDER_BAD_REQUEST, CHECK_REQUEST_PARAMS} = require('../common/utils');
const {User} = require('../../models/user');

const reset_password = async (req, res) => {
    try {

        const body = _.pick(req.body, ['email', 'old_password', 'password', 'device_token', 'platform']);
        const params_required = ['email', 'old_password', 'password', 'device_token', 'platform'];

        console.log('reset password called');

        const req_check = CHECK_REQUEST_PARAMS(body, params_required);
        if (!req_check.all_ok) {
            res.status(400).json({
                code: 400,
                message: 'missing value for :: ' + req_check.missing
            });
        } else {
            const user = await User.findByCredentials(body.email, body.old_password);
            if (!user) {
                res.status(400).json(USER_NOT_FOUND);
            }
            else if (req.user.email !== user.email) {
                res.status(400).json({message: 'Wrong Credentials provided'});
            }
            else {
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
            }
        }
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = reset_password;