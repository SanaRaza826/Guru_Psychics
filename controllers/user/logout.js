const {RENDER_BAD_REQUEST} = require('../common/utils');

const logout = async (req, res) => {
    try {
        await req.user.removeToken(req.token);

        const resp = {
            code: 200,
            message: 'logged Out!!'
        };

        res.status(200).json(resp);
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = logout;