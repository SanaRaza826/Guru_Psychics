const mongoose = require('mongoose');
const timestamps = require('mongoose-timestamp');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const ObjectId = require('mongodb').ObjectId;

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true,
            index: true
        },

        device_modal : {
            type : String,
            default : ""
        },

        time_zone: String,
        device_token: String,
        platform: String,
    }],
    confirmation_code : {
        type: String,
        default: '0000'
    },

    reset_password_code: String,
    confirmed: {
        type: Boolean,
        default: false
    },
    first_name: {
        type: String,
        default: ''
    },
    last_name: {
        type: String,
        default: ''
    },

    display_name : {
        type: String,
        default: ""
    },

    gender: {
        type: String,
        default: ''
    },
    address : {
        type : String,
        default : ""
    },
    date_of_birth : {
      type : String,
        default : ""
    },

    admin_access: {
        type: Boolean,
        default: false
    },

    mentor: {
        type: Boolean,
        default: false
    },

    user: {
        type: Boolean,
        default: true
    },

    activity_status: {
        type: String,
        default: "offline"
    },

    account_activity_status: {
        type: Boolean,
        default: false
    },

    announcements: [{

        title  : {
            type : String,
            required : false
        },

        description: {
            type: String,
            default: 1
        },

        date : {
            type : Date,
            required : true
        },

        published : {
            type : Boolean,
            default: false
        },
         for_user : {
            type : Boolean,
            default: false
        },
         for_mentor : {
            type : Boolean,
            default: false
        },
    }],

    ph_no : {
        type : String,
        default : ''
    },

    subject : {
        type : String,
        default : ''
    },

    about : {
        type : String,
        default : ''
    },

    reviews : {
        type : String,
        default : ''
    },

    active_dp : {
        type : String,
        default : 'in progress'
    },

});

UserSchema.plugin(timestamps);

UserSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    const userJson = _.pick(userObject, ['_id', 'email', 'first_name', 'last_name' , 'display_name' , 'gender' , 'subject' , 'about' , 'admin_access' , 'mentor' , 'user' , 'online' , 'account_activity_status' , 'address' , 'ph_no' , 'date_of_birth' ]);
    userJson.dp_active_file =  userObject.dp_active_file;

    return userJson;
};

UserSchema.methods.toadminJson = function () {
    const user = this;
    const userObject = user.toObject();

    const userJson = _.pick(userObject, ['_id', 'email', 'first_name',  'last_name' , 'display_name' , 'gender' , 'admin_access' ]);
    userJson.dp_active_file =  userObject.dp_active_file;

    return userJson;
};


UserSchema.methods.tomentorJson = function () {
    const user = this;
    const userObject = user.toObject();

    const userJson = _.pick(userObject, ['_id', 'email', 'first_name',  'last_name' , 'display_name' , 'gender' , 'subject' , 'about'  , 'mentor'  , 'online' , 'account_activity_status' , 'address' , 'ph_no' , 'date_of_birth' ]);
    userJson.dp_active_file =  userObject.dp_active_file;

    return userJson;
};

UserSchema.methods.touserJson = function () {
    const user = this;
    const userObject = user.toObject();

    const userJson = _.pick(userObject, ['_id', 'email', 'first_name',  'last_name' , 'display_name' , 'gender'  , 'about'  , 'user' , 'account_activity_status' , 'address' , 'ph_no' , 'date_of_birth' ]);
    userJson.dp_active_file =  userObject.dp_active_file;

    return userJson;
};

UserSchema.methods.validated_pin = function () {
    const user = this;
    return user.update({
        $set: {
            confirmed: true
        }
    });
};

UserSchema.methods.adminJson = function () {
    const user = this;
    const userObject = user.toObject();

    const adminJson = _.pick(userObject, ['_id', 'full_name', 'report']);
    return adminJson;
};


UserSchema.methods.profileJson = function () {
    const user = this;
    const userObject = user.toObject();

    const adminJson = _.pick(userObject, ['_id', 'full_name', 'country' , 'date_of_birth' , 'age' , 'about' , 'achievements' , 'pray_requests_count' , 'prayed_count', 'quotes_count' , 'points']);
    adminJson.dp_active_file =  userObject.dp_active_file;
    return adminJson;
};


UserSchema.methods.lifeGoalJson = function () {
    const user = this;
    const userObject = user.toObject();

    const lifeGoalJson = _.pick(userObject, ['_id', 'full_name', 'life_goals']);
    return lifeGoalJson;
};


UserSchema.methods.generateAuthToken = function (deviceInfo) {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    const { device_token, platform , time_zone , device_modal} = deviceInfo;

    user.tokens.push({access, token, device_token, platform , time_zone , device_modal});

    return user.save().then(() => {
        return token;
    });
};


UserSchema.methods.removeToken = function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};


UserSchema.methods.removeAllTokens = function () {
    const user = this;

    return user.update({
        $set: {
            tokens: []
        }
    });
};


UserSchema.statics.getAllLogins = function () {
    const User = this;
    return User.find({"tokens" : { $ne : [] }
    });
};


UserSchema.statics.findDaysOfWeek = function () {
    const User = this;
    return User.aggregate(
        [
            {
                $project:
                    {
                        dayOfWeek: { $dayOfWeek: "$createdAt" }
                    }
            }
        ]
    )
};

UserSchema.statics.countByLastMonth= function () {
    const User = this;
    let today = new Date();
    return User.aggregate([
        {
        $match: {
            createdAt: {
                $gte: new Date(new Date(today.getTime() - (24*30 * 60 * 60 * 1000)))
            }
        }
    }, {
        $group: {
            _id: {
                "year":  { "$year": "$createdAt" },
                "month": { "$month": "$createdAt" },
                "day":   { "$dayOfMonth": "$createdAt" }
            },
            count:{$sum: 1}
        }
    }
    ]);
};



UserSchema.statics.updateReport = function (id, updates) {
    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(id)
        },
        {
            $set: {'report' : updates}
        },
        {
            new: true
        }
    );
};


UserSchema.statics.getAll = function () {
    const User = this;
    return User.find({});
};


UserSchema.statics.getLifeGoals = function (id) {
    const User = this;
    return User.find({_id : ObjectId(id) }). populate('life_goals.category' , 'title');
};


UserSchema.statics.editLifeGoal = function (user_id, goal_id , updates) {
    const User = this;
    return User.findOneAndUpdate(
        {
            "_id": ObjectId(user_id), "life_goals._id": ObjectId(goal_id)
        },
        {
            $set: {
                "life_goals.$.title": updates.title,
                "life_goals.$.description": updates.description,
                "life_goals.$.target_date": updates.target_date,
                "life_goals.$.category": updates.category,
            }
        },
        {
            new : true
        }
    );
};


UserSchema.statics.updateReport = function (id, updates) {
    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(id)
        },
        {
            $set: {'report' : updates}
        },
        {
            new: true
        }
    );
};


UserSchema.statics.updateProfile = function (id, updates) {
    const user = this;
    return user.findOneAndUpdate(
        {
            _id: ObjectId(id)
        },
        {
        $set: updates
         },
        {
            new: true
        }
        );
};


UserSchema.statics.update_notification_status = function (id,comment_like_notification,feed_add_notification  ) {
    const User = this;
    return User.update(
        {_id:ObjectId(id)},
        {$set:
            {   comment_like_notification:comment_like_notification,
                feed_add_notification: feed_add_notification
        }})
};


UserSchema.statics.addFavourite = function (user_id, image) {

    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(user_id)
        },
        {
            $push: { favourite_images: image }
        },
        {
            new: true
        }
    );
};


UserSchema.statics.addLifeGoal = function (user_id, goal) {

    console.log('add Goal');
    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(user_id)
        },
        {
            $push: { life_goals: goal }
        },
        {
            new: true
        }
    );
};


UserSchema.statics.addCategories = function (user_id, updates) {

    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(user_id)
        },
        {
            $push: { categories: updates }
        },
        {
            new: true
        }
    );
};



UserSchema.statics.editCategories = function (user_id, updates) {

    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(user_id)
        },
        {
            $set: { categories: updates }
        },
        {
            new: true
        }
    );
};


UserSchema.statics.removeFavourite = function (user_id, image_id) {

    const User = this;
    return User.findOneAndUpdate(
        {
            _id: ObjectId(user_id)
        },
        {
            $pull: {
                favourite_images : {_id: ObjectId(image_id)}
            }
        },
        {
            new: true
        }
    );
};


UserSchema.statics.userCount = function () {
    const User = this;
    return User.count();
};


UserSchema.statics.findUserByEmail = function (email) {
    const User = this;
    return User.findOne({email: email});
};

UserSchema.statics.findById = function (id) {
    console.log('find user==>', id);
    const User = this;
    return User.findOne({_id: ObjectId(id)});
};


UserSchema.statics.updateToken = function (token, session_id) {
    const user = this;

    return user.update({"tokens._id": ObjectId(session_id)},
        {$set: { "tokens.$.device_token": token}
        });
};


UserSchema.statics.getAllReported = function () {
    const User = this;
    return User.find({"report" : { $ne : null }});
};


UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;

    return User.findOne({email}).then((user) => {
        if (!user) {
            return Promise.reject({message: 'InValid Email Entered'});
        }

        return new Promise((resolve, reject) => {
            // Use bcrypt.compare to compare password and user.password
            bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                    resolve(user);
                } else {
                    reject({message: 'InValid Password Entered'});
                }
            });
        });
    });
};


UserSchema.statics.deleteAccount = function (id) {
    const User = this;
    return User.remove({ _id : ObjectId(id)});
};

UserSchema.pre('save', function (next) {
    const user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = {User};
