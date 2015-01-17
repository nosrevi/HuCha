var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {
  //$scope.settings = {};
  var s = JSON.parse(localStorage.settings);
  $scope.CC = s.CC;
  $scope.HP = s.HP;
  $scope.BL = s.BL;
  $scope.WR = s.WR;
  //console.log('popup+'+$scope.settings.CC);
  
//  chrome.storage.local.get('settings', function(response) {
//    var res = JSON.parse(response.settings);
//    $scope.settings.CC = res.CC;
//    $scope.settings.HP = res.HP;
//    $scope.settings.BL = res.BL;
//    $scope.settings.WR = res.WR;
//    $scope.$apply();
//  });

  $scope.saveSettings = function() {
//    chrome.storage.local.set({'settings' : JSON.stringify($scope.settings)}, function() {
//      if (chrome.extension.lastError) {
//        console.log('error');
//      }
//    });
    localStorage.settings = JSON.stringify({
      'CC' : $scope.CC,
      'HP' : $scope.HP,
      'BL' : $scope.BL,
      'WR' : $scope.WR
    });
    window.close();
  };
  
});

