const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');


const compSchema = new Schema({
    name: {
        type: String,
        required: true
    },

    memberReq: {
        type: Number,
        require: true
    },

    memberLeft: {
        type: Number,
    },

    applicants: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            msg: String,
        }
    ],

    acceptedApp: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            msg: String,
        }
    ],

    competitionDate: {
        type: Date,
        // required: true,
    },

    deadline: {
        type: Date,
        // reuired: true
    },

    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    enough:Boolean

})
// module.exports = mongoose.model('Applicant', applicant)
module.exports = mongoose.model('Competition', compSchema);