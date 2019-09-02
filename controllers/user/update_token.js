const _ = require('lodash');
const {User} = require('../../models/user');
const {RENDER_BAD_REQUEST} = require('../common/utils');


const update_token = async (req, res) => {

    const token = req.query.token;
    const session_id = req.query.session_id;

    const result = await User.updateToken(token, session_id);

    console.log('reuslt query ', result );

    res.json({
        code: 200,
        message:"successfully updated"
    });
};

module.exports = update_token;
