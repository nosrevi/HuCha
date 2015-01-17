var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {
  chrome.storage.local.get('settings', function(response) {
    var res = JSON.parse(response.settings);
    $scope.settings.CC = res.CC;
    $scope.settings.HP = res.HP;
    $scope.settings.BL = res.BL;
    $scope.settings.WR = res.WR;
    $scope.$apply();
  });

  $scope.saveSettings = function() {
    chrome.storage.local.set({'settings' : JSON.stringify($scope.settings)}, function() {
      if (chrome.extension.lastError) {
        console.log('error');
      }
    });
  };
});

