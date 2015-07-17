/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module( 'activei.chat', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'chat', {
    url: '/chat',
	views:{      
      "RightView":{
        templateUrl:"support/chat/chatright.tpl.html",
        controller:"chatRightController"	
		}
    },
    data:{ pageTitle: 'Chat' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'chatRightController', function chatRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {
  $rootScope.isMiddleCont = true;  
    // var url = $rootScope.getglobaldata.chatURL + $cookieStore.get('FirstName') + '/last_name/' + $cookieStore.get('LastName') + '/email/' + $cookieStore.get('CustomerEmail');
    if ($rootScope.getglobaldata.Client ==='GearHead') {
      url = 'http://kb.netgear.com/app/chat/chat_landing/cat/1520/first_name/' + localStorage.getItem("FirstName") + '/last_name/' + localStorage.getItem("LastName") + '/email/' + localStorage.getItem("CustomerEmail");
    }
    else{
       url = $rootScope.getglobaldata.chatURL+"?name="+ localStorage.getItem('FirstName')+"&email="+localStorage.getItem('CustomerEmail');    
    }
    
    $("#frame").attr("src", url); 

    $('#frame').ready(function () {
        showLoader();
    });

    $('#frame').load(function () {
      $.loader('close');
    });

});
 
