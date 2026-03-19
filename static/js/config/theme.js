angular.module('Writter')
.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('yellow')
		.backgroundPalette('blue-grey');
});