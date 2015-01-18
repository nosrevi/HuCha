var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {

  var s = JSON.parse(localStorage.settings);
  $scope.CC = s.CC;
  $scope.HP = s.HP;
  $scope.BL = s.BL;
  $scope.WR = s.WR;

  $scope.saveSettings = function() {
    localStorage.settings = JSON.stringify({
      'CC' : $scope.CC,
      'HP' : $scope.HP,
      'BL' : $scope.BL,
      'WR' : $scope.WR
    });
    window.close();
  };
  
});

popup.controller('blController', function ($scope) {
  
  $scope.blist = ['a','b','c','d','e'];
});

