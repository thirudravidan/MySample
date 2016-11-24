//main module name have been included in like ng-app="activei" in index.html 
//then should inject the sub module names in main module
angular.module('activei', [
  'templates-app',
  'templates-common',
  'activei.changepassword',
  'activei.login',
  'activei.home',
  'activei.contactsupport',
  'activei.manageaccount',
  'activei.scheduleacall',
  'activei.webticket',
  'activei.messagecenter',
  'activei.myprofile',
  'activei.contractupgrade',
  'activei.chat',
  'activei.remotesupport',
  'activei.systemtools',
  'activei.pcoptimizationsuite',
  'activei.pcoptimization',
  'activei.firewall',
  'activei.databackup',
  'activei.parentalcontrol',
  'activei.registrycleaner',
  'activei.defragmentation',
  'activei.antivirus',
  'activei.wifitools',
  'activei.channelinterface',
  'activei.dbmgraph',
  'activei.signalstrength',
  'activei.networkdetails',
  'activei.networktools',
  'activei.networkusage',
  'activei.networkspeed',
  'activei.networkmap',
  'activei.scheduledactivities',
  'activei.knowledgebase',
  'activei.managerouter',
  'ui.router',
  'ngCookies',
  'globalData',
  'ngDialog'
])

.config(function gearHeadConfig($stateProvider, $urlRouterProvider, $provide, $httpProvider) {
    //default state resirection
    //var userDets=window.external.savedPassword();
    /*  if(userDets[0] !== null )
    {
    if(userDets[3]=== "false")
    {
    alert("1");
    //$urlRouterProvider.otherwise( '/home' );
    }
    else
    {
    alert("12");
    // $urlRouterProvider.otherwise( '/login' );
    }
    }
    else
    {
    alert("14");
    //$urlRouterProvider.otherwise( '/login' );
    }*/
  
    $urlRouterProvider.otherwise('/login');
    //reload and maintain the state when press F5
    $provide.decorator('$state', function ($delegate, $stateParams) {
        $delegate.forceReload = function () {
            return $delegate.go($delegate.current, $stateParams, {
                reload: true,
                inherit: false,
                notify: true
            });
        };
        return $delegate;
    });
  
  // $httpProvider.interceptors.push('Interceptor');

  $provide.decorator("$exceptionHandler", function($delegate) {
      return function(exception, cause) {
        $delegate(exception, cause);
        // window.external.writeClientSideError(); 
        // alert();
        // alert(new Date());
        // // alert(JSON.stringify(cause));
        // // alert(JSON.stringify(exception.message));
        // // alert(JSON.stringify(exception.stack));
        // // var dataErr = {custid: ,message: exception.message, stack : exception.stack};
        // $.post( "http://localhost:8085/error/insertErrlog/", dataErr);
      };
    });

})
.run( function run ($rootScope,$http,$window) {
//Read global config data from JSON and hold it in rootscope 

    // $httpProvider.interceptors.push('Interceptor');

})
.controller('AppCtrl', function AppCtrl($scope, $location, $rootScope, $http, $cookieStore, $state, ngDialog, $interval, $timeout) {

    $rootScope.selectedproducttype = "C3000";
    $rootScope.customer_care_support = false;
    $rootScope.feedbackshow = false;
    $rootScope.isLogout = false;
    $rootScope.kbFlag=false;
    $rootScope.isAntivirusScanned=false;
    $rootScope.isNetworkSpeed=false;
    $rootScope.wanIPDeatil='';
    $scope.ispageload=false;
    $rootScope.ischeckingValidIP=false;
    //reload and maintain the state when press F5
    // $(document).keydown(function( event ) {
    //   if ( event.which == 116 ) {
    //         $state.forceReload();
    //         event.preventDefault();
    //         }
    //   });

    // $(document).ready(function(){
    //     $(document).on("contextmenu",function(e){
    //       alert(e.target.nodeName);
    //         if(e.target.nodeName != "INPUT" && e.target.nodeName != "TEXTAREA")
    //         {
    //           e.preventDefault();
    //         }
    //      });
    //  });

    $rootScope.polyInit = function () {
        $rootScope.poly_count = 0;
        $rootScope.timeout = null;
        $rootScope.poly_arr = [];
        $rootScope.poly_arr = $.map($(new Array($(".icon-polygon:visible").length)), function (val, i) { return i; });

        $rootScope.polygon_animate($(".icon-polygon:visible")[$rootScope.poly_arr[$rootScope.poly_count]]);
    };

    $rootScope.polygon_animate = function (ele) {
        $(ele).addClass('rotateIn animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $(this).removeClass('rotateIn animated');
        });
        // clearTimeout($rootScope.timeout);
        // $timeout($rootScope.timeout_trigger(), 300);
        $timeout(function () { $rootScope.timeout_trigger(); }, 100);
    };

    $rootScope.timeout_trigger = function () {
        $rootScope.poly_count++;
        if ($rootScope.poly_count <= $(".icon-polygon:visible").length) {
            $rootScope.polygon_animate($(".icon-polygon:visible")[$rootScope.poly_arr[$rootScope.poly_count]]);
        }
    };

    //disable the right click
//    $(document).bind('contextmenu',function(e){
//       e.preventDefault();//or return false;
//    });

    //prevent back space and refresh button
    $(document).keydown(function (event) {

        if (event.which === 8) {          
            if (event.target.nodeName !== "INPUT" && event.target.nodeName !== "TEXTAREA") {
                event.preventDefault();
                return false;
            }
        }
        else if (event.which === 116) {
            event.preventDefault();
            return false;
        }
        else {
            return true;
        }
    });

    //global data declaration
    $rootScope.isMiddleCont = false;
    $rootScope.isnewpage = false;
    $rootScope.checkisValidIp=false;

     $rootScope.checkConnectedDeviceLogic = function (){
       window.external.getConnectedDevices();
     };
    
     $rootScope.initiateWLANEmailTicket = function (){
       window.external.wlanEmailTicket();
     };

    $rootScope.initiateIntermittenWIFI = function (){
       window.external.intermittenWIFI();
    };

    $rootScope.activeiMinimize = function () {
        window.external.activeiMinimize();
    };

    $rootScope.activeiClose = function () {  
      try{
      if($rootScope.getglobaldata.Client === 'GearHead')
        { 
          $scope.headerText=$rootScope.getglobalErrorMessage.APPHDRGEARHEAD;
        }
      else{
          $scope.headerText=$rootScope.getglobalErrorMessage.APPLICATIONHDR; 
        }               
        
        $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOCLOSEWINDOW;
        $scope.confirmOk = $rootScope.getglobalErrorMessage.BTNYES;
        $scope.confirmCancel = $rootScope.getglobalErrorMessage.BTNNO;

                ngDialog.openConfirm(
            {
                template: 'confirmdialog',
                className: 'ngdialog-theme-default',
                scope: $scope
            }
            )
            .then(function (value) {
                 window.external.activeiClose();
            }, function (value) {

            }); 
          }
          catch(e)
          {
            stackTrace('AppCtrl','activeiClose',e,$rootScope.getglobaldata.Client);
          }
        
    };

    $rootScope.setNetWorkDetails = function (isnetwork, isNetworkChanged) {
     if (!$rootScope.checkisValidIp) {
        if (isNetworkChanged === 'True' && $state.current.name === 'login') {
            $state.reload();
        }
        else {
            $state.go('login');
        }
     }
        
    };

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        if (angular.isDefined(toState.data.pageTitle)) {
            $scope.pageTitle = toState.data.pageTitle + ' | ' + $rootScope.getglobaldata.Client;
        }
    });

    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
     //    if ($rootScope.getglobaldata.Client === 'GearHead') {
          
     //     (function (i, s, o, g, r, a, m) {

     //       i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {

     //           (i[r].q = i[r].q || []).push(arguments);

     //       }, i[r].l = 1 * new Date(); a = s.createElement(o),

     //  m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m);

     //   })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

     //   // Live
     //   ga('create', 'UA-52889968-1', 'auto');

     //   //Staging
     //   // ga('create', 'UA-61873303-1', 'auto');

     //   ga('send', 'pageview', { page: toState.name+'.html' });
     // }

        // if (offlineGlobalData.Client === 'GearHead') {
        //   gaTrack('UA-61873303-1', 'ghstaging.csscorp.com', toState.name+'.html');
        // }



     
    
// jQuery.getScript( 'http://is-dev.csscorp.com/gearhead/sample.js', function(data, textStatus) {
       
//       // loadscript(toState.name);
// } );

// $http.JSONP("http://is-dev.csscorp.com/gearhead/googletrack.html")
//     .success(function(response) {
//     alert('response');
//   });

// $http.jsonp('http://is-dev.csscorp.com/gearhead/googletrack.html?callback=JSON_CALLBACK').success(function (data) {

//  alert(data);
// }).error(function (data) {
//   alert('Error');

// });


// $.ajax({
//   url: "http://is-dev.csscorp.com/gearhead/googletrack.html",
//   dataType: 'jsonp',  //use jsonp data type in order to perform cross domain ajax
//   crossDomain: true,
//   data: null,
//   success: function(result)
//             {
//               alert('Success');
//             },
//   error: function(result)
//             {
//               alert('Error');
//             }
// });
     // $.ajax({
     //          url: 'http://is-dev.csscorp.com/gearhead/googletrack.html',
     //          type: 'PUT',
     //          data: null,
     //          dataType: 'jsonp',
     //          //async: false,
     //          cache: false,
     //          contentType: 'text/html',              
     //          processData: false,
     //          success: function(data) {
     //            //alert ("complete success thiru"+data);
     //            alert('Success');
     //          }
     //        }); 

    });

    $rootScope.userLogOut = function () {
       // alert($rootScope.myinfo.MACAddress);
        //var params = { username: localStorage.getItem("StoredCustomerID"), macAdd: $rootScope.myinfo.MACAddress, status: 0 };
        //alert(JSON.stringify(params));
        //logDeviceStatus(params, $rootScope, $scope);
        $rootScope.isLogout = true;
        $state.go('login');
    };

   

 $rootScope.showFeedbackModal=function(){
    try{
      if ($rootScope.userDetails.IsNetwork === 'True') {
        $('#myModal').appendTo("body").modal('show');
      }
      else{
         $rootScope.offlineerrorUpgrade();
      }
    }
    catch(e)
    {
      stackTrace('AppCtrl','showFeedbackModal',e,$rootScope.getglobaldata.Client);
    }
  };

  $rootScope.offlineerrorUpgrade=function(){ 
    var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
    var messageText ="";
    var headerText ="";
     if($rootScope.getglobaldata.Client === 'GearHead')
      { 
         messageText=$rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING;
         headerText=$rootScope.getglobalErrorMessage.APPHDRGEARHEAD; 
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText); 
      }
      else{ 
        messageText=$rootScope.getglobalErrorMessage.OFFLINEWARNING;
        headerText=$rootScope.getglobalErrorMessage.APPLICATIONHDR; 
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText); 
      }
  };

  $rootScope.inActiveUserErrorMessage=function(){ 
    var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
    var messageText ="";
    var headerText ="";
     if($rootScope.getglobaldata.Client === 'GearHead')
      { 
         messageText=$rootScope.getglobalErrorMessage.INACTIVEGEARHEADUSERWARNING;
         headerText=$rootScope.getglobalErrorMessage.APPHDRGEARHEAD; 
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText); 
      }
      else{ 
        messageText=$rootScope.getglobalErrorMessage.INACTIVEUSERWARNING;
        headerText=$rootScope.getglobalErrorMessage.APPLICATIONHDR; 
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText); 
      } 
};

$rootScope.showNewUserOnNetwork=function(){
   window.external.showNewDeviceDialog();
};

$rootScope.showRouterLogAlert=function(){
   window.external.showRouterLogDialog();
};

});

//Functoinality used to change the network status
function changeNetworkActivity(isnetwork,isNetworkChanged)
{
   try{
    // networkstatus
    $("#networkstatus").removeClass('net_off network_init').addClass((isnetwork === "True") ? 'net_on' : 'net_off');
    angular.element(document.getElementById("mainCont")).scope().setNetWorkDetails(isnetwork,isNetworkChanged);
  }
  catch(e){
    stackTrace('AppCtrl','changeNetworkActivity',e,$rootScope.getglobaldata.Client);
  }
}

function logOut() {
  try
  {
    localStorage.setItem('StoredCustomerID','');  
    angular.element(document.getElementById("mainCont")).scope().userLogOut();
  }
  catch(e)
  {
    stackTrace('AppCtrl','logOut',e,$rootScope.getglobaldata.Client);
  }
}

function changenetworkicon(isnetwork,isNetworkChanged)
{
   try{
    // networkstatus
    $("#networkstatus").removeClass('net_off network_init').addClass((isnetwork === "True") ? 'net_on' : 'net_off');
  }
  catch(e){
    stackTrace('AppCtrl','changeNetworkActivity',e,$rootScope.getglobaldata.Client);
  }
}


