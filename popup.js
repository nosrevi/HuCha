var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {
  chrome.storage.local.get('settings', function(response) {
    var res = JSON.parse(response.settings);
    $scope.CC = res.CC;
    $scope.HP = res.HP;
    $scope.BL = res.BL;
    $scope.WR = res.WR;
    $scope.$apply();
  });
});

function save() {

}

document.getElementById('save').addEventListener('click',save);
