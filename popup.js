var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {
  $scope.test = 'Nimasi';
});

function save() {

}

document.getElementById('save').addEventListener('click',save);
