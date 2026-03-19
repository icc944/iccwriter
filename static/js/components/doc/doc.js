angular.module('SmartApp')
.directive('smoDoc', ['DataService', function(DataService){
    return {
        restrict: 'E',
        templateUrl: 'app/static/js/components/doc/doc.html',
        scope:{
            runTour:'&'
        },
        compile: function(element, attrs) {
            return function(scope, element, attrs){
                //+ =============== INSERT YOUR CODE BETWEEN =================
                //+ =============== INSERT YOUR BETWEEN =================
            }
        }
    }
}]);