const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');

const create = async (req, res) => {
    try {

        const resp = {
            code: 200
        };

        res.json(resp);
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = create;