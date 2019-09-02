const {WRONG_HTTP_METHOD} = require('../controllers/common/error_codes');
const {authenticate} = require('../middleware/authenticate');
const {admin_auth} = require('../middleware/admin_auth');

const register_route = (
    {
        router = undefined,
        route = undefined,
        auth_required = true,
        admin_auth_only = false,
        get_method = undefined,
        post_method = undefined
    } = {}) => {

    if (router != undefined || route != undefined) {
        let args = [route];
        if (auth_required) {
            args.push(authenticate);
        }
        if (admin_auth_only) {
            args.push(admin_auth);
        }


        if (get_method) {
            router.get(...args, get_method);
        } else {
            router.get(...args, WRONG_HTTP_METHOD);
        }

        if (post_method) {
            router.post(...args, post_method);
        } else {
            router.post(...args, WRONG_HTTP_METHOD);
        }
    }
};



module.exports = {
    register_route
};