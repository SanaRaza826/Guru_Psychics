const _ = require('lodash');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {Articles_by_advsior} = require('../../models/articles_by_mentor');

const list = async (req, res) => {
    try {
        const articles = await Articles_by_advsior.getAllList();

        if (!articles) {
            res.status(400).json({ message : "not found"});
        }

        res.json({
            code: 200,
            articles: articles
        });
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = list;