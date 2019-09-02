const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');
const {Report} = require('../../models/reports');

const get = async (req, res) => {
    try {

        const token = req.header('x-sh-auth');
        const user = await User.findByToken(token);
        if (!user) {
            res.status(400).json(USER_NOT_FOUND);
        }

        else {

            let reports = await Report.findByUser(user._id);
            if(!reports){
                res.json({code : 400 , message : "no reports from the requested user"});
            }
             res.json({
                 code : 200,
                 reports
             })
        }

    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = get;
