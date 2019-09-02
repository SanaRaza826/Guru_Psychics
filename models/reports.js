const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

const Reports = new mongoose.Schema({

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    report : {type : String , default: ""},

    report_date: {type: Date, default : Date.now()},

    feed: {type : String , default : ""},

    feed_img : {type : String , default : ""},

    reply : {type : String , default : ""},

    type : {type : String , default : "app"},

    reply_date: {type: Date, default : "1970-01-01T00:00:00"},

});

Reports.plugin(timestamps);

Reports.methods.toJSON = function () {
    const Report = this;
    const taskObject = Report.toObject();

    const taskJson = _.pick(taskObject, [ '_id' , 'user' , 'report' , 'report_date' , 'reply' , 'feed' , 'type' , 'reply_date' , 'feed_img' ]);

    return taskJson;
};

Reports.statics.count = function () {
    const tasks = this;
    return tasks.count();
};

Reports.statics.findById = function (id) {
    const task = this;
    return task.findOne({_id: ObjectId(id)}) . populate('user' , 'full_name dp_active_file');
};


Reports.statics.findByUser = function (id) {
    const task = this;
    return task.find({user: ObjectId(id)}) . populate('user' , 'full_name dp_active_file') ;
};


Reports.statics.removeById = function (id) {
    const task = this;
    return task.remove({_id: id});
};


Reports.statics.getAllList = function () {
    const tasks = this;
    return tasks.find({})  . populate('user' , 'full_name dp_active_file');
};


Reports.statics.getAll = function (user_id) {
    const tasks = this;
    return tasks.find({'user' : user_id}) . populate('user' , 'full_name dp_active_file');
};


Reports.statics.getFromLastMonth = function (user_id) {
    const tasks = this;
    let today = new Date();
    return tasks.find({
        'user' : user_id ,
        'date':{ $gte: new Date(new Date(today.getTime() - (24*30 * 60 * 60 * 1000)))}});
};


Reports.statics.findByIdAndUpdate = function (id, updates) {
    const task = this;
    console.log('update==>', updates , "at" , id);
    return task.findOneAndUpdate({_id: ObjectId(id)},{
        $set: updates
    });
};

const Report = mongoose.model('Report', Reports);
module.exports = {Report};
