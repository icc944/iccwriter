angular.module('Writter')
.controller("time_controller", ['$scope', 'DateTimeService', function($scope, DateTimeService) {
    console.log('✅ time_controller loaded!');

    $scope.now = ()=>DateTimeService.now();
    $scope.strfTime = (date_object)=>DateTimeService.strfTime(date_object);
    $scope.toDatetime = (str_time)=>DateTimeService.toDatetime(str_time);
    $scope.strfDate = (date_object)=>DateTimeService.strfDate(date_object);

}]);