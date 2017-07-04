angular.module('app').service('cardService', function ($http, deckService, paginateService) {
    this.params = {
        colors: "",
        cmcs: "",
        colorop: "",
        rarities: "",
        type: "",
        format: "modern"
    };

    this.topRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];
    this.botRow = [{loading: true}, {loading: true}, {loading: true}, {loading: true}];

    this.filteredCards = [];
    this.textCards = [];

    this.textSearchOn = false;
    this.textCards = {};

    this.setFilteredCards = function (cards) {
        this.filteredCards = cards;
        if(this.textSearchOn){
            this.filterText();
        }
    };

    this.setParam = function (param, value) {
        this.params[param] = value;
    };

    this.getCards = function () {
        return $http({
            method: 'GET',
            url: '/api/cards?' + objectToString(this.params)
        }).then(function successCallback(response) {
            var data = response.data;
            return sortCards(data);
        }, function errorCallback(response) {
            console.error(response.data)
        });
    };

    this.getCardsLeft = function (displayCards) {
        this.topRow = calcCardsLeft(displayCards, this.topRow);
        this.botRow = calcCardsLeft(displayCards, this.botRow)
    };

    this.getRandomPrice = function () {
        return randomPrecise(0, 100, 2);
    };

    this.populateCardView = function(cards) {
        for (var x = 0; x < 8; x++) {
            var index = x;
            var card = cards[index];

            if (x < 4) {
                if (card) {
                    card.price = "000.00";
                    card.empty = false;
                    this.topRow[index] = card;
                } else {
                    this.topRow[index] = {empty: true};
                }
            } else {
                if (card) {
                    card.price = this.getRandomPrice();
                    card.empty = false;
                    this.botRow[index - 4] = card;
                } else {
                    this.botRow[index - 4] = {empty: true}
                }
            }
        }
    };

    this.setTextToSearch = function(text){
        this.textToSearch = text;
    };

    this.filterText = function (text = this.textToSearch) {
        if (text.length > 0) {
            console.log("ON")
            this.textSearchOn = true;
            this.textCards = deckService.filterText(text, this.filteredCards);
            paginateService.setMaxPages(this.textCards);
            paginateService.setPage(1);
            this.populateCardView(paginateService.paginate(this.textCards));
        } else {
            this.textSearchOn = false;
            paginateService.setPage(1);
            this.populateCardView(paginateService.paginate(this.filteredCards));
        }
    };

    this.changePage = function () {
        if(this.textSearchOn){
            this.populateCardView(paginateService.paginate(this.textCards));
        } else {
            this.populateCardView(paginateService.paginate(this.filteredCards));
        }
    }
});



