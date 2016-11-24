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
angular.module( 'activei.managerouter', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'managerouter', {
    url: '/managerouter',
  views:{
           "RightView":{
        templateUrl:"systemtools/managerouter/managerouter.tpl.html",
        controller:"manageRouterRightController"
    
    }
    },
    data:{ pageTitle: 'Manage Router' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'manageRouterRightController', function manageRouterRightController( $scope ,$rootScope,$http,$state,ngDialog) {
  $rootScope.isMiddleCont = true;
  $scope.header='Manage Router';
   // var isValidIP=window.external.checkvalidIP();
  $('#background_logo').removeClass().addClass('cont_bg_logo');   
    var headerText = "Router Login";
    var buttonText = "Ok";
    var messageText=''; 
    $scope.isLoginshow=false;
    $scope.isDevDetails=false;
    $scope.checkAuthentication=function(){  
      $rootScope.checkisValidIp=true;
      // var isValidIP=window.external.checkvalidIP();
      // var isValidIP=true;
      if ($rootScope.ischeckingValidIP) {
      $scope.txtUserName=($rootScope.userDetails.RouterUserName !== '') ? $rootScope.userDetails.RouterUserName:'admin';
      $scope.txtPassword=($rootScope.userDetails.RouterPassword !== '') ? $rootScope.userDetails.RouterPassword:'password';
      $scope.isuserNameDisabled=true;
      $scope.isPasswordDisabled=true;
      $scope.isLoginDisabled=true;
      $scope.isLoginshow=true;
      $scope.isDevDetails=false;
      $scope.isstepsShow=false;
          var isAuthenticated= window.external.routerAuthentication($scope.txtUserName,$scope.txtPassword);
          // isAuthenticated=0;
          if (isAuthenticated === 0) {
              $scope.isLoginshow=false;
               $scope.isDevDetails=true;
              $scope.header='Router Information';
              // var logDetails=window.external.getRouterLog();          
              // $scope.logData=JSON.parse(logDetails);
              var deviceDetails = window.external.getRouterDeviceDetails();
              $scope.$watch('isNetwokAvail',function(){

                $rootScope.userDetails.IsNetwork=($rootScope.isNetwokAvail) ? 'True':'False';
                $scope.isNetworkAvailable=($rootScope.isNetwokAvail) ? false:true;                
                $scope.NetworkIcon=(($rootScope.isNetwokAvail)?'Switch Round On':'Switch Round Off');
                $scope.NetworkTitle=(($rootScope.isNetwokAvail)?'Online':'Offline');
                 $("#networkstatus").removeClass('net_off network_init').addClass(($rootScope.isNetwokAvail === true) ? 'net_on' : 'net_off');      // var routerSteps = window.external.getRouterRestorationSteps();
                  if ($rootScope.isNetwokAvail) {
                      $scope.msgDescription='Your are connected to the internet .so there are no fixes available at the moment';
                      $scope.headerText='Mange Router';
                      ngDialog.openConfirm(
                      {
                          template: 'successdialog',
                          className: 'ngdialog-theme-default',                     
                          scope: $scope
                      }                
                      )
                      .then(function(value){
                          localStorage.setItem('StoredCustomerID', '');
                          $state.go('login');
                      }, function(value){
                      }); //End ngDialog.open   
                  }else{
                      $scope.enableBackgroundProcess();
                  }

             });
              $rootScope.isNetwokAvail= window.external.isNetworkAvail();
              // $rootScope.isNetwokAvail=false;
              $scope.DeviceDet=JSON.parse(deviceDetails);
          }
          else if(isAuthenticated === 401){
            $scope.header='Router Login';
            $scope.txtUserName='';
            $scope.txtPassword='';
            $scope.isuserNameDisabled=false;
            $scope.isPasswordDisabled=false;
            $scope.isLoginDisabled=false;        
            messageText= "Authentication failed. Please enter correct user name and password in \"Router Mange \" page.";
            showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
                       
          }
          else if(isAuthenticated === 2){
            $scope.header='Router Login';
            messageText= "Router is not connected";
            showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
          }

      }    

    };

    $scope.enableBackgroundProcess=function(){
      showLoader();
      $scope.isstepsShow=true;
      window.external.doAutomaticTroubleshoot();
      $rootScope.isNetwokAvail= window.external.isNetworkAvail();
      // $rootScope.isNetwokAvail=false;
      $.loader('close');
      $("#networkstatus").removeClass('net_off network_init').addClass(($rootScope.isNetwokAvail === true) ? 'net_on' : 'net_off');      // var routerSteps = window.external.getRouterRestorationSteps();

      // $scope.troubleshootsteps=JSON.parse(routerSteps);
    };

    $scope.routerTroubleshootsteps=function(steps){
       
      // $scope.TruobleShootSteps=steps;
      $scope.troubleshootsteps='steps dsfsdfgdfg';

      // $scope.chkisBackground=false;
      //    // messageText= strStatus;
      //    // showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
      //    // return false;
      // $scope.headerText=$rootScope.getglobalErrorMessage.HDRMNAGEROUTER;
      //  $scope.confirmOk=$rootScope.getglobalErrorMessage.BTNOK;
      // if (strStatus === 'AUTOCONFIG') {
      //       $scope.msgDescription='1. Check with direct connection from modem to PC.   if your online (PC LAN adapter status is good)then, 2. Connect the PC back to the router LAN Port. 3. Try to Swap the cable, 4. Check with different Ethernet cable, 5. Try with different LAN port, 6. Disable and Enable LAN adapter';
      //        showRouterStatus($scope, ngDialog);

      //       // ngDialog.openConfirm({
      //       //   template: 'remotesupportdialog',
      //       //   className: 'ngdialog-theme-default',                     
      //       //   scope: $scope
      //       // }).then(function(value){
      //       //   $scope.msgDescription='2. Connect the PC back to the router LAN Port';
      //       //     ngDialog.openConfirm({
      //       //       template: 'remotesupportdialog',
      //       //       className: 'ngdialog-theme-default',                     
      //       //       scope: $scope
      //       //     }).then(function(value){
      //       //         $scope.msgDescription='3. Try to Swap the cable';
      //       //         ngDialog.openConfirm({
      //       //           template: 'remotesupportdialog',
      //       //           className: 'ngdialog-theme-default',                     
      //       //           scope: $scope
      //       //         }).then(function(value){
      //       //              $scope.msgDescription='4. Check with different Ethernet cable';
      //       //               ngDialog.openConfirm({
      //       //                 template: 'remotesupportdialog',
      //       //                 className: 'ngdialog-theme-default',                     
      //       //                 scope: $scope
      //       //               }).then(function(value){
      //       //                     $scope.msgDescription='5. Try with different LAN port';
      //       //                     ngDialog.openConfirm({
      //       //                       template: 'remotesupportdialog',
      //       //                       className: 'ngdialog-theme-default',                     
      //       //                       scope: $scope
      //       //                     }).then(function(value){
      //       //                         $scope.msgDescription='6. Disable and Enable LAN adapter';
      //       //                         ngDialog.openConfirm({
      //       //                           template: 'remotesupportdialog',
      //       //                           className: 'ngdialog-theme-default',                     
      //       //                           scope: $scope
      //       //                         }).then(function(value){
                                     
      //       //                         }, function(value){

      //       //                         });
      //       //                     }, function(value){

      //       //                     });
                           
      //       //               }, function(value){

      //       //               });
                     
      //       //         }, function(value){

      //       //         });
                 
      //       //     }, function(value){

      //       //     });
      //       // }, function(value){

      //       // });
      // }
      // else if (strStatus === 'PUBLICIP') {
      //   $scope.msgDescription='1. Check the Physical Connection between the PC and the router. 2. Check whether the modem is connected to the WAN(isolated) slot of the router. 3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route. 4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router. ';
      //   ngDialog.openConfirm({
      //                       template: 'remotesupportdialog',
      //                       className: 'ngdialog-theme-default',                     
      //                       scope: $scope
      //                     }).then(function(value){                               
                           
      //                     }, function(value){

      //                     });
      //                     // $scope.msgDescription='1. Check the Physical Connection between the PC and the router';
      //       // ngDialog.openConfirm({
      //       //   template: 'remotesupportdialog',
      //       //   className: 'ngdialog-theme-default',                     
      //       //   scope: $scope
      //       // }).then(function(value){
      //       //   $scope.msgDescription='2. Check whether the modem is connected to the WAN(isolated) slot of the router';
      //       //     ngDialog.openConfirm({
      //       //       template: 'remotesupportdialog',
      //       //       className: 'ngdialog-theme-default',                     
      //       //       scope: $scope
      //       //     }).then(function(value){
      //       //         $scope.msgDescription='3. If the modem is connected directly to the PC, disconnect the cable from the PC and connect it to the WAN(Isolated) Slot of the route.';
      //       //         ngDialog.openConfirm({
      //       //           template: 'remotesupportdialog',
      //       //           className: 'ngdialog-theme-default',                     
      //       //           scope: $scope
      //       //         }).then(function(value){
      //       //              $scope.msgDescription='4. Then use a different Ethernet cable to connect the PC to the any one of the LAN slot of the router';
      //       //               ngDialog.openConfirm({
      //       //                 template: 'remotesupportdialog',
      //       //                 className: 'ngdialog-theme-default',                     
      //       //                 scope: $scope
      //       //               }).then(function(value){                               
                           
      //       //               }, function(value){

      //       //               });
                     
      //       //         }, function(value){

      //       //         });
                 
      //       //     }, function(value){

      //       //     });
      //       // }, function(value){

      //       // });

      // }
      // else if (strStatus === 'PCONLINE') {
      //     $scope.msgDescription='Your issue resolved...';
      //      showRouterStatus($scope,ngDialog);
      // }
      //  else if (strStatus === 'POWERCYCLE') {
      //     $scope.msgDescription='Power cycle your network';
      //     showRouterStatus($scope,ngDialog);
      // }
      // else if (strStatus === 'RESETROUTER') {
      //     $scope.msgDescription='Hard & On/Off reset your router';
      //      showRouterStatus($scope,ngDialog);
      // }
      // else if (strStatus === 'SUCCESS') {
      //     $scope.msgDescription='No issues found.You are connected to Internet';
      //     showRouterStatus($scope,ngDialog);
      // }
      // else if (strStatus === 'FAILED') {
      //     $scope.msgDescription='Authentication failed. Please enter correct user name and password in \"Router Mange \" page.';
      //     showRouterStatus($scope,ngDialog);
      // }
      //  else if (strStatus === 'CHECKROUTER') {
      //     $scope.msgDescription='Please check whether router connected with your device or not';
      //     showRouterStatus($scope,ngDialog);
      // }
          

    };

  });

function routerRestorationStatus(strStatus)
{
   angular.element(document.getElementById("rightCont")).scope().routerTroubleshootsteps(strStatus);
   event.preventDefault();
}

function routertroubleShoot(str)
{
   angular.element(document.getElementById("rightCont")).scope().routerTroubleshootsteps(str);
}

function showRouterStatus($scope,ngDialog){
    ngDialog.openConfirm({
              template: 'remotesupportdialog',
              className: 'ngdialog-theme-default',                     
              scope: $scope
            }).then(function(value){                               
             
            }, function(value){

      });
}


