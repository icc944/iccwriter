app.config(function ($routeProvider){
    $routeProvider
    .when("/", {
        templateUrl: '/templates/main.html'
    })
    .otherwise({
        templateUrl:"/templates/main.html"
    })
});