const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');

const profile_update = async (req, res) => {

    let resp = { code: 200 };

    try {
        const body = _.pick(req.body, ['display_name' , 'first_name', 'last_name' , 'date_of_birth' , 'gender' , 'subject' , 'about' , 'address' , 'ph_no' ]);

        let updated_user = "";

        const _updated_user = await User.updateProfile(req.user._id, body);

        if(_updated_user.admin_access == true){
            updated_user = _updated_user.toadminJson();
        }

       else if(_updated_user.mentor == true){
            updated_user = _updated_user.tomentorJson();
        }

       else {
            updated_user = _updated_user.touserJson();
        }

        res.json(updated_user);

    }
    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

};

module.exports = profile_update;
