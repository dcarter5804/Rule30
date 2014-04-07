//var userApp = angular.module('UserApp',['ngRoute']);

angular.module('Rule30', 
	[
		 'ngRoute',
		 'ui.bootstrap',
		 
		 /* Services */
         'Rule30.modal',
		 
		 /* Controllers */
         'Rule30.base',
                     	
         /* Factories */
         'Rule30.configurations',
         
         /* Directives */
         'Rule30.directives.components'         
    ]
)
.config(function ($routeProvider) {
	// Application Routes
	$routeProvider.when('/rule30', {templateUrl : 'partials/base.html', controller : 'Base'});
	$routeProvider.otherwise({redirectTo : '/rule30'});	
});