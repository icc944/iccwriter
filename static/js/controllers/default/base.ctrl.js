angular.module('Writter')
.controller('base_controller', ['$scope','$mdSidenav',
    baseControllerHandler]);

function baseControllerHandler($scope, $mdSidenav) {
    console.log('✅ base controller loaded!');
    $scope.toggleSidenav = buildToggler('LeftSideNav');
    $scope.redirect = (href) => redirectToRoute(href);
    
    function buildToggler(componentId) {
      return function() {
        $mdSidenav(componentId).toggle();
      };
    }

    function redirectToRoute(href){
      location.href = href;
    }

    $scope.settings = {
      autosave:{enabled:true}
    };
    
  }