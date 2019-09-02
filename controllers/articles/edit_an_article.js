const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {Articles_by_advsior} = require('../../models/articles_by_mentor');

const edit_article = async (req, res) => {

    try {

        let article_id = req.query.article_id;
        const body = _.pick(req.body, [ 'title' , 'description' ]);


        if(req.user.admin_access == true){

            const edited_article = await Articles_by_advsior.editArticle(article_id, body);

            res.json({
                code: 200,
                message : "edited!",
                edited_article : edited_article
            });

        }

        else {
            res.json({
                code: 400,
                message : "you are not allowed to edit it!"
            });
        }

    }
    catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }

};

module.exports = edit_article;
