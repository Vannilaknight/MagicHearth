angular.module('app').controller('cardEditCtrl', function ($scope, $http) {
    $scope.currentCard = null;
    $scope.cards = [];

    var currentCardInd = 0;

    $http.get('/api/allCards').then(function (response) {
        $scope.cards = response.data;
        $scope.currentCard = $scope.cards[currentCardInd];
    });

    $scope.nextCard = function () {
        if(currentCardInd < $scope.cards.length){
            currentCardInd++;
            $scope.currentCard = $scope.cards[currentCardInd];
        }
    };

    $scope.prevCard = function () {
        if(currentCardInd > 0){
            currentCardInd--;
            $scope.currentCard = $scope.cards[currentCardInd];
        }
    };

    $scope.saveCard = function (genreTags) {
        $scope.currentCard.genre = genreTags;
        $http.post('/api/card', {card: $scope.currentCard}).then(function (response) {
            console.log(response.data)
            // $scope.nextCard();
        })
    }
});