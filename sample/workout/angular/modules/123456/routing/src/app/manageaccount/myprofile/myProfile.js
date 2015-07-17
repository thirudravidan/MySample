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
 angular.module( 'activei.myprofile', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'myprofile', {
    url: '/myprofile',
  views:{      
      "RightView":{
        templateUrl:"manageaccount/myprofile/myProfileRight.tpl.html",
        controller:"myProfileRightController" 
    }
    },
    data:{ pageTitle: 'My Profile' }
  });
})

/**
 * And of course we define a controller for our route.
 */

.controller( 'myProfileRightController', function myProfileRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) { 
  $rootScope.isMiddleCont = true; 
  $scope.newPassword="";
  // $scope.productDetails = { 
  //   data: 'productData',
  //   columnDefs: [{field: 'ProductWarranty', displayName: 'Product Warranty', width: "30%"}, {field:'CountryPurchase', displayName:'Country Purchase', width: "40%"},{field:'PurchaseDate', displayName:'Purchase Date', width: "30%"},{field:'ProductExpired', displayName:'Product Expired', width: "30%"}]
  //   };
      $scope.bindcustomerDetails=function()
      {      
        getcustomerDetails($scope,$http,$cookieStore,$rootScope);
      }; 
      $scope.bindproductDetails=function()
      {  
        getproductDetails($scope,$http,$cookieStore,$rootScope); 
      }; 

     
    $scope.changePassword = function (formValidation) { 
    try
    {
      $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOCHANGEPWD;
      $scope.headerText=$rootScope.getglobalErrorMessage.HDRCHANGEPWD;
      $scope.confirmOk=$rootScope.getglobalErrorMessage.BTNYES;
      $scope.confirmCancel=$rootScope.getglobalErrorMessage.BTNNO;
        if (formValidation) {  
            var passNew = $scope.newPassword;
            var passCon = $scope.confirmPassword;
            var childId = $("#strmsg").hasClass('strong');
            if (!childId) {
               showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.INFOPASSSTRONG,$rootScope.getglobalErrorMessage.BTNOK);
               $('#txtnewPassword').focus();
                return;
            } else if (passNew != passCon) {
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.INFOPASSMATCH,$rootScope.getglobalErrorMessage.BTNOK);
                $('#confirmPassword').focus();
                return;
            }
          ngDialog.openConfirm(
                    {
                      template  : 'confirmdialog',
                      className : 'ngdialog-theme-default',
                      scope     : $scope
                    }
                )
                .then(function(value){ 
                  showLoader();
                var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerChangePassword";  
                var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
                var customerEmail = localStorage.getItem("CustomerEmail");
                var param = '{ "CustomerId": "'+customerId+'", "Email": "'+customerEmail+'", "NewPassword": "'+ $scope.newPassword +'"}'; //Data to server 
                
                $http.post(servicePath,param).then(function(result,status,headers,config)
                {    
                $.loader('close');

                if ($rootScope.getglobaldata.Client === 'GearHead') {
                    if(result.data.d == "0")
                    {
                       showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.SUCCESSCHANGEPWD,$rootScope.getglobalErrorMessage.BTNOK);
                    }
                    else
                    {
                      showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.ERRORCHANGEPWD,$rootScope.getglobalErrorMessage.BTNOK);
                    }
                 }
                else{
                    if(result.data.d !== '')
                  {
                     showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.SUCCESSCHANGEPWD,$rootScope.getglobalErrorMessage.BTNOK);
                  }
                  else
                  {
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRCHANGEPWD,$rootScope.getglobalErrorMessage.ERRORCHANGEPWD,$rootScope.getglobalErrorMessage.BTNOK);
                  }
                } 
                   
                }).error(function (serverResponse, status, headers, config) {
                  $.loader('close');
                  stackTrace(e);
                       // alert("failure");
                });     
                }, function(value){ 
                  
                }); 
    }
    }
    catch(e) 
    {
      // stackTrace(e);
      stackTrace('myProfileRightController','changePassword',e,$rootScope.getglobaldata.Client);
    }
      
  };

    $scope.setTab = function(ctrl){
      try
      {
        var ctrlActive = $("div[class!='tab-pane active']");
      $(ctrlActive).removeClass("active");
      $(ctrlActive).removeClass("ng-show");
      
      $(ctrl).removeClass("ng-hide");
      $(ctrl).addClass("ng-show active");
      } 
      catch(e)
      {
        // stackTrace(e);
        stackTrace('myProfileRightController','setTab',e,$rootScope.getglobaldata.Client);
      }
    };

    $scope.reset= function () {
       $scope.strengthMsg="";
    };
});
app.directive("passwordStrength", function(){
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

function getcustomerDetails($scope,$http,$cookieStore,$rootScope){
try
{
      $scope.customerid=parseInt(localStorage.getItem('StoredCustomerID'),10);
      $scope.email=localStorage.getItem("CustomerEmail");
      $scope.fname=localStorage.getItem("FirstName");
      $scope.lname=localStorage.getItem("LastName");
  // var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerSearch"; 
  //    var customerEmail = localStorage.getItem("CustomerEmail");
  //    var customerPhoneNo = "";
  //    var customerIsoCountry = "";
  //    var customerExactPhone=0;
  //    var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
  //   var param = '{ "customerId":'+ customerId +', "email": "'+customerEmail+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
  //   $http.post(servicePath,param).success(function (result)
  //   {      
  //     $scope.customerid=result.d.CustomerId;
  //     $scope.email=result.d.CustomerEmail;
  //     $scope.fname=result.d.FirstName;
  //     $scope.lname=result.d.LastName; 
  //   }).error(function (serverResponse, status, headers, config) {
  //          // alert("failure");
  //       }); 
} 
catch(e)
{
  // stackTrace(e);
  stackTrace('myProfileRightController','getcustomerDetails',e,$rootScope.getglobaldata.Client);
}
     
}
function getproductDetails($scope,$http,$cookieStore,$rootScope){ 
try
{
  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetProduct"; 
    var customerEmail = localStorage.getItem("CustomerEmail");
    var customerPhoneNo = "";
    var customerIsoCountry = "";
    var customerExactPhone=0;
    var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
    // var param = '{ "customerId":'+ customerId +', "email": "'+customerEmail+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
    var param=customerGetProduct($scope,$rootScope,customerId,customerEmail);
    
    showLoader(); 
    $http.post(servicePath, param).success(function (resp) 
        { 
            // $scope.productDetails=resp.d;
              $scope.productbuild=[]; 
              $.each(resp.d,function(key,values){
                $scope.procuctsinfo={};
                $scope.procuctsinfo.ProductName=values.ProductName;
                $scope.procuctsinfo.RegistrationId=values.RegistrationId;
                $scope.procuctsinfo.SerialNo=values.SerialNo;
                $scope.procuctsinfo.PurchaseDate=values.PurchaseDate;
                $scope.procuctsinfo.CountryPurchase=values.CountryPurchase;
                $scope.procuctsinfo.ProductExpired=values.ProductExpired;
                $scope.procuctsinfo.SwExpired=values.SwExpired;
                $scope.procuctsinfo.ProductWarranty=(values.ProductWarranty !== "") ? values.ProductWarranty : "No Warranty" ;
                $scope.productbuild.push($scope.procuctsinfo);
            });
            $scope.productDetails=$scope.productbuild;
            $('.table-responsive').slimScroll({
                wheelStep: 5,
                width: "100%",
                 height: "16.5vw"
              });
            $.loader('close');
        }).error(function (serverResponse, status, headers, config) {
          $.loader('close');
            //alert("failure");
        });

}
  catch(e)  
  {
    // stackTrace(e);
    stackTrace('myProfileRightController','getproductDetails',e,$rootScope.getglobaldata.Client);
  }  
}


