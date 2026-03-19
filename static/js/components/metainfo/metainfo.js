angular.module('Writter')
.directive('metaInfo', [function(){
    return {
        restrict: 'E',
        scope:{
            projectMeta:'='
        },
        templateUrl:'/static/js/components/metainfo/metainfo.html',
        link: function(scope, element, attrs){
            scope.project_meta = scope.projectMeta;
            console.log(scope.projectMeta);
        }
    }
}]);