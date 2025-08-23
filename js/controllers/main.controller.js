app.controller("main_controller", function($scope){

    $scope.state = { badge: 'scene' };


    $scope.setState = function(line){
        if(!line) return;
        $scope.state.badge = line.dataset.type;
        console.log("Recibí esto:", line, $scope.state.badge);
    } 

});