var mongoose = require('mongoose'),
    userModel = require('../models/User');

module.exports = function (config) {
    mongoose.connect(config.self.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error...'));
    db.once('open', function callback() {
        console.log('Swingface db opened');
        userModel.createDefaultUsers();
    });


};