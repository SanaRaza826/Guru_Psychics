const express = require('express');
const router = express.Router();
const {register_route} = require('../utils/routes');

// ************************
// Meta Data
// ************************
const submit_article = require('../controllers/articles/submit_article');
const edit_article = require('../controllers/articles/edit_an_article');
const get_article = require('../controllers/articles/get_an_article');
const list_articles = require('../controllers/articles/list_all_articles');
const delete_articles = require('../controllers/articles/delete');

register_route({
    router,
    route: '/submit_an_Article',
    post_method: submit_article
});

register_route({
    router,
    route: '/edit_an_Article',
    post_method: edit_article
});


register_route({
    router,
    route: '/get_an_Article',
    get_method: get_article
});


register_route({
    router,
    route: '/get_all_Articles',
    get_method: list_articles
});


register_route({
    router,
    route: '/delete_Article',
    get_method: delete_articles
});

module.exports = router;