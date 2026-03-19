angular.module('Writter')
.controller('project_controller', ['$scope','$routeParams','ManageProject',projectControllerHandler]);

function projectControllerHandler($scope, $routeParams,ManageProject){
    const projectId = $routeParams.id;
    $scope.projects_metadata = ManageProject.load();
    $scope.project_meta = $scope.projects_metadata.filter(row=>row.id===projectId)[0] || {};
    
    
    const SHEET = document.querySelector('#sheet');
    const map_types = {
        'scene':'action',
        'action':'character',
        'character':'dialogue',
        'dialogue':'transition',
        'parenthetical':'transition',
        'transition':'shot',
        'shot':'scene'
    };

    //+ Ejemplo de un guion
    $scope.script = {
        //@ Metadatos del script
        pages_qty:1,
        scenes_qty:1,
        characters_qty:4,

        //@ Cuerpo del script
        pages:[
            {
                lines:[
                    {type:'scene', text:'INT. PLACE - DAY'}, 
                    {type:'action', text:'John enters the room'},
                    {type:'character', text:'JOHN'},
                    {type:'dialogue', text:'Hello'}
                ]
            }
        ]
    }


}