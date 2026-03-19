angular.module('Writter')
.service('DateTimeService', [function(){
	this.addMinutes = function(date, minutes) {
        date.setMinutes(date.getMinutes() + minutes);
        return date;
    }
    
    this.addSeconds = function(date, seconds) {
        date.setSeconds(date.getSeconds() + seconds);
        return date;
    }

    this.now = function() {
        return new Date();
    }

    this.toDatetime = function(str_format){
        return new Date(str_format);
    }
    
    this.strfTime = function(date_object) {
        const date = date_object.toISOString().split('T')[0];
        const time = date_object.toTimeString().split(' ')[0];
        return `${date} ${time}`;
    }

    this.strfDate = function(date_object){
        return date_object.toISOString().split('T')[0];
    }

    this.load = function() {
		console.log('👋 DateTimeService cargado correctamente');
	};
}]);