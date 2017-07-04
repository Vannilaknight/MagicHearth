var fs = require("fs"),
    AllSets = require("./../controllers/AllSets.json");
var filename = "Modern.json";
var setToAdd = "TSB";
var modernJSON = [];

fs.exists(filename, function (exists) {
    if (exists) {
        console.log("ADDED: " + setToAdd);
        fs.readFile(filename, function readFileCallback(err, data) {
            if (err) {
                console.log(err);
            } else {
                modernJSON = JSON.parse(data);
                modernJSON.push(AllSets[setToAdd]);
                var json = JSON.stringify(modernJSON);
                fs.writeFile(filename, json);
            }
        });
    } else {
        console.log("ADDED: " + setToAdd);
        modernJSON.push(AllSets[setToAdd]);
        var json = JSON.stringify(modernJSON);
        fs.writeFile(filename, json);
    }
});