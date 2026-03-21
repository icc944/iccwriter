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

    //+ Ejemplo default
    $scope.script = {
        //@ Metadatos del script
        meta:{
            pages:1,
            scenes:1,
            characters:4,
            lines:4,
            dialogs:1,
        },

        //@ Cuerpo del script
        pages:[
            //* Page #1
            {
                lines:[
                    {type:'scene', text:'INT. CASA - DIA'}, 
                    {type:'action', text:'Llegas, te inspiras, y comienza un nuevo inicio.'},
                    {type:'character', text:'TÚ'},
                    {type:'dialogue', text:'Hoy es un buen día para empezar...'}
                ]
            }
        ]
    }

    function makeLine(type, text=''){
        const line = document.createElement('div');
        line.className='line';
        line.contentEditable='true';
        line.textContent=text;
        line.dataset.type=type;
        return line
    }

    function init(){
        SHEET.innerHTML = "";
        $scope.script.pages.forEach(pages => {
            pages.lines.forEach(line=>{
                const el = makeLine(line.type, line.text);
                SHEET.appendChild(el);
            });
        });
    }
    init();
}