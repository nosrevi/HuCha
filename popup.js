var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {

  $scope.showSettings = true;
  $scope.showBlacklist = false;

  var s = JSON.parse(localStorage.settings);
  $scope.CC = s.CC;
  $scope.HP = s.HP;
  $scope.BL = s.BL;
  $scope.WR = s.WR;
  
  $scope.blist = JSON.parse(localStorage.blacklist);

  $scope.saveSettings = function() {
    localStorage.settings = JSON.stringify({
      'CC' : $scope.CC,
      'HP' : $scope.HP,
      'BL' : $scope.BL,
      'WR' : $scope.WR
    });
    window.close();
  };

  $scope.saveBlacklist = function() {
    localStorage.blacklist = JSON.stringify($scope.blist);
    $scope.showSettings = true;
    $scope.showBlacklist = false;
  };

  $scope.addBl = function() {
    if($scope.bl_input && /\S/.test($scope.bl_input) && $scope.blist.indexOf($scope.bl_input) == -1 && $scope.blist.length <= 10) {
      $scope.blist.push($scope.bl_input);
    }
    $scope.bl_input = '';
  };

  $scope.removeBl = function(u) {
    var index = $scope.blist.indexOf(u);
    $scope.blist.splice(index, 1);
  };

  $scope.onKeyDown = function (keyCode) {
    if(keyCode == '13') {
      if($scope.bl_input && /\S/.test($scope.bl_input) && $scope.blist.indexOf($scope.bl_input) == -1 && $scope.blist.length <= 10) {
        $scope.blist.push($scope.bl_input);
      }
      $scope.bl_input = '';
    }
  }
});

