const _ = require('lodash');
const {User} = require('../../models/user');
const {RENDER_BAD_REQUEST, CHECK_REQUEST_PARAMS} = require('../common/utils');

const register = async (req, res) => {
    try {

        const body = _.pick(req.body, ['email', 'password' , 'display_name' , 'first_name', 'last_name' , 'date_of_birth' , 'gender' , 'subject' , 'about' , 'address' , 'ph_no' , 'device_token', 'platform' , 'time_zone' , 'device_modal']);
        const params_required = ['email', 'password'];
        const user_type = req.query.user_type;
        let responsed_user;

        const req_check = CHECK_REQUEST_PARAMS(body, params_required);
        if (!req_check.all_ok) {
            res.status(400).json({
                code: 400,
                message: 'missing value for :: ' + req_check.missing
            });

        }
        else {

            if(String(user_type) == "admin"){
                body.admin_access = true;
                body.account_activity_status = true
            }
            else{
                body.admin_access = false
            }

            if(String(user_type) == "advisor"){
                body.mentor = true
            }
            else {
                body.mentor = false
            }

            const user = new User({
                email: body.email,
                password: body.password,
                first_name: body.first_name,
                last_name: body.last_name,
                date_of_birth: body.date_of_birth,
                gender : body.gender,
                display_name : body.display_name,
                address : body.address,
                about : body.about,
                ph_no : body.ph_no,
                subject : body.subject,
                admin_access : body.admin_access,
                mentor : body.mentor,
                account_activity_status : body.account_activity_status
            });

            await user.save();

            if(String(user_type) == "client"){
                body.user = true
                responsed_user = await user.touserJson();
            }

            if(String(user_type) == "advisor"){
                body.mentor = true
                responsed_user = await user.tomentorJson();
            }

            if(String(user_type) == "admin"){
                body.admin_access = true
                responsed_user = await user.toadminJson();
            }

            const token = await user.generateAuthToken({
                device_token: body.device_token,
                platform: body.platform,
                time_zone : body.time_zone,
                device_modal : body.device_modal
            });

            const fresh_user = await User.findById(user._id);
            const length = fresh_user.tokens.length;
            const session_id = fresh_user.tokens[length-1]._id;

            const resp = {
                session_id : session_id,
                user: responsed_user,
                token: token
            };
            res.json(resp);
        }

    } catch (e) {
        //duplicate key
        if ( e.code === 11000 ) {
            res.status(400).json({
                message: 'user with same email already exist'
            });
        }
        else {
            RENDER_BAD_REQUEST(res, e);
        }
    }
};

module.exports = register;