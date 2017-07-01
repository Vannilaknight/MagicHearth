angular.module('app').service('paginateService', function () {
    this.currentPage = 1;
    this.maxPage = 0;

    this.paginate = function(cards) {
        var newCards = [];
        if (this.currentPage > 0) {
            var indexStart = (this.currentPage * 8) - 8;
            for (var x = indexStart; x < indexStart + 8; x++) {
                if (objectValues(cards)[x]) {
                    newCards.push(objectValues(cards)[x]);
                }
            }
        } else {
            for (var x = 0; x < 8; x++) {
                if (objectValues(cards)[x]) {
                    newCards.push(objectValues(cards)[x]);
                }
            }
        }
        return newCards;
    };

    this.setPage = function (page) {
        if(page == "+"){
            this.currentPage++;
        } else if (page == "-"){
            this.currentPage--;
        } else {
            this.currentPage = page;
        }
    };

    this.setMaxPages = function (cards) {
        var totalPages = cards.length / 8;
        var minPages = Math.floor(cards.length / 8);

        if (totalPages - minPages > 0) {
            this.maxPage = minPages + 1;
        } else {
            this.maxPage = minPages;
        }
    }

});