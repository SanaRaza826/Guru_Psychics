const _ = require('lodash');
const {User} = require('../../models/user');
const {RENDER_BAD_REQUEST, CHECK_REQUEST_PARAMS} = require('../common/utils');

const login = async (req, res) => {
    try {

        const body = _.pick(req.body, ['email', 'password', 'device_token', 'platform' , 'time_zone' , 'device_modal']);
        const params_required = ['email', 'password' ];

        let responsed_user = "";

        const req_check = CHECK_REQUEST_PARAMS(body, params_required);
        console.log('body==>', body);

        if (!req_check.all_ok) {
            res.status(400).json({
                code: 400,
                message: 'missing value for :: ' + req_check.missing
            });
        }

        else {
            const user = await User.findByCredentials(body.email, body.password);
            const token = await user.generateAuthToken({
                device_token: body.device_token,
                platform: body.platform,
                time_zone : body.time_zone,
                device_modal : body.device_modal
            });

            if(user.admin_access == true){
                responsed_user = user.toadminJson();
            }

            else if(user.mentor == true){
                responsed_user = user.tomentorJson();
            }

            else {
                responsed_user = user.touserJson();
            }

            const fresh_user = await User.findById(user._id);
            const length = fresh_user.tokens.length;
            const session_id = fresh_user.tokens[length-1]._id;


            let resp = {
                code : 200,
                session_id : session_id,
                user: responsed_user,
                token: token
            };

            res.json(resp);
        }

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = login;