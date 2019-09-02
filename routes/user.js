const express = require('express');
const router = express.Router();
const {register_route} = require('../utils/routes');

const get_delete_account = require('../controllers/user/deleteAccount');

const post_register = require('../controllers/user/register');
const post_login = require('../controllers/user/login');
const get_profile = require('../controllers/user/profile');
const get_logout = require('../controllers/user/logout');
const get_logout_all_devices = require('../controllers/user/logout_all_devices');
const post_confirm_register_pin = require('../controllers/user/confirm_register_pin');
const get_confirm_register_uri = require('../controllers/user/confirm_register_uri');
const post_profile_update = require('../controllers/user/profile_update');
const post_forgot_password_gen_pin =  require('../controllers/user/forgot_password_gen_pin');
const post_reset_password_pin = require('../controllers/user/reset_password_pin');
const post_reset_password = require('../controllers/user/reset_password');
const report = require('../controllers/user/report');
const update_token = require('../controllers/user/update_token');
const get_reports = require('../controllers/user/get_all_reports');


register_route({
    router,
    auth_required: false,
    route: '/register',
    post_method: post_register
});


register_route({
    router,
    auth_required: false,
    route: '/reports',
    get_method: get_reports
});


register_route({
    router,
    auth_required: false,
    route: '/login',
    post_method: post_login
});


register_route({
    router,
    auth_required: false,
    route: '/forgot/password/email_pin',
    post_method: post_forgot_password_gen_pin
});

register_route({
    router,
    auth_required: false,
    route: '/reset/password/with/pin',
    post_method: post_reset_password_pin
});

register_route({
    router,
    route: '/change/password',
    post_method: post_reset_password
});


register_route({
    router,
    route: '/update/token',
    auth_required:true,
    get_method: update_token
});


register_route({
    router,
    route: '/profile',
    get_method: get_profile
});

register_route({
    router,
    route: '/logout',
    get_method: get_logout
});

register_route({
    router,
    route: '/logout_all_devices',
    get_method: get_logout_all_devices
});

register_route({
    router,
    route: '/confirm_register_pin',
    post_method: post_confirm_register_pin
});

register_route({
    router,
    route: '/confirm_register_uri',
    get_method: get_confirm_register_uri
});

register_route({
    router,
    route: '/update/profile',
    post_method: post_profile_update
});


register_route({
    router,
    route: '/report',
    post_method: report
});


register_route({
    router,
    route: '/delete_account',
    get_method: get_delete_account
});

module.exports = router;
