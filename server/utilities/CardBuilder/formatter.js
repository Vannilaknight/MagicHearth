return new Promise(function (resolve, reject) {
    var AllSets = require("./AllSets.json"),
        MLegal = require("./sets").modern,
        SLegal = require("./sets").standard,
        fs = require("fs");

    var modern = [];
    var standard = [];
    for (var setName in AllSets) {
        var set = AllSets[setName];

        MLegal.forEach(function (legalSet) {
            if (setName == legalSet) {
                modern.push(set);
            }
        });

        SLegal.forEach(function (legalSet) {
            if (setName == legalSet) {
                standard.push(set)
            }
        });
    }


    var modernJSON = JSON.stringify(modern);
    var standardJSON = JSON.stringify(standard);
    fs.writeFile("Modern.json", modernJSON, function (err) {
        if (err) throw err;
        console.log("MODERN BUILT")
    });

    fs.writeFile("Standard.json", standardJSON, function (err) {
        if (err) throw err;
        console.log("STANDARD BUILD")
    });
});