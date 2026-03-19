angular.module('Writter')
.directive('customNavbar', [function(){
    return {
        restrict: 'E',
        transclude:{
        },
        scope:{
            showSidenav:'&',
        },
        templateUrl: '/static/js/components/navbar/navbar.html',
        link: function(scope, element, attrs){
            //+ =============== INSERT YOUR CODE BETWEEN =================
            //+ =============== INSERT YOUR BETWEEN =================
        }
    }
}]);