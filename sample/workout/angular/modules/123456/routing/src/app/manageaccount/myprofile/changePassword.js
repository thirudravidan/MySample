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
angular.module( 'activei.changepassword', ['ui.router','plusOne','globalData'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'changepassword', {
    url: '/changepassword',
	views:{
      "LeftView":{
        templateUrl:"manageaccount/changepassword/changePasswordLeft.tpl.html",
        controller:"changePasswordLeftController"
      },
      "RightView":{
        templateUrl:"manageaccount/changepassword/changePasswordRight.tpl.html",
        controller:"changePasswordRightController"
		
		}
      
    },
    data:{ pageTitle: 'changePassword' }
  });
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'changePasswordLeftController', function changePasswordLeftController( $scope,$http ) {
})
.controller( 'changePasswordRightController', function changePasswordRightController( $scope,$rootScope,$http, $state,$cookieStore ) {
 $scope.changePassword = function (formValidation) {
 
        if (formValidation) {
		

          /*  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerLogin";
            var param = { "email": $scope.UserName, "password": $scope.Password }; /* PostData*/
           /* $scope.LoadingShow = true;

					
                                    $http.post(servicePath, param).success(function (result, status, headers, config) {
                                        // Updating the $scope postresponse variable to update theview
										
                                        $scope.ServerResponse = result.d;
                                        $scope.LoadingShow = false;
                                        //                $('#dvLoader').hide();
                                        if ($scope.ServerResponse.CustomerId == '22933063') {
                                            //                    debugger;
                                            $cookieStore.put('StoredCustomerID', $scope.ServerResponse.CustomerId);
                                            //                    $cookies.loggedUserFirstName = $scope.ServerResponse.FirstName;
                                            $state.go('home');
                                        }
                                        else {
                                            //window.location.href = "../Views/ChangePassword.htm";

                                           alert('Inavalid UserName or Password');

                                        }

                                    }).error(function (serverResponse, status, headers, config) {
                                        alert("failure");
                                    });*/


                   }

    };
$scope.reset= function () {
   $scope.strengthMsg="";
};
})
.directive("passwordStrength", function(){
    return {        
        restrict: 'A',
        link: function(scope, element, attrs){                    
            scope.$watch(attrs.passwordStrength, function(value) {

                if(angular.isDefined(value) && value.length!== 0){
                  password=value;
                  score=0;
                  var spChar = false;
                  var upperCa = false;
                  var lowerCa = false;
                  var numberExis = false;

                //password has number
                if ((/(.*[0-9])/).test(password)) { score += 5; numberExis = true; }

                //password has symbol
                if ((/(.*[!,@,#,$,%,^,&,*,),(])/).test(password)) {score += 5;spChar = true;}

                //password has Upper chars
                if ((/(.*[A-Z])/).test(password)) { score += 10; upperCa = true; }

                //password has Lower chars
                if ((/(.*[a-z])/).test(password)) { score += 10; lowerCa = true;}

                //password has number and chars
                if ((/([a-zA-Z])/).test(password) && (/([0-9])/).test(password)) {score += 15;}

                //password has number and symbol
                if ((/([!,@,#,$,%,^,&,*,),(])/).test(password) && (/([0-9])/).test(password)) { score += 15;}

                //password has char and symbol
                if ((/(.*[!,@,#,$,%,^,&,*,),(])/).test(password) && (/([a-zA-Z])/).test(password)) { score += 15;}

                //password is just a numbers or chars
                if ((/^\w+$/).test(password) || (/^\d+$/).test(password)) {score -= 10; }

                //verifying 0 < score < 100
                if (score < 0) { score = 0; }
                if (score > 100) { score = 100; }

                if (password.length < 2 && score < 34) { 
                   strengthMsg = "Too Short";
                   scope.strength = 'weak';}
                else if (!(/^[A-Za-z0-9!@#$%^&*()]*$/).test(password)) { 
                   strengthMsg = 'Allowed Special characters are ! @ # $ % ^ & * ) (';
                   scope.strength="weak";
                  }
                else if (score < 34) {
                   strengthMsg = "Weak";
                   scope.strength = 'weak';}
                else if (password.length < 6 || spChar === false || upperCa === false || lowerCa === false || numberExis === false) { 
                   strengthMsg = "Good";
                   scope.strength = 'good';}
                else{
                   strengthMsg = "Strong";
                   scope.strength = 'strong';
                    }
                scope.strengthMsg="This password is "+ strengthMsg + " !";
                }
              else{
                scope.strengthMsg="";
               }
                
        });
    }
  };
});


