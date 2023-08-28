const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Competition = require('./competition.js');

const userSchema = new Schema({
    fname: {
        type: String,
        required: true
    },

    lname: {
        type: String
    },

    phNumber: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    qualification: String,

    achievements: [
        {
            achievement: String
        }
    ],

    prevParticipations: [
        {
            participation: String
            // can add prev participation ratings
        }
    ],

    appliedComp: [
        {
           comp: {type: Schema.Types.ObjectId,
            ref: "Competition"},
           name:String,
            status:{
                type: String
            }
        }
    ],

    compCreated: [
        {
            type: Schema.Types.ObjectId,
            ref: "Competition"
        }
    ],

    password: {
        type: String,
        // required: true
    }

})

module.exports = mongoose.model('User', userSchema);