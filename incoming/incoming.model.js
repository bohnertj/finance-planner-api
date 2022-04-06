const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const moment = require('moment-timezone');
const dateGermany = moment.tz(Date.now(), "Europe/Berlin");


const IncomingSchema = mongoose.Schema({
    _id: {
        type: ObjectId,
        required: false
    },
    title: {
        type: String,
        required: true
    },
    categorie: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
        
    },
    date: {
        type: Date,
        default:dateGermany,
        require: true
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Incoming', IncomingSchema);