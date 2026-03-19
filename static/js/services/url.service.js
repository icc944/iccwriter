angular.module('Writter')
.service('UrlService', [function () {
    this.getLastPart = function () {
        const url = location.href;
        const lastSlashIndex = url.lastIndexOf('/');
        const lastPart = url.substring(lastSlashIndex + 1);
        return lastPart;
    };

    this.getCurrentView = function (default_view) {
        const lastPart = this.getLastPart();
        const viewPart = lastPart.split('#')[0].split('?')[0];
        const view = viewPart || default_view;
        return view.toLowerCase();
    };

    this.getParameters = function () {
        const lastPart = this.getLastPart();
        let questionIndex = lastPart.indexOf('?');
        if (questionIndex === -1) {
            return {};
        }

        let hashIndex = lastPart.indexOf('#');
        if (hashIndex === -1) {
            hashIndex = undefined;
        }

        const paramsArray = lastPart.substring(questionIndex + 1, hashIndex).split("&");
        const params = {};

        for (var i = 0; i < paramsArray.length; i++) {
            const splitted = paramsArray[i].split("=");
            const key = decodeURIComponent(splitted[0]);
            const value = decodeURIComponent(splitted[1]);
            params[key] = value;
        }
        return params;
    };

    this.searchParameter = function (param, default_value) {
        const params = this.getParameters();
        const searchedValue = params[param] || default_value;
        return searchedValue;
    };

    this.load = function() {
		console.log('👋 UrlService cargado correctamente');
	};
}]);
