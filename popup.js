var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {
  chrome.storage.local.get('settings', function(response) {
    var res = JSON.parse(response.settings);
    console.log('w'+res.CC);
    $scope.CC = res.CC;
  });
});

function save() {

}

document.getElementById('save').addEventListener('click',save);
