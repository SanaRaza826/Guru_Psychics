const express = require('express');
const router = express.Router();
const {register_route} = require('../utils/routes');

// ************************
// Meta Data
// ************************
const approve_article = require('../controllers/admin_actions/approve_an_article');


register_route({
    router,
    route: '/approve_an_article',
    get_method: approve_article
});

module.exports = router;