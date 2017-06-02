angular.module('app').controller('challengeCtrl', function ($scope, $http) {
    var tribes = [
        "Zombie",
        "Goblin",
        "Elf",
        "Dragon",
        "Sliver",
        "Vampire",
        "Wizard",
        "Human",
        "Ally",
        "Eldrazi",
        "Angel",
        "Spirit",
        "Elemental",
        "Merfolk",
        "Snake",
        "Cleric",
        "Bird",
        "Treefolk",
        "Spider",
        "Rat",
        "Warrior",
        "Demon",
        "Cat",
        "Faerie",
        "Dwarf",
        "Knight",
        "Werewolf",
        "Hydra",
        "Giant",
        "Druid",
        "Minotaur",
        "Wall",
        "Beast",
        "Rogue",
        "Insect",
        "God",
        "Monk",
        "Sphinx",
        "Shaman",
        "Myr",
        "Skeleton",
        "Scarecrow",
        "Shapeshifter",
        "Wurm",
        "Centaur",
        "Golem",
        "Horror",
        "Kor"
    ];
    var maxCmc = ["2","3","4"];
    var budgets = ["$20", "$30", "$40", "$50", "$60"];
    var sets = [
        "Urza’s Legacy",
        "Visions",
        "Time Spiral",
        "Invasion",
        "Stronghold",
        "Zendikar",
        "Champions of Kamigawa",
        "Lorwyn",
        "Rise of the Eldrazi",
        "Planar Chaos"];
    var colors = [
        "Mono Red",
        "Mono White",
        "Mono Black",
        "Mono Blue",
        "Mono Green",
        "Colorless (Activated abilities may allow color)",
        "Azorius (W/U)",
        "Dimir (B/U)",
        "Rakdos (B/R)",
        "Gruul (R/G)",
        "Selesnya (G/W)",
        "Orzhov (W/B)",
        "Izzet (U/R)",
        "Golgari (B/G)",
        "Boros (R/W)",
        "Simic (G/U)",
        "Jund (R/G/B)",
        "Bant (W/G/U)",
        "Grixis (B/R/U)",
        "Naya (G/W/R)",
        "Esper (U/W/B)",
        "Jeskai (U/R/W)",
        "Mardu (R/W/B)",
        "Sultai (B/G/U)",
        "Temur (G/U/R)",
        "Abzan (W/B/G)",
        "Glint-Eye (U/B/R/G)",
        "Dune-Brood (B/R/G/W)",
        "Ink-Treader (R/G/W/U)",
        "Witch-Maw (G/W/U/B)",
        "Yore-Tiller (W/U/B/R)",
        "Raindbow (W/U/B/R/G)"
    ];

    $scope.roll = function () {
        $scope.english = "";
        var randomChallenge = {
            tribe: "",
            cmc: "",
            budget: "",
            color: "",
            set: ""
        };

        var tribeCheck = $('#toggle-tribe').is(':checked');
        var cmcCheck = $('#toggle-cmc').is(':checked');
        var budgetCheck = $('#toggle-budget').is(':checked');
        var setCheck = $('#toggle-set').is(':checked');
        var colorCheck = $('#toggle-color').is(':checked');

        if(tribeCheck){
            var randTribe = tribes[getRandomInt(0, tribes.length)];
            $scope.english += "Build a Deck with " + randTribe + "s ";;
            randomChallenge.tribe = randTribe;
        }

        if(cmcCheck){
            var engModifier;
            var randCMC = maxCmc[getRandomInt(0, maxCmc.length)];
            if(tribeCheck){
                engModifier = " exercising a maximum CMC of ";
            } else {
                engModifier = "Use a maximum CMC of "
            }
            $scope.english += engModifier + randCMC + " ";
            randomChallenge.cmc = randCMC;
        }

        if(budgetCheck){
            var engModifier;
            var randBudget = budgets[getRandomInt(0, budgets.length)];
            if(tribeCheck || cmcCheck){
                engModifier = " without spending more than ";
            } else {
                engModifier = "Build a deck under "
            }
            $scope.english += engModifier + randBudget + " ";
            randomChallenge.budget = randBudget;
        }

        if(colorCheck){
            var engModifier;
            var randColor = colors[getRandomInt(0, colors.length)];
            if(tribeCheck || cmcCheck || budgetCheck){
                engModifier = " utilizing the ";
            } else {
                engModifier = "Use the "
            }
            $scope.english += engModifier + randColor + " color combination ";
            randomChallenge.color = randColor;
        }

        if(setCheck){
            var engModifier;
            var randSet = sets[getRandomInt(0, sets.length)];
            if(tribeCheck || cmcCheck || budgetCheck){
                engModifier = " containing cards purely from ";
            } else {
                engModifier = "Use cards only from "
            }
            $scope.english += engModifier + randSet;
            randomChallenge.set = randSet;
        }

        $scope.challenge = randomChallenge;
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}