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
angular.module('activei.login', ['ui.router', 'plusOne', 'ngDialog'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        views: {
            "RightView": {
                templateUrl: "login/loginRight.tpl.html",
                controller: "loginRightController"
            }

        },
        data: { pageTitle: 'Login' }
    })
    .state("forgetpassword", {
        url: "/forgetpassword",
        views: {
            'RightView': {
                templateUrl: 'login/forgetpassword.tpl.html',
                controller: "loginRightController"
            }
        }
    });
})
.run(function run($rootScope, $http, $window) {
    //Read global config data from JSON and hold it in rootscope 

    $http.get('assets/StaticResources/promotionDetails.txt').then(function (response) {
        $rootScope.promodetails = response.data;

    });


    $http.get('assets/StaticResources/productDetailsNew.txt').then(function (response) {
        $rootScope.productDetNew = response.data;

    });


    $http.get('assets/StaticResources/productDetails.txt').then(function (response) {
        $rootScope.prodDetail = response.data; 

    });

}
)

.controller('loginRightController', function loginRightController($scope, $rootScope, $http, $state, ngDialog) {
    $.loader('close');
    $rootScope.isMiddleCont = false;
    $rootScope.feedbackshow = false;
    $scope.showlogin = true;
    $("#dvleftcontent").hide();
    contentHide();
    $('#background_logo').removeClass().addClass('cont_bg_logo_home');
    $rootScope.iscontractTextShow = false;
    $rootScope.iswelcomeTextShow = false;
    $rootScope.isremainingdayTextShow = false;
    $rootScope.customer_care_support = false;
    $rootScope.istollFreeNumber=false;
    $rootScope.isContactSupport=false;
  
      

    $scope.redirectToHome=function(){
  try{
  // var usrDetails = window.external.getUserDetails();
  //var usrDetails ="";

   var usrDetails = window.external.getUserDetails();
  $rootScope.userDetails=JSON.parse(usrDetails);
  $scope.offlineGlobalData=offlineGlobalData;
  $scope.offlineGlobalMenuData=offlineGlobalMenuData;
  $scope.offlineGlobalErrorMessage=offlineMessageData;
  $rootScope.getglobaldata =$scope.offlineGlobalData;
  $rootScope.getglobalmenudata =$scope.offlineGlobalMenuData.menus;
  $rootScope.getglobalErrorMessage =$scope.offlineGlobalErrorMessage;
  $rootScope.promodetails = promotionDetails;
  $rootScope.prodDetail = productDetails ;
  $rootScope.productDetNew = productDetailsNew;

  if (offlineGlobalData.Client === 'GearHead') {
         $rootScope.tollfreeno = $rootScope.getglobaldata.gearHeadtollfree;
      }
      else{
        $rootScope.tollfreeno = $rootScope.getglobaldata.activeitollfree; 
      }
  // $rootScope.userDetails=JSON.parse(usrDetails);
  $rootScope.versionInfo=$rootScope.getglobaldata.versionInfo;
   }
catch(e){
  // stackTrace(e);
  stackTrace('loginRightController','redirectToHome',e,$rootScope.getglobaldata.Client);
}
};

    $scope.forgetpasswordcheck = function () {
        var serviceUrl = $rootScope.getglobaldata.getGlobalServiceUrl;
        $scope.forgetPassword(serviceUrl);
    };

    $scope.rememberPass = function () {
        // ng-init="rememberPass();" 
        try {
            // if($rootScope.userDetails.IsNetwork === 'True') {
            var userDet = window.external.savedPassword();
            if (userDet[0] !== null) {
                if (($rootScope.userDetails.IsNetwork === 'False') && userDet[3] === 'false') {
                    $state.go('home');
                }
                else {
                    if (userDet[3] === "true" && userDet[2] === "true") {

                        $scope.showlogin = true;
                        $scope.txtUserName = userDet[0];
                        $scope.txtPassword = userDet[1];
                        $scope.chkremembermeval = true;
                    }
                    else if (userDet[3] !== "true") {
                        if ($rootScope.userDetails.IsNetworkChanged === 'False' && $rootScope.userDetails.IsNetwork === 'False') {
                            $scope.chkremembermeval = false;
                            $state.go('home');
                        }
                        else {
                            // alert($rootScope.getglobaldata);
                            // var servUrl="http://devis.csscorp.com/CSSConnect/CSSConnectClientService/NetgearClientService.asmx/";
                            // var servUrl="http://activei.csscorp.com/AJCSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/";
                            // var servUrl="http://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/";
                            $scope.chkremembermeval = true;
                            $scope.txtUserName = (userDet[2] === "true") ? userDet[0] : '';
                            $scope.txtPassword = (userDet[2] === "true") ? userDet[1] : '';
                            var servUrl = $rootScope.getglobaldata.getGlobalServiceUrl;
                            $scope.userloginSer(userDet[0], userDet[1], servUrl);
                        }
                    }
                    else {
                        $scope.showlogin = true;
                    }
                }
            }
            else {
                $scope.chkremembermeval = false;
                $scope.showlogin = true;
            }
            // }
        }
        catch (e) {
            // stackTrace(e);
            stackTrace('loginRightController','rememberPass',e,$rootScope.getglobaldata.Client);
        }
    };

    $scope.redirectToForgetPassword = function () {
        if ($rootScope.userDetails.IsNetwork === 'True') {
            $rootScope.isnewpage = true;
            $state.go('forgetpassword');
        }
        else { 
            var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
            var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
            var messageText= ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING : $rootScope.getglobalErrorMessage.OFFLINEWARNING; 
            showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
        }
    };
    $scope.refreshforgetpassword = function () {
        $state.go('login');
    };

    //get user details when click login button
    $scope.getUserDetails = function (formValidation) {
        try {
            if (formValidation) {
                var usernameVal = $scope.txtUserName;
                var passwordVal = $scope.txtPassword;
                var serviceUrl = $rootScope.getglobaldata.getGlobalServiceUrl;
                $scope.userloginSer(usernameVal, passwordVal, serviceUrl);
            }   //formValidation End 
        }
        catch (e) {
            // stackTrace(e);
            stackTrace('loginRightController','getUserDetails',e,$rootScope.getglobaldata.Client);
        }
    };

$scope.userloginSer = function(usernameVal,passwordVal,serviceUrl)
{
    try{
    if ($rootScope.userDetails.IsNetwork === 'True') {
      
        if (localStorage.getItem('StoredCustomerID') !=='' && localStorage.getItem('StoredCustomerID')!==null) {
             // var params = { username: localStorage.getItem("StoredCustomerID"), macAdd: $rootScope.myinfo.MACAddress, status: 1 };
             var params = { };
        //alert(JSON.stringify(params));
            
            // logDeviceStatus($rootScope, $scope,$http,$state);
            
            $state.go('home');
        }
        else{
         var servicePath = serviceUrl + "CustomerLogin";
          var param = '{ "email": "'+usernameVal+'", "password":  "'+passwordVal+'"}'; /* PostData*/
          $scope.LoadingShow = true;
          showLoader();
          $http.post(servicePath, param).success(function (result, status, headers, config) {
              // Updating the $scope postresponse variable to update theview
              $scope.ServerResponse = result.d;
              $scope.LoadingShow = false;
              if (result.d.SessionId===null) {
                  $.loader('close');
                  var messageText=$rootScope.getglobalErrorMessage.WRNUSER;
                  var headerText=$rootScope.getglobalErrorMessage.WRNHDRLOGIN;
                  var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
                  //Show the info message
                   $scope.showlogin=true;
                   $rootScope.customer_care_support=false;
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
                  
              }
              else {
                  localStorage.setItem("Username", usernameVal);
                  localStorage.setItem('StoredCustomerID', $scope.ServerResponse.CustomerId);
                  localStorage.setItem("CustomerEmail", $scope.ServerResponse.CustomerEmail);
                  localStorage.setItem("PortalId", $scope.ServerResponse.PortalId);
                  var firstName=$scope.ServerResponse.FirstName.replace(" ", "+");
                  $rootScope.userDetails.UserFirstName = firstName;
                  localStorage.setItem("FirstName", firstName);
                  var lastName=$scope.ServerResponse.LastName.replace(" ", "+");
                  localStorage.setItem("LastName", lastName);
                  localStorage.setItem("Country", $scope.ServerResponse.Country);

                  var servicePath = serviceUrl + "GetContractsAvailabilitybyCustomerId";
                  var param = '{ "customerId":"' + parseInt($scope.ServerResponse.CustomerId,10) + '"}'; /* PostData*/
                  $http.post(servicePath, param).success(function (result, status, headers, config) {
                      $scope.contractsAvailabilityData=result.d;
                    var remainingDays= $scope.contractsAvailabilityData.RemainingDays;
                    if ($scope.chkremembermeval) {
                        window.external.rememberPassword(usernameVal, passwordVal,true,firstName,remainingDays.toString(),$scope.contractsAvailabilityData.ContractAvailability.toString());
                     }
                     else
                     {
                        window.external.rememberPassword(usernameVal, passwordVal,false,firstName,remainingDays.toString(),$scope.contractsAvailabilityData.ContractAvailability.toString());
                     }
                      localStorage.setItem("ContractAvailability", $scope.contractsAvailabilityData.ContractAvailability);
                      localStorage.setItem("RemainingDays", remainingDays);
                      localStorage.setItem("ContractId", $scope.contractsAvailabilityData.ContractId);
                      $rootScope.userDetails.ContractAvailability = $scope.contractsAvailabilityData.ContractAvailability;
                      $rootScope.userDetails.RemainingDays = localStorage.getItem("RemainingDays", remainingDays);

                      window.external.setLoginDetails(usernameVal);
                      // // Device log status
                      // var myinfo = window.external.getMyMachineInfo();
                      // myinfo = JSON.parse(myinfo);
                      // $rootScope.myinfo = myinfo;

                      //alert($scope.myinfo.MACAddress);
                      // var PostData = { username: localStorage.getItem("StoredCustomerID"), macAdd: $rootScope.myinfo.MACAddress, status: 1 };
                      var PostData = { };
                      //alert(JSON.stringify(params));
                      
                      logDeviceStatus($rootScope, $scope,$http,$state);

                      $.loader('close');
                      $state.go('home');

                  }).error(function (serverResponse, status, headers, config) {
                    $.loader('close');
                      // alert("failure");
                  });
              }

          }).error(function (serverResponse, status, headers, config) {
            $.loader('close');
            //   alert("failure");
          }); 
        }

        //Network Mapping Status Trigger
        //alert($rootScope.getglobaldata.getServiceURL);
    
    }
    else{

      var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
      var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
      var messageText= ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING : $rootScope.getglobalErrorMessage.OFFLINEWARNING; 
      showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
    }
}catch(e){
    // stackTrace(e);
    stackTrace('loginRightController','userloginSer',e,$rootScope.getglobaldata.Client);
}
};

    
$scope.redirectToForgetPassword=function()
  { 
    if ($rootScope.userDetails.IsNetwork === 'True') {
      $rootScope.isnewpage=true;
      $state.go('forgetpassword');
    }
    else
    {
      var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
      var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
      var messageText= ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING : $rootScope.getglobalErrorMessage.OFFLINEWARNING; 
      showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
    }
  };
$scope.refreshforgetpassword=function()
{
  $state.go('login');
};

//get user details when click login button
$scope.getUserDetails = function (formValidation) { 
  try
  {
     if (formValidation) {
      var usernameVal=$scope.txtUserName;
      var passwordVal=$scope.txtPassword;
      var serviceUrl =$rootScope.getglobaldata.getGlobalServiceUrl;
      $scope.userloginSer(usernameVal,passwordVal,serviceUrl);
      }   //formValidation End 
  }
catch(e){
  // stackTrace(e);
  stackTrace('loginRightController','getUserDetails',e,$rootScope.getglobaldata.Client);
}
};

    $scope.forgetPassword = function (serviceUrl) {
        try {   
                var email = $("#txtEmail").val();
                if($("#txtEmail").val() ==='') {
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFORGETPASS,'Please Enter the Email Id',$rootScope.getglobalErrorMessage.BTNOK);           
                  return false;
                } 
                if( !validateEmail(email)){
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFORGETPASS,'Please Enter valid Email Id',$rootScope.getglobalErrorMessage.BTNOK);           
                  return false;
                }                  
                var servicePath = serviceUrl + "CustomerForgetPasswordRecovery";
                var param = { email: $scope.txtEmail };
                showLoader();
                $http.post(servicePath, param).then(function(result, status, headers, config) {
                  $.loader('close'); 
                  if(result.data.d !== '')
                  {
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFORGETPASS,$rootScope.getglobalErrorMessage.SUCCESSFORGETPASS,$rootScope.getglobalErrorMessage.BTNOK);
                  }
                  else
                  {
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFORGETPASS,$rootScope.getglobalErrorMessage.ERRORFORGETPASS,$rootScope.getglobalErrorMessage.BTNOK);
                  } 

                }).error(function (e) {
                    $.loader('close');
                });
              //formValidation End 
        }
        catch (e) {
          $.loader('close'); 
            // stackTrace(e);
            stackTrace('loginRightController','forgetPassword',e,$rootScope.getglobaldata.Client);
        }
    };

});



function logDeviceStatus($rootScope, $scope,$http,$state) {
  // Device log status
    var myinfo = window.external.getMyMachineInfo();
    myinfo = JSON.parse(myinfo);
    $rootScope.myinfo = myinfo;
    var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetNetworkMapDeviceDetails";
    var param = { ipAddress: $rootScope.myinfo.IPAddress };
    $rootScope.getConnectedDevices=window.external.loaddevices();   
    
    $http.post($rootScope.getglobaldata.getGlobalServiceUrl + "GetNetworkMapDeviceDetails", param).success(function(result, status, headers, config) {
      
        $rootScope.ConnectedDeviceDetails=result.d;
        // var devDet=JSON.parse($rootScope.ConnectedDeviceDetails.DeviceDetails);

        // alert($rootScope.ConnectedDeviceDetails);
        
        if ($rootScope.ConnectedDeviceDetails === null) { 
                     
            var networkParam={ipAddress:$rootScope.myinfo.IPAddress,networkMapDetails:$rootScope.getConnectedDevices};
            $http.post($rootScope.getglobaldata.getGlobalServiceUrl + "SaveNetWorkMapDetails", networkParam).success(function(netresult, status, headers, config) {
              
            }).error(function(e){
              alert('Error');
            });
          
        }
        else{
          alert('Devices Available');
            // alert(JSON.stringify($rootScope.ConnectedDeviceDetails.DeviceList));
        }
        

    }).error(function (e) {
        
    });

 // addmydevice($scope, $rootScope);
    //        $.ajax({
    //     type: "POST",
    //     url: $rootScope.getglobaldata.getServiceURL + "getLogDevice",
    //     data: params,
    //     success: function (d) {
    //       alert(d.success);
    //         if (d.success) {
    //             // alert('in');
    //         }
    //         else {
    //             addmydevice($scope, $rootScope);
    //         }
    //     },
    //     error: function (e) {
    //        // alert("failed");
    //     }
    // });
}

function addmydevice($scope, $rootScope) {
    try {
        var connectedDev = window.external.loaddevices();
        var parsedDevices = JSON.parse(connectedDev);
        $scope.parsedDeviceList = parsedDevices;
        $scope.devList = parsedDevices.DeviceList;
        

        $.each($scope.devList.LANList, function (idx, rec) {
            rec.Class = 'new';
        });

        $.each($scope.devList.USBList, function (idx, rec) {
            rec.Class = 'new';

        });

        $.each($scope.devList.PrinterList, function (idx, rec) {
            rec.Class = 'new';

        });

        $.each($scope.devList.NetworkAdapterList, function (idx, rec) {
            rec.Class = 'new';
        });

        var devicelist = JSON.stringify($scope.devList);

        var params = { username: localStorage.getItem("StoredCustomerID"), devType: "desktop", name: $scope.myinfo.MachineName, ipaddress: $scope.myinfo.IPAddress, macAdd: $scope.myinfo.MACAddress, devList: devicelist };
        // alert(JSON.stringify(params));
        $.ajax({
            type: "POST",
            url: $rootScope.getglobaldata.getServiceURL + "addDevice",
            data: params,
            success: function (d) {
                // alert("success");
                // getdevices($scope);
            },
            error: function (e) {
               // alert(JSON.stringify(e));
            }
        });
    }
    catch (ex) {
        // stackTrace(ex);
        stackTrace('loginRightController','addmydevice',ex,$rootScope.getglobaldata.Client);
    }
}

function validateEmail($email) {
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailReg.test( $email );
}
