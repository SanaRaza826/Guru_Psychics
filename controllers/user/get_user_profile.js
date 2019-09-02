const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');

const get = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const user_ = await User.findById(user_id);

        const user = user_.profileJson();

        if (!user) {
            res.status(400).json({message : "no user found"});
        }

        else {

            res.json({
                code: 200,
                user: user,
            });
        }

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = get;
