angular.module('Writter')
.directive('metaInfo', [function(){
    return {
        restrict: 'E',
        scope:{
            projectName:'=',
            projectDescription:'=',
            projectMeta:'=',

        },
        templateUrl:'/static/js/components/metainfo/metainfo.html',
        link: function(scope, element, attrs){
            scope.project_name = scope.projectName;
            scope.project_description = scope.projectDescription;
            scope.project_meta = scope.projectMeta;

        }
    }
}]);