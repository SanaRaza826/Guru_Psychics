const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');

const deleteAccount = async (req, res) => {

    try {
        const token = req.header('x-sh-auth');
        const user = await User.findByToken(token);

        await User.deleteAccount(user._id);

        res.json({
            code : 200,
            message : "deleted!"
        });

    }
    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

};

module.exports = deleteAccount;
