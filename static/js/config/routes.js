angular.module('Writter')
.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl: '/static/templates/home.html',
    })
    .when("/home", {
        templateUrl: '/static/templates/home.html',
    })
    .when("/project/:id", {
        templateUrl: '/static/templates/project.html',
        controller:'project_controller'
    })
    .otherwise({
        templateUrl: '/static/templates/default/_404.html',
        controller: '404_controller'
    })
}]);