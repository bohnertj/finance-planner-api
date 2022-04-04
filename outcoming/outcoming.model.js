const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');


const OutcomingSchema = mongoose.Schema({
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
        require: true
    },
    username: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Outcoming', OutcomingSchema);
