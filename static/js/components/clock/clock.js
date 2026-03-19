angular.module('SmartApp')
.directive('smoClock', [function(){
    return {
        restrict: 'E',
        scope: {
            usecounter:'@?',
            timestamp:'=?',
            frequency: '=?',
            processtime: '=?',
            format: '@?',
            api:'=?'
        },
        templateUrl: 'app/static/js/components/clock/clock.html',
        link: function(scope, element, attrs){
            //+ =============== INSERT YOUR CODE BETWEEN =================
            scope.today;
            scope.waiting_time;
            scope.clock_show = 'lastupdate';

            // Inicializar API si no existe
            scope.api = scope.api || {};

            // Exponer función pública
            scope.api.changeClockShow = function (mode) {
                scope.change_clock_show(mode);
            };

            scope.change_clock_show = function(mode){
                if (scope.usecounter === undefined) return 0;
                if (mode==null){
                    scope.clock_show = scope.clock_show == 'lastupdate' ? 'waiting_time' : 'lastupdate';
                }else{
                    console.log(['lastupdate','waiting_time'].includes(mode));
                    console.log(mode);
                    scope.clock_show = ['lastupdate','waiting_time'].includes(mode) ? mode:'lastupdate';
                }
            }

            //@ FUNCTIONS TO HELP
            function addMinutes(date, minutes, seconds) {
                date.setMinutes(date.getMinutes() + minutes);
                date.setSeconds(date.getSeconds() + seconds);
                return date;
            }

            function formatTime (seconds) {
                const minutes = Math.floor(seconds / 60);
                const remainingSeconds = Math.round(seconds % 60, 0);
                const formattedMinutes = String(minutes).padStart(2, '0');
                const formattedSeconds = String(remainingSeconds).padStart(2, '0');
                return `${formattedMinutes}:${formattedSeconds}`;
            }

            scope.formatCustomDate = function(date_str, format=scope.format) {
                if (date_str === undefined) return {};
                const date = new Date(date_str);

                // Formatear la hora en formato de 12 horas con AM/PM
                let hours = date.getHours();
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');

                let time_system = '';
                if (format === '12h'){
                    time_system = hours >= 12 ? 'PM' : 'AM';
                    hours = hours % 12;
                    hours = hours ? hours : 12; // El '0' debe ser '12'
                }
                const time = `${hours.toString().padStart(2, '0')}:${minutes}:${seconds}`;

                // Obtener el nombre del día de la semana
                const daysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
                const dayOfWeek = daysOfWeek[date.getDay()];

                // Obtener el día del mes y el año
                const day = date.getDate().toString().padStart(2, '0');
                const year = date.getFullYear();

                // Obtener el nombre del mes en español
                const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
                const month = months[date.getMonth()];

                // Formatear la fecha en "Día, DD Mes YYYY"
                const formattedDate = `${dayOfWeek}, ${day} ${month} ${year}`;
                scope.today = dayOfWeek;

                return {
                    date: formattedDate,
                    time: time,
                    month: month.toUpperCase(),
                    time_system: time_system
                };
            };

            scope.askForWaitingTime = function(){
                const next_tentative_update_time = addMinutes(new Date(scope.timestamp), scope.frequency, scope.processtime+10); /*extra ten seconds*/ 
                const seconds_to_wait = Math.max(next_tentative_update_time - new Date(), 0) / 1000;
                return formatTime(seconds_to_wait);
            };

            scope.time_counter = function(){
                scope.waitingTImeInterval = setInterval(function(){
                    scope.$apply(function(){
                        scope.waiting_time = scope.askForWaitingTime();
                    });
                }, 1000);
            };

            scope.check_day = function(day){
                return day === scope.today ? true : false;
            };

            attrs.usecounter !== undefined ? scope.time_counter() : false;
            //+ =============== INSERT YOUR BETWEEN =================
        }
    }
}]);
