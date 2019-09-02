const _ = require('lodash');
const {Notification} = require('../../models/notifications');
const {RENDER_BAD_REQUEST} = require('../common/utils');
const {User} = require('../../models/user');

const get = async (req, res) => {
    try {
        const token = req.header('x-sh-auth');
        const user = await User.findByToken(token);
        if (!user) {
            res.status(400).json(USER_NOT_FOUND);
        }

        else {

            let page    = req.query.page;
            let limit   = req.query.limit;

            if (page) {
                page = parseInt(page)+1;
                if (isNaN(page)) { page = 1 }
            } else {
                page = 1;
            }

            if (limit) {
                limit = parseInt(limit);
                if (isNaN(limit)) { limit = 10}
            } else {
                limit = 10;
            }

            const skip = (page-1) * limit;

            const notifications = await Notification.findNotificationsByUserId(user._id , limit , skip);
            res.json({
                code: 200,
                notifications: notifications,
                load_more_url:'/user/getNotifications?page=' + page + '&limit=' + limit
            });
        }
    } catch (e) {
        RENDER_BAD_REQUEST(res, e);
    }
};

module.exports = get;