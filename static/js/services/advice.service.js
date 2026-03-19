angular.module('Writter')
.service('AdviceService', ['$rootScope','$mdToast', function($rootScope, $mdToast){

    this.toastAdvice = function({message, btn_close=false}){
        let toast_config=null;
        if(btn_close){
            toast_config = $mdToast.simple()
                .textContent(message)
                .action('OK')
                .actionKey('k')
                .highlightAction(true)
                .position("bottom right")
                .hideDelay(3000)
        }else{
            toast_config = $mdToast.simple()
                .textContent(message)
                .position("bottom right")
                .hideDelay(3000)
        }
        return $mdToast.show(toast_config);
    }

    this.load = function() {
		console.log('👋 AdviceService cargado correctamente');
	};
}]);