const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const _ = require('lodash');
const ObjectId = require('mongodb').ObjectId;

const Articles = new mongoose.Schema({

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},

    title : {type : String , default: ""},

    submit_date: {type: Date, default : Date.now()},

    description : {type : String , default : ""},

    approved : { type : Boolean ,  default : false}
});

Articles.plugin(timestamps);

Articles.methods.toJSON = function () {
    const Articles = this;
    const taskObject = Articles.toObject();

    const taskJson = _.pick(taskObject, [ '_id' , 'user' , 'title' , 'submit_date' , 'description' , 'approved' ]);

    return taskJson;
};

Articles.statics.count = function () {
    const tasks = this;
    return tasks.count();
};

Articles.statics.findById = function (id) {
    const task = this;
    return task.findOne({_id: ObjectId(id)}) . populate('user' , 'first_name');
};


Articles.statics.findByUser = function (id) {
    const task = this;
    return task.find({user: ObjectId(id)}) . populate('user' , 'first_name' );
};


Articles.statics.removeById = function (id) {
    const task = this;
    return task.remove({_id: id});
};


Articles.statics.getAllList = function () {
    const tasks = this;
    return tasks.find({})  .  populate('user' , 'first_name');
};


Articles.statics.getAllByUser = function (user_id) {
    const tasks = this;
    return tasks.find({'user' : user_id}) . populate('user' , 'full_name');
};


Articles.statics.getFromLastMonth = function (user_id) {
    const tasks = this;
    let today = new Date();
    return tasks.find({
        'user' : user_id ,
        'date':{ $gte: new Date(new Date(today.getTime() - (24*30 * 60 * 60 * 1000)))}});
};


Articles.statics.approve = function (id) {
    const Article = this;
    return Article.findOneAndUpdate(
        {
            _id: ObjectId(id)
        },
        {
            $set: {'approved' : true}
        },
        {
            new: true
        }
    );
};


Articles.statics.editArticle = function (id, updates) {
    const article = this;
    return article.findOneAndUpdate({_id: id},{
        $set: updates
    });
};

const Articles_by_advsior = mongoose.model('Articles', Articles);
module.exports = {Articles_by_advsior};
