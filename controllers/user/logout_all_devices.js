const {RENDER_BAD_REQUEST} = require('../common/utils');


const logout_all_devices = async (req, res) => {
    try {
        await req.user.removeAllTokens();

        const resp = {
            code: 200,
            message: 'logged Out!!'
        };

        res.status(200).json(resp);

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = logout_all_devices;