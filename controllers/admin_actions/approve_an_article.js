const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {Articles_by_advsior} = require('../../models/articles_by_mentor');

const approve_article = async (req, res) => {

    try {

        let article_id = req.query.article_id;
        if(req.user.admin_access == true){

            const article = await Articles_by_advsior.approve(article_id);

            res.json({
                code: 200,
                message : "approved!"
            });

        }

        else {
            res.json({
                code: 400,
                message : "you are not an admin!"
            });
        }

    }
    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

};

module.exports = approve_article;
