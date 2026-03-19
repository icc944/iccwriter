angular.module('Writter')
.controller('404_controller', ['$scope', '$location', '$window', function($scope, $location, $window) {
    console.log('✅ 404_controller loaded!');
    $window.location.href = '/page_not_found'; 
}]);
