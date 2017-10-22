var allSets = require('./Data/AllSets.json');

exports.getAllSets = function (req, res) {
    res.send(allSets);
}

exports.editCard = function (req, res){
    console.log(req.body)
}