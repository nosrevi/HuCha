var popup = angular.module('popup', []);

popup.controller('mainController', function ($scope) {

  // initialize, show setting view, hide black list view
  $scope.showSettings = true;
  $scope.showBlacklist = false;

  // init settings
  var s = JSON.parse(localStorage.settings);
  $scope.CC = s.CC;
  $scope.HP = s.HP;
  $scope.BL = s.BL;
  $scope.WR = s.WR;
  
  // init black list 
  $scope.blist = JSON.parse(localStorage.blacklist);

  // save settings to local storage 
  $scope.saveSettings = function() {
    localStorage.settings = JSON.stringify({
      'CC' : $scope.CC,
      'HP' : $scope.HP,
      'BL' : $scope.BL,
      'WR' : $scope.WR
    });
    window.close();
  };

  // save black list to local storage
  $scope.saveBlacklist = function() {
    localStorage.blacklist = JSON.stringify($scope.blist);
    // go back to the setting view 
    $scope.showSettings = true;
    $scope.showBlacklist = false;
  };

  // add to black list
  $scope.addBl = function() {
    if($scope.bl_input && /\S/.test($scope.bl_input) && $scope.blist.indexOf($scope.bl_input) == -1 && $scope.blist.length <= 10) {
      $scope.blist.push($scope.bl_input);
    }
    $scope.bl_input = '';
  };

  // remove from black list
  $scope.removeBl = function(u) {
    var index = $scope.blist.indexOf(u);
    $scope.blist.splice(index, 1);
  };

  // add to black list by hitting enter
  $scope.onKeyDown = function (keyCode) {
    if(keyCode == '13') {
      if($scope.bl_input && /\S/.test($scope.bl_input) && $scope.blist.indexOf($scope.bl_input) == -1 && $scope.blist.length <= 10) {
        $scope.blist.push($scope.bl_input);
      }
      $scope.bl_input = '';
    }
  }
});

