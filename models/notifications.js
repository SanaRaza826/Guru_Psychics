const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

const NotificationSchema = new mongoose.Schema({

    feed_id: {
        type: String,
        require:true
    },
    feed_img: {
        type: String,
    },
    title: {
        type: String,
        default:""
    },
    notify_to:{
        type:String,
        default:""
    },
    liked_by: {
        type: String
    },
    notify_from_image: {
        type: String
    },
    liker_name: {
        type: String
    },
    comment : {
        type : String,
        default : ""
    },
    admin_quote :{
        type : String,
        default : "true"
    }

});


NotificationSchema.plugin(timestamps);


NotificationSchema.statics.findNotificationsByUserId = function (id , limit , skip) {
    const Notification = this;
    return Notification.find({notify_to:ObjectId(id)}) .limit(limit).skip(skip).sort({createdAt:-1});
};


NotificationSchema.statics.findNotificationsByUser = function (id) {
    const Notification = this;
    return Notification.find({liked_by:ObjectId(id)});
};


NotificationSchema.statics.removeNotificationsByUserId = function (id) {
    const Notification = this;
    return Notification.remove({$or: [ { notify_to: id }, {liked_by: id} ]});
};


NotificationSchema.statics.removeNotificationsComment = function (id) {
    const Notification = this;
    return Notification.remove({comment: id});
};


NotificationSchema.statics.removeNotificationsImage = function (id) {
    const Notification = this;
    return Notification.remove({feed_id: id});
};


NotificationSchema.statics.pushNotifications = function () {
    const Notification = this;
    Notification.insert({ item: "card", qty: 15 });
};


NotificationSchema.methods.toJSON = function () {

    const Notification = this;
    const NotificationObject = Notification.toObject();
    const notificationJson = _.pick(NotificationObject, [ 'title','notify_to','liker_name','createdAt','feed_id' , 'admin_quote']);
    notificationJson.notify_from_image  = NotificationObject.notify_from_image;
    notificationJson.feed_img  = NotificationObject.feed_img;
    return notificationJson ;
};


const Notification = mongoose.model('Notification', NotificationSchema);
module.exports = {Notification};
