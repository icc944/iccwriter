angular.module('Writter')
.service('ManageProject',['AdviceService', function(AdviceService){

    this.STORAGE_KEY='projects_metadata';


    this.save = function(data, key=this.STORAGE_KEY){
        localStorage.setItem(key, JSON.stringify(data));
        AdviceService.toastAdvice({message:'Proyecto guardado'});
    }

    this.load = function(key=this.STORAGE_KEY){
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
}]);