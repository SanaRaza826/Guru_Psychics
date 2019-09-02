const _ = require('lodash');
const {USER_NOT_FOUND} = require('../common/error_codes');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');
const {Articles_by_advsior} = require('../../models/articles_by_mentor');

const article = async (req, res) => {
    try {
        let resp;
        const token = req.header('x-sh-auth');
        const user = await User.findByToken(token);
        if (!user) {
            res.status(400).json(USER_NOT_FOUND);
        }

        if(user.mentor == true){

            const body = _.pick(req.body, ['title' , "description"]);

            const article = new Articles_by_advsior({
                user: user._id,
                title: body.title,
                description: body.description,
                submit_date : Date.now(),
            });

            await article.save();

            resp = {
                code: 200,
                message : 'Successfully Added',
                article: article
            };

        }

        else {
            resp = {
                code: 400,
                message : 'You are not an advisor'
            };
        }

        res.json(resp);
    }

    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = article;