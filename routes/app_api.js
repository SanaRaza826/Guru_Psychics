const express = require('express');
const router = express.Router();
const {register_route} = require('../utils/routes');

// ************************
// Meta Data
// ************************
const get_server_time = require('../controllers/app_api/get_server_time');


register_route({
    router,
    route: '/server_time',
    get_method: get_server_time
});

module.exports = router;