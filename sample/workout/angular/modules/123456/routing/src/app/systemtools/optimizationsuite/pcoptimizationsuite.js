angular.module( 'activei.pcoptimizationsuite', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'pcoptimizationsuite', {
    url: '/pcoptimizationsuite',
	views:{
           "RightView":{
        template:"",
        controller:"pcoptimizationsuiteController"
		
		}
    },
    data:{ pageTitle: 'PC OptimizationSuite' }
  });
})
.controller('pcoptimizationsuiteController',['$scope','$rootScope','$cookieStore','$http','$state','ngDialog', function pcoptimizationsuiteController( $scope ,$rootScope,$cookieStore,$http,$state,ngDialog) {
  $rootScope.isMiddleCont = true;
// $rootScope.polyInit();
  }]);