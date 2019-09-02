const _ = require('lodash');
const {USER_NOT_FOUND} = require('../common/error_codes');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');
const {Report} = require('../../models/reports');

const report = async (req, res) => {
    try {
        const token = req.header('x-sh-auth');
        const user = await User.findByToken(token);
        if (!user) {
            res.status(400).json(USER_NOT_FOUND);
        }

        const body = _.pick(req.body, ['text']);

        const problem = new Report({
            user: user._id,
            feed: "",
            report: body.text,
            report_date : Date.now(),
        });

        await problem.save();

        ////////////////////////////
        ////////mail to admin /////
        ///////////////////////////


        // client.sendEmail({
        //     to: "diversifiers@gmail.com",
        //     from: "app <verify@16xbrains.com>",
        //     subject: 'A Problem Report on Positive Vibes',
        //     message:  message
        // }).then(function(data, res) {
        //     console.log('sent ok, data ==> ', data);
        // })
        //     .catch(function(err) {
        //         console.log('sent error ==> ', err);
        //     });

        ////////////////////////////

        const resp = {
            code: 200,
            message : 'Successfully Added'
        };

        res.json(resp);
    }
    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = report;