/**
 * GearHead - v2.1.0.5 - 2015-07-17
 * https://github.com/ngbp/ngbp
 *
 * Copyright (c) 2015 Josh David Miller
 * Licensed MIT <https://raw.github.com/ngbp/ngbp/master/LICENSE>
 */
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
    $(document).bind('contextmenu',function(e){
       e.preventDefault();//or return false;
    });

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
     
        if (isNetworkChanged === 'True' && $state.current.name === 'login') {
            $state.reload();
        }
        else {
            $state.go('login');
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
angular.module( 'activei.home', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider) {
  $stateProvider.state( 'home', {
    url: '/home',
	views:{      
      "RightView":{
        templateUrl:"home/homeRight.tpl.html",
        controller:"HomeRightController"		
		}
      
    },
    data:{ pageTitle: 'Home' }
  });

})
.run( function run ($rootScope,$http,$window) {
//Read global config data from JSON and hold it in rootscope 

   $http.get('assets/StaticResources/promotionDetails.txt').then(function(response){
      $rootScope.promodetails = response.data;
      
  });


   $http.get('assets/StaticResources/productDetailsNew.txt').then(function(response){
      $rootScope.productDetNew = response.data;
      
  });


   $http.get('assets/StaticResources/productDetails.txt').then(function(response){
      $rootScope.prodDetail = response.data;
      
  });

    }       
)
/**
 * And of course we define a controller for our route.
 */

.controller( 'HomeRightController', function HomeRightController( $scope,$rootScope,$http,$cookieStore,$state,ngDialog) {  
  $rootScope.homeClicked=true;
 $rootScope.isMiddleCont = false;
 $rootScope.feedbackshow=true;
 $rootScope.customer_care_support=true;
   $rootScope.istollFreeNumber=true;
    $rootScope.isContactSupport=true;
 $("#dvleftcontent").hide();
 contentHide();
$('#background_logo').removeClass().addClass('cont_bg_logo_home');
 $rootScope.clickcount=0;
 $rootScope.isBackButtonClicked=false;

$rootScope.iscontractTextShow=true;
$rootScope.iswelcomeTextShow=true;
// $rootScope.userFirstName=localStorage.getItem("FirstName");
$rootScope.userFirstName=$rootScope.userDetails.UserFirstName;
if ($rootScope.isAntivirusScanned) {
      $rootScope.isAntivirusScanned=false;
      window.external.resetAntivirus();    
  }
if ($rootScope.isNetworkSpeed) {
      $rootScope.isNetworkSpeed=false;
      window.external.resetNetworkSpeed();    
  }
 
if ($rootScope.getglobaldata.Client === 'GearHead') {
         $rootScope.tollfreeno = $rootScope.getglobaldata.gearHeadtollfree; 
         if ($rootScope.wanIPDeatil === '') {
            $rootScope.wanIPDeatil  = window.external.setStatusBarDetails();    
         }
         $rootScope.loadWanip = $rootScope.wanIPDeatil;
      }
      else{
        $rootScope.tollfreeno = $rootScope.getglobaldata.activeitollfree;  
        $rootScope.loadWanip = '';
      }

var contract=$rootScope.userDetails.ContractAvailability; 

if (parseInt(contract,10) === 1) {
    $rootScope.contractStatus=$rootScope.getglobalErrorMessage.CONTRACTSTATUSACTIVE;
    $rootScope.statusclass="statusactive_color";
    // $rootScope.remainingDays=localStorage.getItem("RemainingDays");
    $rootScope.remainingDays=$rootScope.userDetails.RemainingDays;
    $rootScope.isremainingdayTextShow=true; 
}
else
{
    $rootScope.contractStatus=$rootScope.getglobalErrorMessage.CONTRACTSTATUSINACTIVE;
    $rootScope.statusclass="statusinactive_color";
    $rootScope.isremainingdayTextShow=false;
}
 $scope.msgDescription="Do you have a Session ID?";
 $scope.headerText="remote Support";

 $rootScope.offlineErrorMessage=function(){ 
var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
var messageText= ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING : $rootScope.getglobalErrorMessage.OFFLINEWARNING; 
showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);

}; 
 


//functionality used to redirect the contract upgrade page
$rootScope.redirectToUpgrade=function(statename,id)
{
  try{
    if ($rootScope.userDetails.IsNetwork === 'True') {
      $rootScope.isMiddleCont = true;
      $rootScope.isStausbarClicked=true;
      loadPageContent($rootScope.getglobalmenudata[(id-1)].submenu,$state,$rootScope,$cookieStore,id,0,statename,22);
    }
    else{
       // $rootScope.offlineErrorMessage();
       $rootScope.offlineerrorUpgrade();
    }
    }
    catch(e){
    // stackTrace(e);
    stackTrace('HomeRightController','redirectToUpgrade',e,$rootScope.getglobaldata.Client);
  }
    
};

//Common method to load the left and right content
//which is used in ng-click event of the main menu in "home"
$rootScope.redirectmenu=function(statename,id)
{    
  try{
      if (((parseInt(id,10) == 1) || (parseInt(id,10) == 2) || (parseInt(id,10) == 4)) && $rootScope.userDetails.IsNetwork === 'False') {
          $rootScope.offlineErrorMessage();
      }
      else
      {
        if ((parseInt($rootScope.userDetails.ContractAvailability,10) === 0) && ((parseInt(id,10) == 1) || (parseInt(id,10) == 3) )) {
          $rootScope.inActiveUserErrorMessage();   
        }
        else
        {
            loadPageContent($rootScope.getglobalmenudata,$state,$rootScope,$cookieStore,0,0,statename,id);
        }
      }
      }
    catch(e){
    // stackTrace(e);
    stackTrace('HomeRightController','redirectmenu',e,$rootScope.getglobaldata.Client);
  }
};


//Show and hide Menu Description on Hover
    $scope.showMenuDescription = function (hoveredMenu, isHover) {

        switch (hoveredMenu) {
            case 'ContactSupport':
                $scope.isSupportMenuDescription = isHover;
                break;
            case 'SystemTools':
                $scope.isSystemToolsMenuDescription = isHover;
                break;
            case 'ManageAccounts':
                $scope.isManageAccountMenuDescription = isHover;
                break;
            case 'MessageCenter':
                $scope.isMessageCenterMenuDescription = isHover;
                break;             
            default: break;

        }
    };
	
//Get Unread Message Count 
$scope.getMessageCount = function () {
  try{
    if ($rootScope.userDetails.IsNetwork === 'True') {
      $scope.isSupportMenuDescription = false;
      $scope.isSystemToolsMenuDescription = false;
      $scope.isManageAccountMenuDescription = false;
      $scope.isMessageCenterMenuDescription = false;
       var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetUnreadMessageCount";
       var param=messageCount($rootScope);
       showLoader();
       $http.post(servicePath, param).success(function (result, status, headers, config) {
          $scope.MesageCount = result.d;
          $scope.isMessagecount=(parseInt($scope.MesageCount,10) > 0) ? true : false;
          $.loader('close');
      }).error(function (serverResponse, status, headers, config) {
        $.loader('close'); 
      });
    }
    else
    {
      $scope.MesageCount="0";
      $scope.isMessagecount=false;
      $.loader('close');
    }
    }
    catch(e){ 
    // stackTrace(e);
    stackTrace('HomeRightController','getMessageCount',e,$rootScope.getglobaldata.Client);
  }
  }; 
}) 

.controller( 'FeedbackController', function FeedbackController($scope,$rootScope,$http,$cookieStore,$state,ngDialog) { 

$scope.saveFeedback=function(){   
  try{   
  if ($rootScope.userDetails.IsNetwork === 'True') { 
         if((parseFloat($('#input_rate').val(),10) === 0.0) || ($('#input_rate').val() === "")){  
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFEEDBACK,'Please Select the Ratings',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if($('#comments').val() === undefined || $('#comments').val() ===''){
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFEEDBACK,'Please Enter the Feedback Message',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }
          var servicePath='';
       
         servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "SaveFeedBackDetails"; 
      
    //var feedmsg = urlencode($('#comments').val());
    //alert(feedmsg);
    var customerId=localStorage.getItem("StoredCustomerID"); 
    var uri_encmessage = encodeURIComponent($scope.frmData.message); 

    var param = '{ "customerID":'+ customerId + ', "feedbackMessage": "' + uri_encmessage + '" , "rating": ' + parseFloat($scope.frmData.ratings) + '}';       // var param = '{ "customerID":' 2 + ', "feedbackMessage": "' + $scope.frmData.message + '", "rating": ' + $scope.frmData.ratings + '}';          
    showLoader(); 
    $http.post(servicePath, param).success(function (serverResponse, status, headers, config) 
    { 
      if (serverResponse.d) {
        $.loader('close'); 
        var messageText=$rootScope.getglobalErrorMessage.SUCCESSFEEDBACK;
        var headerText=$rootScope.getglobalErrorMessage.HDRFEEDBACK;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK;

        //Show the info message   
        //Show the info message
        // $('#input_rate').val(0);
         $('#comments').val('');
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);                
        $('#myModal').modal('hide');
        return false;
       }
       else{
        return true;
       } 
    }).error(function (serverResponse, status, headers, config){ 
      $.loader('close');
    });
  }
  else
  {
    // $rootScope.offlineErrorMessage();
    var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
    var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
    var messageText= ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.OFFLINEGEARHEADWARNING : $rootScope.getglobalErrorMessage.OFFLINEWARNING; 
    showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);   
  }
  }
    catch(e){
    // stackTrace(e);
    stackTrace('FeedbackController','saveFeedback',e,$rootScope.getglobaldata.Client);
  }
};
});

function feedbackPopup(){

  $( "#btnFeedback" ).on('click', function(){
    $('#input_rate').rating('update', 0); 

  }); 
      // $('#myModal').appendTo("body").modal('show');
  angular.element(document.getElementById("mainCont")).scope().showFeedbackModal();
    }
    
var clearValue = function() { 
};

// function urlencode(txtmsg)
// { 
//   alert(txtmsg);
// //var encodetxt=encodeURI(txt);
// var encodetxt=encodeURIComponent(txt);
// return encodetxt;
// }



var offlineGlobalData={
 "getGlobalUrl":"http://localhost:19055/", 
  // "getGlobalServiceUrl":"http://devis.csscorp.com/CSSConnect/CSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/",
  "getGlobalServiceUrl":"http://devis.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/",
   // "getGlobalServiceUrl":"https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/",
   // "getGlobalServiceUrl":"https://localhost/CssconnectClientService/CSSNetgearService/NetgearClientService.asmx/",
   // "getGlobalServiceUrl":"https://activei.csscorp.com/CSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/",
   
   
  "chatURL":"http://activechat.csscorp.com:8082/netgear",
  // "chatURL":"http://10.40.2.46:8082/netgear",
  "getGlobalFeedbackServiceUrl":"http://devis.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/",
  "renew":"https://my.netgear.com/myNetgear/gearhead/portal/pta.aspx?portalid=",
  "registerproduct":"https://my.netgear.com/myNetgear/gearhead/portal/pta.aspx?portalid=",
  "Client" : "GearHead",
  // "Client" : "Activei",

  // "feedbackUrl":"http://devis.csscorp.com/CSSConnect/CSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/",
  // "feedbackUrl":"http://activei.csscorp.com/CSSConnectClientService/CSSNetgearService/NetgearClientService.asmx/",
  "feedbackUrl":"http://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/",
  // "feedbackUrl":"http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/",
  "getServiceURL": "http://10.40.2.46:8095/webservice/network/",
  "gearHeadtollfree" : "1-888-939-9093",
  "activeitollfree" : "1-877-438-9111",
  // "versionInfo":"2.0"
  "versionInfo":"2.1"
};

// var offlineGlobalMenuData={
//     "menus": [
//         {
//             "id": "1",
//             "leftPositionID": "2",
//             "name": "Contact Support",
//             "statename": "contactsupport",
//             "classname":"contsupport_icon icon-contactsupport",
//             "parent_id": "0",
//             "submenu": [
//                 {
//                     "id": "11",
//                     "leftPositionID": "1",
//                     "rightPositionID": "8",
//                     "name": "Schedule a Call",
//                     "statename": "scheduleacall",
//                     "classname":"contsupport_icon icon-scheduleacall",
//                     "parent_id": "1"

//                 },
//                 {
//                     "id": "12",
//                     "leftPositionID": "7",
//                     "rightPositionID": "9",
//                     "name": "Web Ticket",
//                     "statename": "webticket",
//                     "classname":"contsupport_icon icon-webticket",
//                     "parent_id": "1"
//                 },
//                 {
//                     "id": "13",
//                     "leftPositionID": "5",
//                     "rightPositionID": "11",
//                     "name": "Remote Support",
//                     "statename": "remotesupport",
//                     "classname":"contsupport_icon icon-remotesupport",
//                     "parent_id": "1"
//                 },
//                 {
//                     "id": "14",
//                     "leftPositionID": "6",
//                     "rightPositionID": "10",
//                     "name": "Chat",
//                     "statename": "chat",
//                     "classname":"contsupport_icon icon-chat",                    
//                     "parent_id": "1"
//                 },
//                 {
//                     "id": "15",
//                     "leftPositionID": "2",
//                     "rightPositionID": "12",
//                     "name": "Knowledge Base",
//                     "statename": "knowledgebase",
//                     "classname":"contsupport_icon icon-knowledgebase",                    
//                     "parent_id": "1"
//                 }
//             ]
//         },
//         {
//             "id": "2",
//             "leftPositionID": "6",
//             "name": "Manage Account",
//             "statename": "manageaccount",            
//             "classname":"contsupport_icon icon-manageaccount",
//             "parent_id": "0",
//             "submenu": [
//                 {
//                     "id": "21",
//                     "leftPositionID": "1",
//                     "rightPositionID": "8",
//                     "name": "Profile",
//                     "statename": "myprofile",
//                     "classname":"contsupport_icon icon-profile",                    
//                     "parent_id": "2"
//                 },
//                 {
//                     "id": "22",
//                     "leftPositionID": "2",
//                     "rightPositionID": "9",
//                     "name": "Contract Upgrade/Renew",
//                     "statename": "contractupgrade",
//                     "classname":"contsupport_icon icon-registry",                    
//                     "parent_id": "2"
//                 }
//             ]
//         },
//         {
//             "id": "3",
//             "leftPositionID": "1",
//             "name": "System Tools",
//             "statename": "systemtools",            
//             "classname":"contsupport_icon icon-systemtools",
//             "parent_id": "0",
//             "submenu": [
//                 {
//                     "id": "31",
//                     "leftPositionID": "1",
//                     "rightPositionID": "8",
//                     "name": "Optimization Suite",
//                     "statename": "pcoptimizationsuite",
//                     "classname":"contsupport_icon icon-optimizationsuite",
//                     "parent_id": "3",
//                     "submenu": [
//                                 {
//                                     "id": "311",
//                                     "leftPositionID": "1",
//                                     "rightPositionID": "1",
//                                     "name": "Defragmentation",
//                                     "statename": "defragmentation",
//                                     "classname":"contsupport_icon icon-defragmentation",
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "312",
//                                     "leftPositionID": "2",
//                                     "rightPositionID": "2",
//                                     "name": "PC Optimization",
//                                     "statename": "pcoptimization",
//                                     "classname":"contsupport_icon icon-pcoptimization",
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "313",
//                                     "leftPositionID": "3",
//                                     "rightPositionID": "3",
//                                     "name": "Firewall",
//                                     "statename": "firewall",
//                                     "classname":"contsupport_icon icon-firewall",
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "314",
//                                     "leftPositionID": "4",
//                                     "rightPositionID": "4",
//                                     "name": "Data Backup",
//                                     "statename": "databackup",
//                                     "classname":"contsupport_icon icon-databackup",                    
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "315",
//                                     "leftPositionID": "5",
//                                     "rightPositionID": "5",
//                                     "name": "Parental Control",
//                                     "statename": "parentalcontrol",
//                                     "classname":"contsupport_icon icon-parentalcontrol",                    
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "316",
//                                     "leftPositionID": "6",
//                                     "rightPositionID": "6",
//                                     "name": "Registry Cleaner",
//                                     "statename": "registrycleaner",
//                                     "classname":"contsupport_icon icon-registrycleaner",                    
//                                     "parent_id": "31"
//                                 },
//                                 {
//                                     "id": "317",
//                                     "leftPositionID": "7",
//                                     "rightPositionID": "7",
//                                     "name": "Antivirus",
//                                     "statename": "antivirus",
//                                     "classname":"contsupport_icon icon-antivirus",                    
//                                     "parent_id": "31"
//                                 }
//                             ]
//                },               
//                 {
//                     "id": "33",
//                     "leftPositionID": "5",
//                     "rightPositionID": "10",
//                     "name": "Network Tools",
//                     "statename": "networktools",
//                     "classname":"contsupport_icon icon-network",
//                     "parent_id": "3",
//                     "submenu": [
//                                 {
//                                     "id": "331",
//                                     "leftPositionID": "1",
//                                     "rightPositionID": "8",
//                                     "name": "Network Usage",
//                                     "statename": "networkusage",
//                                     "classname":"contsupport_icon icon-backup",
//                                     "parent_id": "33"
//                                 },
//                                 {
//                                     "id": "332",
//                                     "leftPositionID": "3",
//                                     "rightPositionID": "9",
//                                     "name": "Network Map",
//                                     "statename": "networkmap",
//                                     "classname":"contsupport_icon icon-dbmgraph",
//                                     "parent_id": "33"
//                                 },
//                                 {
//                                     "id": "333",
//                                     "leftPositionID": "7",
//                                     "rightPositionID": "10",
//                                     "name": "Network Speed",
//                                     "statename": "networkspeed",
//                                     "classname":"contsupport_icon icon-timer",
//                                     "parent_id": "33"
//                                 }
//                                 ]
//                 },
//                 {
//                     "id": "34",
//                     "leftPositionID": "6",
//                     "rightPositionID": "9",
//                     "name": "Schedule Activities",
//                     "statename": "scheduledactivities",
//                     "classname":"contsupport_icon icon-scheduleactivities",                    
//                     "parent_id": "3"
//                 }
//             ]
//         },
//         {
//             "id": "4",
//             "leftPositionID": "5",
//             "name": "Message Center",
//             "statename": "messagecenter",            
//             "classname":"contsupport_icon icon-messagecenter",
//             "parent_id": "0"
//         }
//     ]
// };  
/*var offlineGlobalMenuData={
    "menus": [
        {
            "id": "1",
            "leftPositionID": "2",
            "name": "Contact Support",
            "statename": "contactsupport",
            "classname":"contsupport_icon icon-contactsupport",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "11",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Schedule a Call",
                    "statename": "scheduleacall",
                    "classname":"contsupport_icon icon-scheduleacall",
                    "parent_id": "1"

                },
                {
                    "id": "12",
                    "leftPositionID": "7",
                    "rightPositionID": "9",
                    "name": "Web Ticket",
                    "statename": "webticket",
                    "classname":"contsupport_icon icon-webticket",
                    "parent_id": "1"
                },
                {
                    "id": "13",
                    "leftPositionID": "5",
                    "rightPositionID": "11",
                    "name": "Remote Support",
                    "statename": "remotesupport",
                    "classname":"contsupport_icon icon-remotesupport",
                    "parent_id": "1"
                },
                {
                    "id": "14",
                    "leftPositionID": "6",
                    "rightPositionID": "10",
                    "name": "Chat",
                    "statename": "chat",
                    "classname":"contsupport_icon icon-chat",                    
                    "parent_id": "1"
                },
                {
                    "id": "15",
                    "leftPositionID": "2",
                    "rightPositionID": "12",
                    "name": "Knowledge Base",
                    "statename": "knowledgebase",
                    "classname":"contsupport_icon icon-knowledgebase",                    
                    "parent_id": "1"
                }
            ]
        },
        {
            "id": "2",
            "leftPositionID": "6",
            "name": "Manage Account",
            "statename": "manageaccount",            
            "classname":"contsupport_icon icon-manageaccount",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "21",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Profile",
                    "statename": "myprofile",
                    "classname":"contsupport_icon icon-profile",                    
                    "parent_id": "2"
                },
                {
                    "id": "22",
                    "leftPositionID": "2",
                    "rightPositionID": "9",
                    "name": "Contract Upgrade/Renew",
                    "statename": "contractupgrade",
                    "classname":"contsupport_icon icon-registry",                    
                    "parent_id": "2"
                }
            ]
        },
        {
            "id": "3",
            "leftPositionID": "1",
            "name": "System Tools",
            "statename": "systemtools",            
            "classname":"contsupport_icon icon-systemtools",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "31",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Optimization Suite",
                    "statename": "pcoptimizationsuite",
                    "classname":"contsupport_icon icon-optimizationsuite",
                    "parent_id": "3",
                    "submenu": [
                                {
                                    "id": "311",
                                    "leftPositionID": "1",
                                    "rightPositionID": "1",
                                    "name": "Defragmentation",
                                    "statename": "defragmentation",
                                    "classname":"contsupport_icon icon-defragmentation",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "312",
                                    "leftPositionID": "2",
                                    "rightPositionID": "2",
                                    "name": "PC Optimization",
                                    "statename": "pcoptimization",
                                    "classname":"contsupport_icon icon-pcoptimization",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "313",
                                    "leftPositionID": "3",
                                    "rightPositionID": "3",
                                    "name": "Firewall",
                                    "statename": "firewall",
                                    "classname":"contsupport_icon icon-firewall",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "314",
                                    "leftPositionID": "4",
                                    "rightPositionID": "4",
                                    "name": "Data Backup",
                                    "statename": "databackup",
                                    "classname":"contsupport_icon icon-databackup",                    
                                    "parent_id": "31"
                                },
                                {
                                    "id": "315",
                                    "leftPositionID": "5",
                                    "rightPositionID": "5",
                                    "name": "Parental Control",
                                    "statename": "parentalcontrol",
                                    "classname":"contsupport_icon icon-parentalcontrol",                    
                                    "parent_id": "31"
                                },
                                {
                                    "id": "316",
                                    "leftPositionID": "6",
                                    "rightPositionID": "6",
                                    "name": "Registry Cleaner",
                                    "statename": "registrycleaner",
                                    "classname":"contsupport_icon icon-registrycleaner",                    
                                    "parent_id": "31"
                                }
                            ]
               },               
                {
                    "id": "33",
                    "leftPositionID": "5",
                    "rightPositionID": "10",
                    "name": "Network Tools",
                    "statename": "networktools",
                    "classname":"contsupport_icon icon-network",
                    "parent_id": "3",
                    "submenu": [
                                {
                                    "id": "331",
                                    "leftPositionID": "1",
                                    "rightPositionID": "8",
                                    "name": "Network Usage",
                                    "statename": "networkusage",
                                    "classname":"contsupport_icon icon-backup",
                                    "parent_id": "33"
                                },
                                {
                                    "id": "332",
                                    "leftPositionID": "3",
                                    "rightPositionID": "9",
                                    "name": "Network Map",
                                    "statename": "networkmap",
                                    "classname":"contsupport_icon icon-dbmgraph",
                                    "parent_id": "33"
                                },
                                {
                                    "id": "333",
                                    "leftPositionID": "7",
                                    "rightPositionID": "10",
                                    "name": "Network Speed",
                                    "statename": "networkspeed",
                                    "classname":"contsupport_icon icon-timer",
                                    "parent_id": "33"
                                }
                                ]
                },
                {
                    "id": "34",
                    "leftPositionID": "6",
                    "rightPositionID": "9",
                    "name": "Schedule Activities",
                    "statename": "scheduledactivities",
                    "classname":"contsupport_icon icon-scheduleactivities",                    
                    "parent_id": "3"
                }
            ]
        },
        {
            "id": "4",
            "leftPositionID": "5",
            "name": "Message Center",
            "statename": "messagecenter",            
            "classname":"contsupport_icon icon-messagecenter",
            "parent_id": "0"
        }
    ]
};*/ 
var offlineGlobalMenuData={
    "menus": [
        {
            "id": "1",
            "leftPositionID": "2",
            "name": "Contact Support",
            "statename": "contactsupport",
            "classname":"contsupport_icon icon-contactsupport",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "11",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Schedule a Call",
                    "statename": "scheduleacall",
                    "classname":"contsupport_icon icon-scheduleacall",
                    "parent_id": "1"

                },
                {
                    "id": "12",
                    "leftPositionID": "7",
                    "rightPositionID": "9",
                    "name": "Web Ticket",
                    "statename": "webticket",
                    "classname":"contsupport_icon icon-webticket",
                    "parent_id": "1"
                },
                {
                    "id": "13",
                    "leftPositionID": "5",
                    "rightPositionID": "11",
                    "name": "Remote Support",
                    "statename": "remotesupport",
                    "classname":"contsupport_icon icon-remotesupport",
                    "parent_id": "1"
                },
                {
                    "id": "14",
                    "leftPositionID": "6",
                    "rightPositionID": "10",
                    "name": "Chat",
                    "statename": "chat",
                    "classname":"contsupport_icon icon-chat",                    
                    "parent_id": "1"
                },
                {
                    "id": "15",
                    "leftPositionID": "2",
                    "rightPositionID": "12",
                    "name": "Knowledge Base",
                    "statename": "knowledgebase",
                    "classname":"contsupport_icon icon-knowledgebase",                    
                    "parent_id": "1"
                }
            ]
        },
        {
            "id": "2",
            "leftPositionID": "6",
            "name": "Manage Account",
            "statename": "manageaccount",            
            "classname":"contsupport_icon icon-manageaccount",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "21",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Profile",
                    "statename": "myprofile",
                    "classname":"contsupport_icon icon-profile",                    
                    "parent_id": "2"
                },
                {
                    "id": "22",
                    "leftPositionID": "2",
                    "rightPositionID": "9",
                    "name": "Contract Upgrade/Renew",
                    "statename": "contractupgrade",
                    "classname":"contsupport_icon icon-registry",                    
                    "parent_id": "2"
                }
            ]
        },
        {
            "id": "3",
            "leftPositionID": "1",
            "name": "System Tools",
            "statename": "systemtools",            
            "classname":"contsupport_icon icon-systemtools",
            "parent_id": "0",
            "submenu": [
                {
                    "id": "31",
                    "leftPositionID": "1",
                    "rightPositionID": "8",
                    "name": "Optimization Suite",
                    "statename": "pcoptimizationsuite",
                    "classname":"contsupport_icon icon-optimizationsuite",
                    "parent_id": "3",
                    "submenu": [
                                {
                                    "id": "311",
                                    "leftPositionID": "1",
                                    "rightPositionID": "1",
                                    "name": "Defragmentation",
                                    "statename": "defragmentation",
                                    "classname":"contsupport_icon icon-defragmentation",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "312",
                                    "leftPositionID": "2",
                                    "rightPositionID": "2",
                                    "name": "PC Optimization",
                                    "statename": "pcoptimization",
                                    "classname":"contsupport_icon icon-pcoptimization",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "313",
                                    "leftPositionID": "3",
                                    "rightPositionID": "3",
                                    "name": "Firewall",
                                    "statename": "firewall",
                                    "classname":"contsupport_icon icon-firewall",
                                    "parent_id": "31"
                                },
                                {
                                    "id": "314",
                                    "leftPositionID": "4",
                                    "rightPositionID": "4",
                                    "name": "Data Backup",
                                    "statename": "databackup",
                                    "classname":"contsupport_icon icon-databackup",                    
                                    "parent_id": "31",
                                    "active":"N"
                                },
                                {
                                    //for Activei 

                                    // "id": "315",
                                    // "leftPositionID": "5",
                                    // "rightPositionID": "5",
                                    // "name": "Parental Control",
                                    // "statename": "parentalcontrol",
                                    // "classname":"contsupport_icon icon-parentalcontrol",                    
                                    // "parent_id": "31"

                                    //for GearHead

                                     "id": "315",
                                    "leftPositionID": "6",
                                    "rightPositionID": "6",
                                    "name": "Parental Control",
                                    "statename": "parentalcontrol",
                                    "classname":"contsupport_icon icon-parentalcontrol",                    
                                    "parent_id": "31"
                                },
                                {
                                    "id": "316",
                                    "leftPositionID": "6",
                                    "rightPositionID": "6",
                                    "name": "Registry Cleaner",
                                    "statename": "registrycleaner",
                                    "classname":"contsupport_icon icon-registrycleaner",                    
                                    "parent_id": "31",
                                    "active":"N"


                                },
                                {
                                    "id": "317",
                                    "leftPositionID": "7",
                                    "rightPositionID": "7",
                                    "name": "AntiVirus",
                                    "statename": "antivirus",
                                    "classname":"contsupport_icon icon-antivirus",                    
                                    "parent_id": "31",
                                    "active":"N"
                                }
                            ]
               },               
                {
                    "id": "33",
                    "leftPositionID": "5",
                    "rightPositionID": "10",
                    "name": "Network Tools",
                    "statename": "networktools",
                    "classname":"contsupport_icon icon-network",
                    "parent_id": "3",
                    "submenu": [
                                {
                                    "id": "331",
                                    "leftPositionID": "1",
                                    "rightPositionID": "8",
                                    "name": "Network Usage",
                                    "statename": "networkusage",
                                    "classname":"contsupport_icon icon-backup",
                                    "parent_id": "33"
                                },
                                {
                                    "id": "332",                                    
                                    "leftPositionID": "3",
                                    "rightPositionID": "10",
                                    "name": "Network Map",
                                    "statename": "networkmap",
                                    "classname":"contsupport_icon icon-dbmgraph",
                                    "parent_id": "33",
                                    "active":"N"
                                },
                                {
                                    "id": "333",
                                    "leftPositionID": "7",
                                    "rightPositionID": "9",
                                    "name": "Network Speed",
                                    "statename": "networkspeed",
                                    "classname":"contsupport_icon icon-timer",
                                    "parent_id": "33"
                                }
                                ]
                },
                {
                    "id": "34",
                    "leftPositionID": "6",
                    "rightPositionID": "9",
                    "name": "Wi-Fi Tools",
                    "statename": "wifitools",
                    "classname":"contsupport_icon icon-wifi",                    
                    "parent_id": "3",
                    "submenu": [
                                {
                                    "id": "341",
                                    "leftPositionID": "2",
                                    "rightPositionID": "8",
                                    "name": "Network Details",
                                    "statename": "networkdetails",
                                    "classname":"contsupport_icon icon-network",
                                    "parent_id": "34"
                                },
                                {
                                    "id": "342",
                                    "leftPositionID": "1",
                                    "rightPositionID": "9",
                                    "name": "dbm Graph",
                                    "statename": "dbmgraph",
                                    "classname":"contsupport_icon icon-dbmgraph",
                                    "parent_id": "34"
                                },
                                {
                                    "id": "343",
                                    "leftPositionID": "6",
                                    "rightPositionID": "10",
                                    "name": "Signal Strength",
                                    "statename": "signalstrength",
                                    "classname":"contsupport_icon icon-signalgraph",
                                    "parent_id": "34"
                                },
                                {
                                    "id": "344",
                                    "leftPositionID": "5",
                                    "rightPositionID": "11",
                                    "name": "Channel Interface",
                                    "statename": "channelinterface",
                                    "classname":"contsupport_icon icon-channel",                    
                                    "parent_id": "34",
                                    "active":"N"
                                }
                            ]
                },
                {
                    "id": "35",
                    "leftPositionID": "2",
                    "rightPositionID": "11",
                    "name": "Schedule Activities",
                    "statename": "scheduledactivities",
                    "classname":"contsupport_icon icon-scheduleactivities",                    
                    "parent_id": "3"
                }
            ]
        },
        {
            "id": "4",
            "leftPositionID": "5",
            "name": "Message Center",
            "statename": "messagecenter",            
            "classname":"contsupport_icon icon-messagecenter",
            "parent_id": "0"
        }
    ]
};


var offlineMessageData={
    "APPLICATIONHDR" : "Activei",
    "CONTRACTSTATUSACTIVE":"Active",
    "CONTRACTSTATUSINACTIVE":"In Active",
	"DialogWarning":"Warning",
	"DialogInfo":"Information",
    "BTNCANCEL":"Cancel",
    "BTNYES":"Yes",
    "BTNNO":"No",
    "WRNUSER": "Invalid Username or Password",
    "WRNHDRLOGIN": "Login Failed",
    "BTNOK": "Ok",
    "INFOSCHEDULESAVE": "Are you sure to Schedule a Call ?",
    "HDRSCHEDULE": "Schedule a Call",
    "SUCCESSSCHEDULESAVE":"Call Scheduled successfully ",
    "INFOTIMECOMPARE": "Please check date & time as the call can be scheduled only after 30 mins.",
    "INFOCHANGEPWD":"Are you sure to Change a Password ?",
    "HDRCHANGEPWD":"Change Password",
    "SUCCESSCHANGEPWD":"Password Changed Succedssfully",
    "ERRORCHANGEPWD":"Unable to change the password..!",
    "ERRORUPGRADE":"Subscription Failed due to an Error..!",
    "UPGRADEYEAR" : "Year should not be less than 2015",
    "INFOVALIDCREDIT" : "Please Enter valid Credit Card Number",
    "UPGRADEMONTH" : "Month should be less than or equal to 12", 
    "HDRUPGRADE":"Product Upgrade",
    "INFOPROUPGRADESAVE": "Are you sure to update ?",
    "INFOCREDITCARD":"Credit Card number should be 16 digits.",
    "HDRRENEWAL":"Product Renewal",
    "HDRREMOTE":"Remote Support",
    "INFOREMOTESUPPORT":"Do you have a valid session key ?",
    "INFOREMOTESESSION":"You need a session key to proceed further. Please call 1-877-438-9111 to speak with a Support Specialist .",
    "INFOGEARHEADREMOTESESSION":"Please call 1-888-939-9093 or click the Chat button for a session key.",
    "INFONEWTICKETSAVE": "Are you sure to create new case ?",
    "HDRNEWTICKET": "Web ticket",
    "SUCCESSWTICKETSAVE":"New Ticket created successfully ",
    "HDRSERACHPRODUCT" : "Product Search",
    "HDRKNOWLEDGEBASE" : "KnowledgeBase",
    "INFOSEARCHCONT" : "Please enter the search text",
    "INFOPASSMATCH"  :  "New Password and Confirm Password  should be same",
    "INFOPASSSTRONG" :  "Your Password should be strong",
    "INFOCHATEND"  : "Do you want to end chat?",
    "HDRCHAT" : "Chat",
    "HDRFIREWALL" :"Firewall",
    "ERRORAPPPATH" : "Please Select application to Allow/Block",
    "ERRORPORTNO" : "Please Enter port nos to Allow/Block",
    "ERRORINVALIDPORTNO" : "Please Enter valid Port list.Port Numbers must be in the range 0- 65535",
    "ERRORPROFILE" : "Please select atleast one Profile",
    "ERRORRULENAME" : "Please Specify the RuleName !!",
    "HDRSCHEDULEDACTIVITIES" : "Scheduled Activities",
    "SUCCESSSCHEDULEDACTIVITIESSAVE":"Scheduled Activities created successfully ",
    "INFOSCHEDULEDTIMECOMPAREDATE": "Schedule Date should not be less than Current Date .",
    "INFOSCHEDULEDTIMECOMPARETIME": "Please check time as the call can be scheduled only after 30 mins.",
    "INFOSCHEDULEACTIVITYTIME": "Please check time schedule only created after 30 mins.",
    "SCANOPTIONMSG":"Select atleast one Scan Option",
    "SCANCOMPLSUCCESS":"Scan Completed Successfully. ",
    "HDRREGISTRY":"Registry Cleaner",
    "DEFRAGDRIVEMSG":"Select atleast one drive",
    "HDRDEFRAG":"Defragmentation",
    "SCHEDULECALLBACK":"Call Back number should be 10 digits.",
    "VALIDATECALLBACK":"Please Enter valid Call Back Number.",
    "HDRDATABACKUP" : "Data Backup",
    "ERRORDATBACKUPNOFILE" : "Please select atleast one file to upload",
    "OFFLINEWARNING":"This feature requires an active internet connection, please call 1-877-438-9111 to help troubleshoot your issue .",
    "OFFLINEGEARHEADWARNING":"This feature requires an active internet connection, please call 1-888-939-9093 to help troubleshoot your issue .",
    "APPHDRGEARHEAD":"GearHead",
    "HDRFEEDBACK":"FeedBack",
    "SUCCESSFEEDBACK":"Feedback Created Successfully",
    "HDRPARENTALCONTROL" : "Parental Control",
    "HDRNETWORKMAP": "Network Map",
    "INFOREMOVEDEVICE": "Do you want to remove this machine ?",
    "HDRANTIVIRUS":"Antivirus",
    "ERRORANTIVIRUS":"Please select atleast one File path",
    "ERRORANTIVIRUSDRIVE":"Please select atleast one drive",
    "SUCCESSANTIVIRUS":"File Removed Succedssfully",
    "VALIDATEFILEEXISTS":"Please Select Folder to Scan", 
    "VALIDATERATINGS":"Please give Ratings",
    "VALIDATEFEEDBACK":"Please Enter the Feedback",
    "HDRFORGETPASS":"Forget Password",
    "SUCCESSFORGETPASS":"Your new password has been sent successfully to your mail id.Kindly check.",
    "ERRORFORGETPASS":"Invalid Mail Id",
    "INACTIVEUSERWARNING":"Oops! It looks like you do not have an active subscription. To subscribe please call 1-877-438-9111",
    "INACTIVEGEARHEADUSERWARNING":"Oops! It looks like you do not have an active subscription. To subscribe please call 1-888-939-9093",
    "HDRPCOPTIMIZATION": "PC Optimization",
    "INFOPCOPTIMIZATION": "Please Check any one Optimization Mode",
    "GEARHEADTOLLFREENO": "1-888-939-9093",
    "ACTIVEITOLLFREENO": "1-877-438-9111",
    "INFOCLOSEWINDOW": "Are you Sure you want to close?",
    "INFOPCOPTSELECT": "Please select atleast one file ",
    "INFOKBSEARCH": "No Informatoin Available."
};

var promotionDetails=[ 
      {
          "promocode" : "30 Days support",
          "promotionid" : "2"
      },
      {
          "promocode" : "6 Months support",
          "promotionid" : "3"
      },
       {
          "promocode" : "12 Months support",
          "promotionid" : "4"
      },
      {
          "promocode" : "CES 2015 6 Months",
          "promotionid" : "5"
      }
      ];

var productDetails=[
                                   
      {
          "prodcode": "2",
          "prodname" : "ACTM - 30 Days"
      },
      {
          "prodcode": "3",
          "prodname" : "ACTH - 6 Months"
      },
      {
          "prodcode": "4",
          "prodname" : "ACTY - 12 Months"
      },
      {
          "prodcode": "5",
          "prodname" : "ACTH - 6 Months"
      }
 
];

var productDetailsNew=[
    {
        "SerialNo": "SUB1001",
        "ProductName" : "ACTH - 6 Months",
        "PurchaseDate" : "09/11/2014",
        "ProductExpired" : "03/11/2015"
    },
   {
        "SerialNo": "SUB1082",
        "ProductName" : "ACTY - 12 Months",
        "PurchaseDate" : "12/23/2014",
        "ProductExpired" : "12/23/2015"
    },
    {
        "SerialNo": "SUB1084",
        "ProductName" : "ACTM - 30 days",
        "PurchaseDate" : "12/30/2014",
        "ProductExpired" : "01/30/2015"
    }
];

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
var app = angular.module('activei.contractupgrade', ['ui.router','plusOne','ngDialog']);
 
app.config(function config( $stateProvider ) {
  $stateProvider.state( 'contractupgrade', {
    url: '/contractupgrade',
	views:{      
      "RightView":{
        templateUrl:"manageaccount/contractupgrade/contractUpgradeRight.tpl.html",
        controller:"contractUpgradeRightController"	
		}
    },
    data:{ pageTitle: 'Contract Upgrade/Renew' }
  })
  .state("newupgrade", {
       url: "/newupgrade",
       views: {  
         'RightView': { 
          templateUrl: 'manageaccount/contractupgrade/newupgrade.tpl.html',
          controller: "newupgradeRightController" 
         }
       }
         })
  .state("newrenew", {
       url: "/newrenew",
       views: {  
         'RightView': { 
          templateUrl: 'manageaccount/contractupgrade/newrenew.tpl.html',
          controller: "newrenewRightController" 
         }
       }
        });
});
 

app.controller( 'contractUpgradeRightController', function contractUpgradeRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) { 
  $rootScope.isMiddleCont = true;
  $('#background_logo').removeClass().addClass('cont_bg_logo'); 
  $scope.redirectToUpgrade=function()
  { 
    if ($rootScope.getglobaldata.Client === 'GearHead') {
      renewUpgrade($rootScope);
    }else{
      $rootScope.isnewpage=true;
      $state.go('newupgrade');
    }
    
  };
  $scope.redirectToRenew=function()
  { 
    if ($rootScope.getglobaldata.Client === 'GearHead') {
      renewUpgrade($rootScope);
    }else{
      $rootScope.isnewpage=true;
      $state.go('newrenew');
    }
  };

  $rootScope.previousState="manageaccount";  
  $scope.getcontractUpgrade=function()
      {    
        var remainingdays="";
        var customerPhoneNo = "";
         var customerIsoCountry = "";
         var customerExactPhone=0;
        try
        { 
          if(parseInt($rootScope.userDetails.ContractAvailability,10) === 1)
          {
             remainingdays=localStorage.getItem("RemainingDays"); 
             $scope.remainingdays=remainingdays;
             $scope.contractavailable=true;
             $scope.NoContractavailable=false;
              // var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";        
         $('#dvdate').show();
         var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
         var contractId=parseInt(localStorage.getItem('ContractId'),10);
       $scope.serviceData=customerrenewProductDetails($scope,$rootScope,customerId,contractId);
        // var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
        showLoader(); 
        $http.post($scope.serviceData.servicePath,$scope.serviceData.param).success(function (result)
        {     
          $scope.productname=($rootScope.getglobaldata.Client === 'GearHead')?result.d[0].Type:result.d[0].ProductName;
          $scope.purchasedate=result.d[0].PurchaseDate;
          $scope.expirydate=($rootScope.getglobaldata.Client === 'GearHead')?result.d[0].ExpiryDate:result.d[0].ProductExpired; 
          $.loader('close');
        }).error(function (serverResponse, status, headers, config) {
               // alert("failure");
               $.loader('close');
            }); 
          }
          else
          {
            $('#dvdate').hide();
            $scope.Nocontrats="No Contracts Available..!" ;
            $scope.contractavailable=false;
            $scope.NoContractavailable=true;
          }
          
        
        }
        catch(e)
        {
          // stackTrace(e);
          stackTrace('contractUpgradeRightController','getcontractUpgrade',e,$rootScope.getglobaldata.Client);
        } 
       }; 
  });


//Controller for upgrade

app.controller( 'newupgradeRightController', function newupgradeRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {

   $scope.showSubscription=false;
  //  $scope.productDetailsNew = { 
  //  data: 'productData',
  // columnDefs: [{field: 'SerialNo', displayName: 'Serial No', width: "30%"}, {field:'ProductName', displayName:'Product Name', width: "40%"},{field:'PurchaseDate', displayName:'Purchase Date', width: "30%"},{field:'ProductExpired', displayName:'Product Expired', width: "30%"}]
  //  };
$scope.accordionFunc = function(arg)
  {    
    try
    {
      if(arg==='subProDet')
        { 
           if($scope.showsubProDet===false){
              $scope.showSubscription=false;
              $(".table-upgrade_responsive").slideDown();
               if ($('.table-upgrade_responsive').parent().hasClass("slimScrollDiv"))  {
               $('.table-upgrade_responsive').parent().removeClass("popcontShow");
             }
              $scope.showsubProDet=true;
           }
           else{
              $(".table-upgrade_responsive").slideUp(); 
               if ($('.table-upgrade_responsive').parent().hasClass("slimScrollDiv"))  {
              $('.table-upgrade_responsive').parent().addClass("popcontShow");
            }
              $scope.showsubProDet=false;
           }
        }
        else
        {
           if($scope.showSubscription===false){
                 $scope.showsubProDet=false;
                 $(".promo_content").slideDown();
                 if ($('.table-upgrade_responsive').parent().hasClass("slimScrollDiv"))  {
                     $('.table-upgrade_responsive').parent().addClass("popcontShow");
            }
              $scope.showSubscription=true;
           }
           else{
              $scope.showSubscription=false;  
           }
        }
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('newupgradeRightController','accordionFunc',e,$rootScope.getglobaldata.Client);
    }
       
  }; 

  $scope.bindproductDetails=function()
      { 
       try
       { 
        getproductDetailsUpgrade($scope,$http,$cookieStore,$rootScope); 
        getPromotions($scope,$http,$cookieStore,$rootScope); 
        //getproductDet($scope,$http,$cookieStore,$rootScope); 
        bindcardType($scope,$http,$cookieStore,$rootScope) ; 
        
        var todayDate = new Date(); 
        var yyyy = todayDate.getFullYear() - 1; 
        var range = [];
        for(var i=0;i<10;i++) {
          range.push(yyyy+i);
        } 
        $scope.expyear = range; 
        $scope.ddlmonth = 01;
        $scope.ddlyear = yyyy;
      } 
        catch(e)
        {
          // stackTrace(e);
          stackTrace('newupgradeRightController','bindproductDetails',e,$rootScope.getglobaldata.Client);
        } 
      }; 
  $scope.chgPromotion = function(Score) {   
    try
    { 
      var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "retriveProduct";
    var param = '{ "promotionid":'+ Score.promotionid +'}'; //Data to server 
        $http.post(servicePath, param).success(function (resp) 
          {  
              $scope.productDetails=resp.d;  

          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('newupgradeRightController','chgPromotion',e,$rootScope.getglobaldata.Client);
    }
    
    }; 
    $scope.loadProductPrice = function(Product) {  
      try
      {
         var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "RetriveALLproductprice";
    var param = '{ "productid":'+ Product.prodcode +'}'; //Data to server  
        $http.post(servicePath, param).success(function (response) 
          { 
              //$scope.amount=response.d[0].cost; 
               if(Product.prodcode === "2")
              {
                $scope.amount="24.95";
              }
              else if(Product.prodcode === "3")
              {
                  $scope.amount="74.95";
              }
              else if(Product.prodcode === "4")
              {
                  $scope.amount="119.95";
              }
              else 
              {
                  $scope.amount="1.00";
              }
          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
      }
      catch(e)
      {
        // stackTrace(e);
        stackTrace('newupgradeRightController','loadProductPrice',e,$rootScope.getglobaldata.Client);
      } 
    } ; 
  $scope.saveUpgrade=function(isformvalid){
  try
  { 
        var messageText=$rootScope.getglobalErrorMessage.UPGRADEYEAR;
        var headerText=$rootScope.getglobalErrorMessage.HDRUPGRADE;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
        var cardValidation=$rootScope.getglobalErrorMessage.INFOCREDITCARD;
        //Split the selected date
        var exp_month = $("#ddlmonth").val();
        var exp_year = $("#ddlyear").val(); 
        //Split the Current date
        var todayDate = new Date(); 
        var mm = todayDate.getMonth() + 1; //January is 0!
        mm=(mm.length=1)?'0'+mm:mm; 
        var yyyy = todayDate.getFullYear(); 
        //change the dateformat
        var t1 = yyyy +''+ mm ;
        var t2 = exp_year  + exp_month;   
         $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOPROUPGRADESAVE;
         $scope.headerText=$rootScope.getglobalErrorMessage.HDRUPGRADE;
         $scope.confirmOk=$rootScope.getglobalErrorMessage.BTNYES;
         $scope.confirmCancel=$rootScope.getglobalErrorMessage.BTNNO;
          if (isformvalid) { 
            if ($scope.showControlValidation()){
              if (parseInt(t2,10) < parseInt(t1,10)) {
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);        
              return false;
              } 
              else
              {
                  showLoader();
                  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct"; 
                  var customerPhoneNo = "";
                  var customerIsoCountry = "";
                  var customerExactPhone=0;
                  var customerEmail='';
                  var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
                  var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
                  $http.post(servicePath, param).success(function (respo) 
                  {     
                         $.loader('close'); 
                         var subscriptionId =respo.d[0].RegistrationId; 
                         if (subscriptionId !== null && subscriptionId !== undefined) {
                          var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "UpgradeSubscription";  
                          var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
                          var productcode=$scope.selectedproduct.prodcode; 
                          var param = '{ "promotionName":"' + $scope.selectedpromotion.promocode + '", "productId": ' + productcode +', "SubcriptionId": "' + subscriptionId + '" , "CustomerId": "' + customerId + '", "CreditCardNo": "' + $scope.cardnumber + '", "CardName": "' + $scope.cardname + '", "CreditCardType": "' + $scope.cardtype.DrpText + '", "CVVNumber": "' + $scope.cvv + '", "ExpiryMonth": "' + $("#ddlmonth").val() + '", "ExpiryYear": "' + $("#ddlyear").val() + '", "Amount": "' + $scope.amount + '"}';                                                                     
                          $http.post(servicePath,param).success(function(result)
                          {  
                            if(result.d.isSuccess)
                            {  
                              var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetContractsAvailabilitybyCustomerId";
                              var param = '{ "customerId":"' + parseInt($scope.ServerResponse.CustomerId,10) + '"}'; /* PostData*/
                              $http.post(servicePath, param).success(function (result, status, headers, config) {
                              
                              $scope.contractsAvailabilityData=result.d;
                              localStorage.setItem("ContractAvailability", $scope.contractsAvailabilityData.ContractAvailability);
                              localStorage.setItem("RemainingDays", $scope.contractsAvailabilityData.RemainingDays);
                              if (parseInt(localStorage.getItem("ContractAvailability"),10) === 1) {

                                  $rootScope.contractStatus=$rootScope.getglobalErrorMessage.CONTRACTSTATUSACTIVE;
                                  $rootScope.statusclass="statusactive_color";
                                  $rootScope.remainingDays=localStorage.getItem("RemainingDays");
                                  $rootScope.isremainingdayTextShow=true; 
                              }
                              else
                              { 
                                  $rootScope.contractStatus=$rootScope.getglobalErrorMessage.CONTRACTSTATUSINACTIVE;
                                  $rootScope.statusclass="statusinactive_color";
                                  $rootScope.isremainingdayTextShow=false;
                              }                         
                               }).error(function (serverResponse, status, headers, config) {
                                     $.loader('close'); 
                                  });
                            }
                            else
                            {  
                              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRUPGRADE,$rootScope.getglobalErrorMessage.ERRORUPGRADE,$rootScope.getglobalErrorMessage.BTNOK);
                            } 
                          }).error(function (serverResponse, status, headers, config) {
                                 // alert("failure");
                                 $.loader('close');
                          }); 
                        } 

                }).error(function (serverResponse, status, headers, config) {
                            //alert("failure");
                            $.loader('close');
                }); 
              }
            }   
          } 
  } 
  catch(e)
  {
    // stackTrace(e);
    stackTrace('newupgradeRightController','saveUpgrade',e,$rootScope.getglobaldata.Client);
  }
         
  };

  $scope.showControlValidation=function(){ 
        var messageText=$rootScope.getglobalErrorMessage.UPGRADEYEAR;
        var headerText=$rootScope.getglobalErrorMessage.HDRUPGRADE;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
        var cardValidation=$rootScope.getglobalErrorMessage.INFOCREDITCARD;
        var validCard=$rootScope.getglobalErrorMessage.INFOVALIDCREDIT;
        var creditcard = $('#txt_Cardnumber').val().substr(0,4); 
        if($scope.cardnumber.length < 16){ 
         $("#ngDialogbtnWarningOkButton").focus(); 
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,cardValidation,buttonText);        
         $("#txt_Cardnumber").focus(); 
         return false;
        } 
        else if(creditcard == "0000000000000000"){
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,validCard,buttonText);        
            $("#txt_Cardnumber").focus(); 
            return false;
         }
         else if(creditcard == "0000"){
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,validCard,buttonText);        
            $("#txt_Cardnumber").focus(); 
            return false;
         }
       else{
        return true;
       }
    
  }; 
}); 

//Controller for renew

app.controller( 'newrenewRightController', function newrenewRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {
  $scope.productDetailsRenew = { 
    data: 'productData',
    columnDefs: [{field: 'SerialNo', displayName: 'Serial No', width: "30%"}, {field:'ProductName', displayName:'Product Name', width: "40%"},{field:'PurchaseDate', displayName:'Purchase Date', width: "30%"},{field:'ProductExpired', displayName:'Product Expired', width: "30%"}]
    };
  $scope.bindproductDetails=function()
      {   
        try
        {
        getrenewproductDetails($scope,$http,$cookieStore,$rootScope);  
        bindcardType($scope,$http,$cookieStore,$rootScope) ; 
        var todayDate = new Date(); 
        var yyyy = todayDate.getFullYear() - 1; 
        var range = [];
        for(var i=0;i<10;i++) {
          range.push(yyyy+i);
        }
        $scope.expyear = range; 
        $scope.ddlmonth = 01;
        $scope.ddlyear = yyyy;
        }
        catch(e)
        {
          // stackTrace(e);
          stackTrace('newrenewRightController','bindproductDetails',e,$rootScope.getglobaldata.Client);
        }
           
      }; 
      $scope.showControlValidation=function(){ 
        var messageText=$rootScope.getglobalErrorMessage.UPGRADEYEAR;
        var headerText=$rootScope.getglobalErrorMessage.HDRRENEWAL;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
        var cardValidation=$rootScope.getglobalErrorMessage.INFOCREDITCARD;
        var validCard=$rootScope.getglobalErrorMessage.INFOVALIDCREDIT;
        var creditcard = $('#txt_Cardnumber').val().substr(0,4); 
        if($scope.cardnumber.length < 16){ 
         $("#ngDialogbtnWarningOkButton").focus(); 
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,cardValidation,buttonText);        
         $("#txt_Cardnumber").focus(); 
         return false;
        } 
        else if(creditcard == "0000000000000000"){
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,validCard,buttonText);        
            $("#txt_Cardnumber").focus(); 
            return false;
         }
         else if(creditcard == "0000"){
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,validCard,buttonText);        
            $("#txt_Cardnumber").focus(); 
            return false;
         }
       else{
        return true;
       } 
  }; 
  $scope.saveRenew=function(isformvalid){ 
        try
        {
        var messageText=$rootScope.getglobalErrorMessage.UPGRADEYEAR;
        var headerText=$rootScope.getglobalErrorMessage.HDRRENEWAL;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        var cardValidation=$rootScope.getglobalErrorMessage.INFOCREDITCARD; 
        //Split the selected date
        var exp_month = $("#ddlmonth").val();
        var exp_year = $("#ddlyear").val(); 
        //Split the Current date
        var todayDate = new Date(); 
        var mm = todayDate.getMonth() + 1; //January is 0!
        mm=(mm.length=1)?'0'+mm:mm; 
        var yyyy = todayDate.getFullYear(); 
 
        //change the dateformat
        var t1 = yyyy +''+ mm ;
        var t2 = exp_year  + exp_month;  
        
        
         $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOPROUPGRADESAVE;
         $scope.headerText=$rootScope.getglobalErrorMessage.HDRRENEWAL;
         $scope.confirmOk=$rootScope.getglobalErrorMessage.BTNYES;
         $scope.confirmCancel=$rootScope.getglobalErrorMessage.BTNNO;
         if (isformvalid) { 

          if ($scope.showControlValidation()){
              if (parseInt(t2,10) < parseInt(t1,10)) {
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);        
              return false;
              } 
              else
              {
                showLoader(); 
                  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";                   
                  var customerPhoneNo = "";
                  var customerIsoCountry = "";
                  var customerExactPhone=0;
                  var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
                  var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
                  $http.post(servicePath, param).success(function (respo) 
                  {      
                         $.loader('close');
                         var subscriptionId =respo.d[0].RegistrationId; 
                         if (subscriptionId !== null && subscriptionId !== undefined) {   
                          var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "RenewSubscription";  
                          var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
                          var param = '{ "SubcriptionId": "' + subscriptionId + '" , "CustomerId": "' + customerId + '", "CreditCardNo": "' + $scope.cardnumber + '", "CardName": "' + $scope.cardname + '", "CreditCardType": "' + $scope.cardtype.DrpText + '", "CVVNumber": "' + $scope.cvv + '", "ExpiryMonth": "' + $("#ddlmonth").val() + '", "ExpiryYear": "' + $("#ddlyear").val() + '", "Amount": "' + $scope.renewamount + '"}';                      
                          $http.post(servicePath,param).success(function(result)
                          {      
                            if(result.d.isSuccess)
                            {
                               // alert(result.d.StatusMessage);
                            }
                            else
                            {
                               showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRRENEWAL,$rootScope.getglobalErrorMessage.ERRORUPGRADE,$rootScope.getglobalErrorMessage.BTNOK);
                            } 
                          }).error(function (serverResponse, status, headers, config) {
                                 // alert("failure");
                                 $.loader('close');
                          }); 
                        } 

                }).error(function (serverResponse, status, headers, config) {
                      $.loader('close');
                            //alert("failure");
                });
              }
            } 
          } 
        }
        catch(e)
        { 
          // stackTrace(e);
          stackTrace('newrenewRightController','saveRenew',e,$rootScope.getglobaldata.Client);
        }
        }; 
}); 

function getproductDetailsUpgrade($scope,$http,$cookieStore,$rootScope){  
try
{  
  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetProduct"; 
    var customerEmail = localStorage.getItem("CustomerEmail");
    var customerPhoneNo = "";
    var customerIsoCountry = "";
    var customerExactPhone=0;
    var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
    var param = '{ "customerId":'+ customerId +', "email": "'+customerEmail+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
     
    $http.post(servicePath, param).success(function (resp) 
        {     
            if(resp.d !== null)
            { 
              var servicePathNew = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct"; 
               
                $http.post(servicePathNew, param).success(function (result) 
                {   
                    //$scope.productDetailsNew=result.d;
                  $scope.productDetailsNew=result.d;  
                  angular.forEach($scope.productDetailsNew, function(value, key) {   
                    mystr=value.ProductName;
                    var withspace=mystr[mystr.length-1]; 
                    var numvahr="";
                    if($.isNumeric(mystr[mystr.length-2])){
                      numvahr=mystr[mystr.length-2]; 
                    }
                    if($.isNumeric(mystr[mystr.length-1])){
                      numvahr= numvahr+mystr[mystr.length-1]; 
                    }  
                    if(parseInt(numvahr,10) === 1){ 
                      $scope.productDetailsNew[0].ProductName="ACTM - 30 Days";
                    }
                    else if(parseInt(numvahr,10) === 6){
                      $scope.productDetailsNew[0].ProductName="ACTH - 6 Month Support";
                    }
                    else if(parseInt(numvahr,10) === 12){
                      $scope.productDetailsNew[0].ProductName="ACTY - 12 Month Support";
                    }
                });
              });
            }
            else {  
              //$scope.productDetailsNew=resp.d;
              $scope.productDetailsNew=result.d;
            }
            $('.table-upgrade_responsive').slimScroll({
                wheelStep: 1,
                width: "100%",
                 height: "10vw",
                 display : "none"
              });
            if ($('.table-upgrade_responsive').parent().hasClass("slimScrollDiv"))  {
                     $('.table-upgrade_responsive').parent().addClass("popcontShow");
            }
        }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
        });
} 
catch(e)
{
  // stackTrace(e);
  stackTrace('newrenewRightController','getproductDetailsUpgrade',e,$rootScope.getglobaldata.Client);
} 
}

function getproductDet($scope,$http,$cookieStore,$rootScope){  
try
{
  var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";
      var customerPhoneNo = "";
      var customerIsoCountry = "";
      var customerExactPhone=0;
      var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
      var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
      $http.post(servicePath, param).success(function (resp) 
          { 
              //$scope.productDetails=resp.d;  
              $scope.productDetails = $rootScope.prodDetail; 
          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
} 
catch(e)
{
  // stackTrace(e);
  stackTrace('newrenewRightController','getproductDet',e,$rootScope.getglobaldata.Client);
}   
}

  function getrenewproductDetails($scope,$http,$cookieStore,$rootScope){
  try
  {
      showLoader();
      var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";
      var customerPhoneNo = "";
      var customerIsoCountry = "";
      var customerExactPhone=0;
      var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
      var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
      $http.post(servicePath, param).success(function (resp) 
          { 
            $.loader('close');
              $scope.productDetailsRenew=resp.d;  
        //       angular.forEach($scope.productDetailsRenew, function(value, key) {   
        //         mystr=value.ProductName;
        //         var withspace=mystr[mystr.length-1]; 
        //         var numvahr="";
        //         if($.isNumeric(mystr[mystr.length-2])){
        //           numvahr=mystr[mystr.length-2]; 
        //         }
        //         if($.isNumeric(mystr[mystr.length-1])){
        //           numvahr= numvahr+mystr[mystr.length-1]; 
        //         }  
        //         if(parseInt(numvahr,10) === 1){ 
        //           $scope.productDetailsRenew[0].ProductName="ACTM - 30 Days";
        //         }
        //         else if(parseInt(numvahr,10) === 6){
        //           $scope.productDetailsRenew[0].ProductName="ACTH - 6 Month Support";
        //         }
        //         else if(parseInt(numvahr,10) === 12){
        //           $scope.productDetailsRenew[0].ProductName="ACTY - 12 Month Support";
        //         }
        // });  
              $scope.amount=resp.d[0].Amount;  
          }).error(function (serverResponse, status, headers, config) {
              $.loader('close');
          });
  }  
  catch(e)
  {
    // stackTrace(e);
    stackTrace('newrenewRightController','getrenewproductDetails',e,$rootScope.getglobaldata.Client);
  } 
  }

  function getPromotions($scope,$http,$cookieStore,$rootScope) {
  try
  {
    var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";
    var customerPhoneNo = "";
    var customerIsoCountry = "";
    var customerExactPhone=0;
    var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
    var param = '{ "customerId":'+ customerId +', "email": "'+ localStorage.getItem("CustomerEmail") +'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
    $http.post(servicePath, param).success(function (respo) 
        {    
           var subscriptionId =respo.d[0].RegistrationId; 
            if (subscriptionId !== null && subscriptionId !== undefined) {   
              var promotionservicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "RetriveALLPromotion"; 
              var params = '{ "subscriptionid":'+ subscriptionId +'}'; //Data to server  
                $http.post(promotionservicePath, params).success(function (respon) 
                { 
                 $scope.promotiondetails= respon.d; 
                 //$scope.promotiondetails=respon.d;
                 }).error(function (serverResponse, status, headers, config) { 
                });  
            }

        }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
        }); 
  }
  catch(e)   
  {
    // stackTrace(e);
    stackTrace('newrenewRightController','getPromotions',e,$rootScope.getglobaldata.Client);
  } 
  }

  function bindcardType($scope,$http,$cookieStore,$rootScope){ 
  try
  { 
    var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetDrpDetails";       
      var param = '{ "typeName": "CardType"}'; //Data to server  
      $http.post(servicePath, param).success(function (resp) 
          { 
              $scope.cardtypes=resp.d; 

          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
  } 
  catch(e)
  {
    // stackTrace(e);
    stackTrace('newrenewRightController','bindcardType',e,$rootScope.getglobaldata.Client);
  }  
  }

  function bindcardExpirymonth($scope,$http,$cookieStore,$rootScope){ 
  try
  {
    var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetDrpDetails";       
      var param = '{ "typeName": "ExpMonth"}'; //Data to server  
      $http.post(servicePath, param).success(function (resp) 
          {
              $scope.cardExpiryMonths=resp.d; 

          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
  }
  catch(e)  
  {
    // stackTrace(e);
    stackTrace('newrenewRightController','bindcardExpirymonth',e,$rootScope.getglobaldata.Client);
  } 
  }

  function bindcardExpiryyear($scope,$http,$cookieStore,$rootScope){
  try
  {
    var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetDrpDetails";       
      var param = '{ "typeName": "ExpYear"}'; //Data to server  
      $http.post(servicePath, param).success(function (resp) 
          {
              $scope.cardExpiryYears=resp.d; 

          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
  } 
  catch(e)  
  {
    // stackTrace(e);
    stackTrace('newrenewRightController','bindcardExpiryyear',e,$rootScope.getglobaldata.Client);
  }      
  } 

  function renewUpgrade($rootScope) {
    try{
    var country = localStorage.getItem("Country");
      var portalId = localStorage.getItem("PortalId");
    if (country == "UnitedStates")
    {
        country = "United States"; 
    }
    // var url=$rootScope.getglobaldata.renew + portalId + '&nextpage=GHtransaction&country=' + country + '&source=csscorp';
    // redirectToproductUpgrade(url);
    var url=$rootScope.getglobaldata.renew + portalId + '&nextpage=GHtransaction&country=' + country + '&source=csscorp';
    window.external.redirectToproductUpgrade(url);
   }
  catch(e){
    // stackTrace(e);
    stackTrace('newrenewRightController','renewUpgrade',e,$rootScope.getglobaldata.Client);
  }
}
function preventBackspace(e) {
        var evt = e || window.event;
        if (evt) {
            var keyCode = evt.charCode || evt.keyCode;
            if (keyCode === 8) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            }
        }
    } 

 
 


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
angular.module( 'activei.manageaccount', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'manageaccount', {
    url: '/manageaccount',
	views:{
      "RightView":{
        template:"",
        controller:"manageAccountRightController"
		
		}
    },
    data:{ pageTitle: 'ManageAccount' }
  });
})

.controller( 'manageAccountRightController', function manageAccountRightController(  $scope,$http ,$rootScope,$cookieStore ,$state) {
// $rootScope.polyInit();
    $rootScope.isMiddleCont = true; 
  $('#background_logo').removeClass().addClass('cont_bg_logo');
});


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
angular.module('activei.messagecenter', ['ui.router'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('messagecenter', {
        url: '/messagecenter',
        views: {
            "RightView": {
                templateUrl: "messagecenter/messagecenterRight.tpl.html",
                controller: "messagecenterRightController"

            }
        },
        data: { pageTitle: 'MessageCenter' }
    });
})
//controller initialization
.controller('messagecenterRightController', function messagecenterRightController($scope, $rootScope, $http, $cookieStore, $state) {
    $rootScope.isMiddleCont = true;
    $('#background_logo').removeClass().addClass('cont_bg_logo');
    //Get message details
    $scope.getMessageDetails = function () {
        showLoader();
        if($rootScope.getglobaldata.Client === "GearHead"){
          $scope.socialshow=true;
        }
        getMessageDetailsList($scope, $http, $cookieStore, $rootScope);
        showSocial();
    };

    //view the message description
    $scope.redirecttoMessageDescription = function (ID, redirectionPageID) {
        // console.log('ne sdlkk fasd sddf sa');
        try{
        redirectTomsgView(ID, redirectionPageID, $scope, $http, $cookieStore, $rootScope);
      }
      catch(e){
        stackTrace('messagecenterRightController','redirecttoMessageDescription',e,$rootScope.getglobaldata.Client);
      }
    };

});

//Get message details 
function getMessageDetailsList($scope,$http,$cookieStore,$rootScope)
{ 
  try
  {
    var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetmessageDetails";   
        var param = ""; 
        $http.post(servicePath, param).success(function (result) 
        {
          $.loader('close');
            var  content= '';
            $scope.Messagelist = result.d; 
        }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
            $.loader('close');
        });
  }
    catch(e)  
  {
    // stackTrace(e);
    stackTrace('messagecenterRightController','getMessageDetailsList',e,$rootScope.getglobaldata.Client);
  }     
}

 //functionality to view message description
function redirectTomsgView(ID, redirectionPageID,$scope,$http,$cookieStore,$rootScope)
{  
  try
  {
     showLoader();
     $rootScope.isnewpage=true;
      var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetmessageviewDetails";                 
      var params = '{ "msgID":"' + ID + '"}'; 
      $http.post(servicePath, params).success(function (result) 
          {  
            $.loader('close');
            var msglist = result.d[0];  
            var epochMilliseconds = msglist.Publishedon.replace(/^\/Date\(([0-9]+)([+-][0-9]{4})?\)\/$/,'$1');
            var b = new Date(parseInt(epochMilliseconds,''));
            var c = new Date(b.toString());
            var curr_date = c.getDate();
            var curr_month = c.getMonth() + 1;
            var curr_year = c.getFullYear();
            var curr_h = c.getHours();
            var curr_m = c.getMinutes();
            var curr_s = c.getSeconds();
            var curr_offset = c.getTimezoneOffset() / 60;
            var publisheddate = curr_month.toString() + '/' + curr_date + '/' + curr_year; 
 
           $(".right_bg_cont_msgcenter").empty();    
             result = "<div class=\"view_alert\"><h1>" + "Message Center" + "</h1><p></br>" + msglist.MessageTitle + "</p></br><span style='font-size:15px;'>" + msglist.ShortDescription + "</br></br>" +  publisheddate + "</span></div>";           
           $(".right_bg_cont_msgcenter").html(result) ; 

           var serviceUrl=$rootScope.getglobaldata.getGlobalServiceUrl+"SaveReadMessageDetails"; 
           var serviceParam='{ "msgID": "' + ID + '", "CustomerID": "' + localStorage.getItem('StoredCustomerID') + '"}';
           $http.post(serviceUrl, serviceParam).success(function (result) 
            { 
                $.loader('close');
            }).error(function (serverResponse, status, headers, config) {
              $.loader('close');
              //alert("failure");
            });
       
        }).error(function (serverResponse, status, headers, config) {
          $.loader('close');
            //alert("failure");
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('messagecenterRightController','redirectTomsgView',e,$rootScope.getglobaldata.Client);
  }

}

function showSocial() { 
    $('[data-popup-target]').click(function () {
        $('html').addClass('overlay');
        var activePopup = $(this).attr('data-popup-target');
        $(activePopup).addClass('visible');

    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27 && $('html').hasClass('overlay')) {
            clearPopup();
        }
    });

    $('.popup-exit').click(function () {
        clearPopup();

    });

    $('.popup-overlay').click(function () {
        clearPopup();
    });
}

function clearPopup() {
    $('.popup.visible').addClass('transitioning').removeClass('visible');
    $('html').removeClass('overlay');

    setTimeout(function () {
        $('.popup').removeClass('transitioning');
    }, 200);
}
function googPlus() {
    document.getElementById("hrefgplus").innerHTML = "<div class=\"g-page\" data-width=\"410\" data-href=\"https://plus.google.com/107087502395383715305/\" data-rel=\"publisher\"></div>";
}

// $(document).ready(function(){       
//         $('#twitter').contents().find('href').click(function(event) {
//             alert("demo only");

//             event.preventDefault();

//         }); 
// });


   
    



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
 


//var __lc = {};
//__lc.license = 1075634;
//__lc.skill = 1;
//__lc.params = [
//    { name: 'Name', value: getCookie("FirstName") },
//    { name: 'Email', value: getCookie("CustomerEmail") }
//  ];
//(function () {
//    var lc = document.createElement('script'); lc.type = 'text/javascript'; lc.async = true;
//    lc.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdn.livechatinc.com/tracking.js';
//    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(lc, s);
//})();

//var LC_API = LC_API || {};
//LC_API.on_after_load = function () {
//    LC_API.open_chat_window();
//};

var RNChat_Available_Sessions = -1;

//for RBU
RightNow.Client.Controller.addComponent({
    min_agents_avail_type: "sessions",
    label_dialog_header: "",
    label_title: "",
    label_question: "checking status",
    seconds: 0,
    instance_id: "PAC_obj",
    div_id: "chat",
    module: "ProactiveChat",
    type: 2,
    c: 1520
},
            "https://netgear-us.widget.custhelp.com/ci/ws/get"
        );

function onRNPACStatusResponse(type, args, instance) {
    result = args[0].data;

    if (result.availableAgentSessions > 0)
    {
        RNChat_Available_Sessions = result.availableAgentSessions;
    }
    else{ 
        RNChat_Available_Sessions = 0;
    }

    window.setTimeout(function () {
        PAC_obj.chatAvailability();
    }, 300000); //refresh after 5 mins

    updateChatStatus();
}

function setupForChatAvailabilityCheck() {
    if (typeof RightNow.Client.Event.evt_chatAvailabilityResponse === "undefined"){
        window.setTimeout(setupForChatAvailabilityCheck, 3000); // RN Client is not init yet. check after 3 secs
    }
    else {
        RightNow.Client.Event.evt_chatAvailabilityResponse.subscribe(onRNPACStatusResponse);
        startCheckChatAvail();
    }
}

setupForChatAvailabilityCheck();

function startCheckChatAvail() {
    if (RNChat_Available_Sessions != -1) {return;} //already triggered the first chat for all instances
    else {
        if (typeof PAC_obj === "undefined"){
            window.setTimeout(startCheckChatAvail, 3000); // RBU instance is not init yet. check after 3 secs		
        }
        else{
            PAC_obj.chatAvailability();
        }
    }
}

function updateChatStatus() {
    if (RNChat_Available_Sessions > 0) {
        //TODO: available
        //document.getElementById("chatstatus").innerHTML = '<a href="#" onclick="alert(\'user clicked chat, dosomething()\');">Chat Online</a> <!-- available sessions: ' + (RNChat_Available_Sessions) + ' -->';
        return true;
    }
    else {
        //TODO: not available
        //document.getElementById("chatstatus").innerHTML = 'Chat offline';
        return false;
    }
}
  

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
angular.module( 'activei.contactsupport', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'contactsupport', {
    url: '/contactsupport',
	views:{
           "RightView":{
        template:"",
        controller:"contactSupportRightController"
		
		}
    },
    data:{ pageTitle: 'ContactSupport' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'contactSupportRightController', function contactSupportRightController( $scope ,$rootScope,$http,$state) {
  $rootScope.isMiddleCont = true;
  // $rootScope.polyInit();
   $('#background_logo').removeClass().addClass('cont_bg_logo');
  });
    



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
angular.module( 'activei.knowledgebase', ['fundoo.directives','ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'knowledgebase', {
    url: '/knowledgebase',
  views:{
           "RightView":{
        templateUrl:"support/knowledgebase/knowledgeBaseRight.tpl.html",
        controller:"knowledgeBaseRightController"
    
    }
    },
    data:{ pageTitle: 'Knowledge Base' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller('knowledgeBaseRightController',['$scope','$rootScope','$cookieStore','$http','$state','FlickrApi','ngDialog','$interval','$window', function knowledgeBaseRightController( $scope ,$rootScope,$cookieStore,$http,$state,flickr,ngDialog,$interval,$window) {
  $rootScope.isMiddleCont = true;
  $scope.showPopular=false;
  $scope.showRecomend=false;
  $scope.showPopularCont=false;
  $scope.pop_content="Popular Content";
  $scope.rec_content="Recommended Content";  
  $scope.ispageload=true;
/*$scope.productdetail=[
  
    {
      "proId" : "C3000",
      "proValue" : "C3000"
    },
    {
      "proId" : "C3700",
      "proValue" : "C3700"
    }
 
];*/
 

$scope.bindrecContentDetails=function()
{
  try
   {  
      if($rootScope.kbFlag != null){ 
      $scope.txtSearch = $rootScope.kbFlag;
      $scope.searchContent(); 
    }
    bindpopularDetails($scope,$http,$cookieStore,$rootScope);
    bindrecomDetails($scope,$http,$cookieStore,$rootScope);
    }
    //$scope.txtSearch = "test" ; //flickr.get();  
   catch(e)
   {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','bindrecContentDetails',e,$rootScope.getglobaldata.Client);
   }
};



$scope.indexSet=function()
{
  $scope.startIndex=10;
  $scope.previousIndex=0;
  $scope.totalRecords=0;
};

$scope.showNextContent=function(){
  try{
    var startindex = $scope.startIndex;
    var previousindex =$scope.previousIndex;
    var totalrecords = $scope.totalRecords;
    if($('.previousPage').hasClass("disableText"))
    { 
      $('.previousPage').removeClass("disableText");
    }
    if (parseInt(startindex,10) < parseInt(totalrecords,10)) {
         $scope.previousIndex=parseInt(startindex,10);
         $scope.startIndex=parseInt(startindex,10) + 10;
         showLoader();
         searchCont($http,$scope,$scope.txtSearch,parseInt(startindex,10),8);
    }
    else
    { 
      $('.nextPage').addClass("disableText");
    } 
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showNextContent',e,$rootScope.getglobaldata.Client);
  }
};

$scope.showPreviousContent=function() {
  try{
    var previousindex = $scope.previousIndex;
    if (previousindex !== 0) {
      if (previousindex === 10) {
           $scope.startIndex=10;
            $scope.previousIndex=0;
               $('.previousPage').addClass("disableText");
        } else {
            $scope.startIndex=parseInt(previousindex,10);
            $scope.previousIndex=parseInt(previousindex,10) - 10;
        }
        showLoader();
       searchCont($http,$scope,$scope.txtSearch,(parseInt(previousindex,10) - 10),8);
    }
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showPreviousContent',e,$rootScope.getglobaldata.Client);
  }
};


$scope.redirectToKBContentView=function(Id,Originid,originname)
{  
  try{
  showLoader();
   popularkbContentview(ngDialog,$scope,$http,$cookieStore,$rootScope,Id,Originid,originname);
 }
 catch(e){
  stackTrace('knowledgeBaseRightController','redirectToKBContentView',e,$rootScope.getglobaldata.Client);
 }
};

$scope.searchContent=function()
{  
  try{
  if ($scope.txtSearch!=="" && $scope.txtSearch !== undefined) 
  {  
    $rootScope.kbFlag = $scope.txtSearch;
    showLoader();
    searchCont($http,$scope,$scope.txtSearch,0,8);
    $scope.startIndex=10;
    $scope.previousIndex=0;
  }
  else{
     showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRKNOWLEDGEBASE,$rootScope.getglobalErrorMessage.INFOSEARCHCONT,$rootScope.getglobalErrorMessage.BTNOK);
  }
}
catch(e){
  stackTrace('knowledgeBaseRightController','searchContent',e,$rootScope.getglobaldata.Client);
}
};
$scope.productPopup=function(searchText){
$scope.headerText=$rootScope.getglobalErrorMessage.HDRSERACHPRODUCT;
$scope.searchText=searchText;
     ngDialog.openConfirm({
                    template: 'searchDialog',
                    className: 'ngdialog-theme-default',
                    plain: false,
                    scope: $scope
                  })
     .then(function(val){
          $rootScope.selectedproducttype=$('#proId').text();
         
          bindpopularDetails($scope,$http,$cookieStore,$rootScope);
           bindrecomDetails($scope,$http,$cookieStore,$rootScope);
     });
};
/*$scope.selectedProduct= function()
{
  $scope.loadproductfamily();
    $("#productCategory option:contains(" + $scope.searchText + ")").attr('selected', 'selected');
};*/
/*$scope.loadproductfamily =function()
{
     '<option value="tcm:122-58378-1024">Access Points &amp; Wireless Extenders</option>
            <option value="tcm:122-42208-1024">Adapters</option>
            <option value="tcm:122-81475-1024">Apps</option>
            <option value="tcm:122-42209-1024">Entertainment</option>
            <option value="tcm:122-74268-1024">Mobile Broadband</option>
            <option value="tcm:122-42210-1024">Phoneline</option>
            <option value="tcm:122-42211-1024">Powerline &amp; Coax</option>
            <option value="tcm:122-42212-1024">Print Servers</option>
            <option selected="selected" value="tcm:122-42215-1024">Routers, Modems &amp; Gateways</option>
            <option value="tcm:122-58380-1024">Storage</option>
            <option value="tcm:122-58381-1024">Unmanaged Switches</option>
            <option value="tcm:122-59529-1024">Video Monitoring</option>
            <option value="tcm:122-42218-1024">VOIP,Skype</option>'
};*/
/*$scope.showproducttypedetails =function(proCategory)
{
 $scope.proDetailsshow=true;
  if (proCategory.proId==="C3000") {
    $scope.pro_image="http://support.netgear.com/images/C3000_thumb_tcm122-81244.png";
    $scope.productId=proCategory.proId;
  }
  else{
     $scope.pro_image="http://support.netgear.com/images/C3700_thumb_tcm122-81249.png";
    $scope.productId=proCategory.proId;
  }

};
*/

$scope.accordionFun=function(clickedHeader)
{
if (clickedHeader==='recommend') {
  if($scope.showRecomendCont===false && $scope.norecordsShowRecomnd===false){
      if($scope.recomContent !== "" && $scope.recomContent !== null && $scope.recomContent !== undefined)
      {
        $scope.showPopularCont=false;
        $scope.norecordsShowRecomnd=false;
        $scope.showRecomendCont=true;
      }
      else
      {
        $scope.showPopularCont=false;
        $scope.norecordsShowRecomnd=true;
        $scope.showRecomendCont=false;
      }
      
   }
   else{
      $scope.norecordsShowRecomnd=false;
      $scope.showRecomendCont=false;
   }
}
else if(clickedHeader==='popular'){
   if($scope.showPopularCont===false){
      if($scope.recomContent !== "" && $scope.recomContent !== null && $scope.recomContent !== undefined)
      {
        $scope.showRecomendCont=false;
      }
      else
      {
        $scope.norecordsShowRecomnd=false;
      }
      $scope.showPopularCont=true;
   }
   else{
      $scope.showPopularCont=false;  
   }
}
else{
    if($scope.showSearchCont===false){
      if($scope.seaContent !== "" && $scope.seaContent !== null && $scope.seaContent !== undefined)
      {
          $scope.showSearchCont=true;
          $scope.nextPrevShow=true;
          $scope.norecordsShow=false;
      }
      else
      {
        $scope.showSearchCont=false;
        if($scope.norecordsShow===true){
          $scope.norecordsShow=false;
          $scope.nextPrevShow=false;
        }
        else
        {
          $scope.nextPrevShow=false;
          $scope.norecordsShow=true;
        }
      }
     }
   else{
      $scope.showSearchCont=false; 
      $scope.nextPrevShow=false;
   }
}

};
$scope.loadproductfamily = function () {
  try{
     var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $("#productCategory").html("");
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, $scope.searchText);
    $("#productCategory").html(productDetails);
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproductfamily',e,$rootScope.getglobaldata.Client);
  }
};
$scope.loadproductfamilyonchange =function(){
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $("#profamily").html("");
    var selectedValue = $("#productCategory option:selected").text();
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);   
    $("#profamily").html(productDetails);
    $("#productType").html("");
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproductfamilyonchange',e,$rootScope.getglobaldata.Client);
  }
};

$scope.loadproducttype = function(){
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;

    $("#productcategory").html("");
    var selectedValue = $("#profamily option:selected").text();
    var productDetails = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);
    $("#productType").html(productDetails);
    document.getElementById("proDetailsshow").style.display = 'none';
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','loadproducttype',e,$rootScope.getglobaldata.Client);
  }
};

$scope.showproducttypedetails = function() {
  try{
    var ngproductdetailsurl = $rootScope.getglobaldata.Client;
    $scope.proDetailsshow=true;
    document.getElementById("proDetailsshow").style.display = 'block';
    var selectedValue = $("#productType option:selected").text();
    $("#proId").html(selectedValue);
    var imagePath = window.external.getKBProductDetails(ngproductdetailsurl, selectedValue);
    $("#productImage").attr("src", imagePath);
  }
  catch(e){
    stackTrace('knowledgeBaseRightController','showproducttypedetails',e,$rootScope.getglobaldata.Client);
  }
};
$scope.initProLoad = function()
{
  $scope.proDetailsshow=false;
};
var pageCount=0;

 var carousel;

    $scope.hasPrevious = function() {
      return carousel ? carousel.hasPrevious() : false;
    };
    $scope.previous = function() {
      if (carousel) { carousel.prev(); }
    };
    $scope.hasNext = function() {
      return carousel ? carousel.hasNext() : false;
    };
    $scope.next = function() {
      if (carousel) { carousel.next(); }
    };

    var loadPhotos = function(carouselScope, page) {
      carousel.updatePageCount(2);
      carouselScope.photos = flickr.getPhotos(page);
      carouselScope.getPhotoUrl = function(photo) {
        return flickr.getPhotoUrl(photo);
      };
      carouselScope.getProText = function(photo) {
        return flickr.getProText(photo);
      };
      carouselScope.getSearchPro = function(photo) {
        return flickr.getSearchPro(photo);
      };


    };
    $scope.loadPage = function(page, tmplCb) {
      var newScope = $scope.$new();
      loadPhotos(newScope, page);
      tmplCb(newScope);
    };
    $scope.onCarouselAvailable = function(car) {
      carousel = car;
    };
  }])

.factory('FlickrApi', function() {
    var savedData = null;
    function set(data) { 
      savedData = data;
    }
    function get() {
      return savedData;
    }
    var pages =  [
    [
        {
            "img": "assets/Content/img/products/wnda3100_productimage_large18-5798_tcm122-50171.png",
            "searchpro" : "tcm:122-42208-1024",
            "textval" : "Adapters"
        },
        {
            "img": "assets/Content/img/products/home_product5_tcm122-50178.png",
            "searchpro" : "tcm:122-42215-1024",
            "textval" : "Routers, Modems & Gateways"
        },
        {
            "img": "assets/Content/img/products/home_product7_tcm122-50174.png",
            "searchpro" : "tcm:122-42211-1024",
            "textval" : "Powerline Coax"
        },
        {
            "img": "assets/Content/img/products/access - home_tcm122-50170.png",
            "searchpro" : "tcm:122-58378-1024",
            "textval" : "Access Points & Wireless Extenders"
        }
        
    ],
    [
        {
            "img": "assets/Content/img/products/readynas - Home_tcm122-50177.gif",
            "searchpro" : "tcm:122-58380-1024",
            "textval" : "Storage"
        },
        {
            "img": "assets/Content/img/products/home_product3_tcm122-50172.png",
            "searchpro" : "tcm:122-42209-1024",
            "textval" : "Entertainment"
        },
        {
            "img": "assets/Content/img/products/dual_indoor_cam_vuezone_tcm122-59558.png",
            "searchpro" : "tcm:122-59529-1024",
             "textval" : "Video Monitoring" 
        },
        {
            "img": "assets/Content/img/products/switches - home_tcm122-50842.png",
            "searchpro" : "tcm:122-58381-1024",
            "textval" : "Unmanaged Switch"
        }
    ]
];
    return {
      set: set,
      get: get,
      getPhotos: function(page) {
        // Ideally, go off and fetch the next page of data fromt he server, but we'll do it locally in the sample
        return pages[page];
      },
      getPhotoUrl: function(photo) {
        return photo.img;
      },
      getProText: function(photo) {
        return photo.textval;
      },
      getSearchPro: function(photo) {
        return photo.searchpro;
      }
    };
  });
    

function bindrecomDetails($scope,$http,$cookieStore,$rootScope)
{
  try{
      var servicePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetKBRecommendedContent";
      // var servicePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetKBRecommendedContent";
      
      // var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetKBRecommendedContent";
      var selectedValue =$rootScope.selectedproducttype;
      var params='{ "limit" : 3, "productName" : "'+ selectedValue +'"}';
      showLoader();
      $http.post(servicePath, params).then(function (resp, status, headers, config) 
          {
             $.loader('close');
              if (resp.data.d !== null) {
                 $scope.recomContent=resp.data.d;
                 $scope.showRecomend=true;
                 $scope.showPopular=true;
                 $scope.showsearch=false;
                 $scope.showSearchCont=false;
                 $scope.showRecomendCont=false;
                 $scope.nextPrevShow=false;
                if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
                   $('.popular_cont').parent().removeClass("popcontShow");
                }
                if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
                  $('.sea_cont').parent().addClass("popcontShow");
                }
              }
              else
              {
                 $scope.showRecomend=true;
                 $scope.showPopular=true;
                 $scope.showsearch=false;
                 $scope.showSearchCont=false;
                 $scope.nextPrevShow=false;
                 $scope.showRecomendCont=false;
                 $scope.norecordsShowRecomnd=true;
                 $scope.recomContent="";
                  if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
                  // $('.popular_cont').parent().addClass("popcontShow");
                }
                if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
                  $('.sea_cont').parent().addClass("popcontShow");
                }
              }
              $scope.accordionFun('recommend');
          }).error(function (serverResponse, status, headers, config) {
              $.loader('close');
              stackTrace("failure");
          });
      }
      catch(e)
      {
      // stackTrace(e);
      stackTrace('knowledgeBaseRightController','bindrecomDetails',e,$rootScope.getglobaldata.Client);
      }
}
function bindpopularDetails($scope,$http,$cookieStore,$rootScope)
{
  try
  {
    var servePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetPopularContent";
    // var servePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "GetPopularContent";
    // var servePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetPopularContent";
    var param='{ "limit" : 10}';
    $http.post(servePath, param).then(function (response, status, headers, config) 
    {
         $scope.popularContent=response.data.d;
          $scope.showPopular=true;
           $scope.showRecomend=true;
           $scope.showsearch=false;
            $scope.showSearchCont=false;
           $('.popular_cont').slimScroll({
              wheelStep: 5,
              height   : "14vw",
              width    : "99%"
            });
    if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
       $('.popular_cont').parent().removeClass("popcontShow");
    }
    if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
      $('.sea_cont').parent().addClass("popcontShow");
    }
    }).error(function (serverResponse, status, headers, config) {
      $.loader('close');
    });
  }
  catch(e)
  {  
    bindrecomDetails($scope,$http,$cookieStore,$rootScope);
    indexSet(); 
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','bindpopularDetails',e,$rootScope.getglobaldata.Client);
  }

}

function searchCont($http,$scope,searchText,startindex,limit)
{
  try
  {
    var servePath = "https://ghstaging.csscorp.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "SearchContent";
    // var servePath = "http://gc.gearheadsupport.com/NetgearClientService/CSSNetgearService/NetgearClientService.asmx/" + "SearchContent";
    // var servePath = $rootScope.getglobaldata.getGlobalServiceUrl + "SearchContent";
    var param= '{ "searchTerm" : "' + searchText + '", "startIndex" : ' + parseInt(startindex,10) + ', "limit" : ' + parseInt(limit,10) + '}';
    $http.post(servePath, param).then(function (response, status, headers, config) 
    {
      $.loader('close');
      if(response.data.d !== null)
      {
        if($scope.startIndex === undefined){
          $scope.startIndex=10;
        }
         $scope.seaContent=response.data.d;
         $scope.norecordsShow="false";
         $scope.totalRecords=response.data.d[0].TotalResults;
         $scope.searc_content="Search Results";
         $scope.showsearch=true;
         $scope.showRecomend=false;
         $scope.showPopular=false;
         $scope.showRecomendCont=false;
         $scope.showPopularCont=false;
         $scope.showSearchCont=true;
         $scope.nextPrevShow=true;
          $('.sea_cont').slimScroll({
            wheelStep: 10,
            height   : "15vw",
            width    : "99%"
          });

          if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
            $('.popular_cont').parent().addClass("popcontShow");
          }
          if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
            $('.sea_cont').parent().removeClass("popcontShow");
          }
      }
      else
      {
          $scope.seaContent="";
         $scope.norecordsShow="true";
         $scope.searc_content="Search Results";
         $scope.showsearch=true;
         $scope.showRecomend=false;
         $scope.showPopular=false;
         $scope.showRecomendCont=false;
         $scope.showPopularCont=false;
         $scope.nextPrevShow=false;
          if ($('.popular_cont').parent().hasClass("slimScrollDiv"))  {
            $('.popular_cont').parent().addClass("popcontShow");
          }
         if ($('.sea_cont').parent().hasClass("slimScrollDiv"))  {
            $('.sea_cont').parent().addClass("popcontShow");
          }
      }

    }).error(function (serverResponse, status, headers, config) {
      $.loader('close');
    });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','searchCont',e,$rootScope.getglobaldata.Client);
  } 
}

function popularkbContentview(ngDialog,$scope,$http,$cookieStore,$rootScope,Id,Originid,originname)
{     
  try
  { 
     $rootScope.isnewpage=true;
      var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetContent";                      
      var params = '{ "answerContentID":' + Id + ', "viewOriginID" : ' + Originid + ', "viewOriginName" : "' + originname + '"}';      
      $http.post(servicePath, params).success(function (result) 
          { 
            $.loader('close');
            if (result.d === null) {
              var headerText = ($rootScope.getglobaldata.Client === 'GearHead') ? $rootScope.getglobalErrorMessage.APPHDRGEARHEAD : $rootScope.getglobalErrorMessage.APPLICATIONHDR;
              var buttonText = $rootScope.getglobalErrorMessage.BTNOK;
              var messageText= $rootScope.getglobalErrorMessage.INFOKBSEARCH;
              showMessage($scope, ngDialog, $rootScope.getglobalErrorMessage.DialogWarning, headerText, messageText, buttonText);
            } 
            else{
                $(".right_bg_cont").empty();  
              result = "<div class='data_cont'><div class='cont_title'>" + "Knowledge Base" + "</div></br><div class='container_mid'><div style='margin-left: 0.2vw;background-color: whitesmoke;'><p><h4>" + result.d.Title + "</h4></p></div><div class='redirectPage' style='overflow:scroll !important;height:27vw; margin-top:1vw;'><span style='transform: scale(0.83); width: 100vw;' >" + result.d.Excerpt + "</span></div></div></div>";                                       
               $(".right_bg_cont").html(result) ;

            }           
            // $('.redirectPage').slimScroll({
            //   wheelStep: 2,
            //   height   : "26vw",
            //   width    : "98%"
            // }); 
        }).error(function (serverResponse, status, headers, config) {
          $.loader('close');
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('knowledgeBaseRightController','popularkbContentview',e,$rootScope.getglobaldata.Client);
  } 
}

function modelSearch()
{
  window.external.modelSearchRedirection();
}


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
angular.module( 'activei.remotesupport', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
 
//
.config(function config( $stateProvider ) {
  $stateProvider.state( 'remotesupport', {
    url: '/remotesupport',
  views:{
        "RightView":{
        templateUrl:"support/remote/remotesupportRight.tpl.html",
        controller:"remotesupportRightController" 
    }
    },
    data:{ pageTitle: 'Remote Support' }
  });
})
 
// Controller Initialization 
.controller( 'remotesupportRightController', function remotesupportRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {
          $rootScope.isMiddleCont = true;
          $scope.isRemotesupportShow=false; 
          $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOREMOTESUPPORT;
          $scope.headerText=$rootScope.getglobalErrorMessage.HDRREMOTE;
          $scope.confirmOk=$rootScope.getglobalErrorMessage.BTNYES;
          $scope.confirmCancel=$rootScope.getglobalErrorMessage.BTNNO;

           ngDialog.openConfirm(
                          {
                          template: 'confirmdialog',
                          className: 'ngdialog-theme-default',                     
                          scope: $scope
                                              
                          }                
                      )
                      .then(function(value){
                        $scope.isRemotesupportShow=true;
                        loadPageContent($rootScope.getglobalmenudata[0].submenu,$state,$rootScope,$cookieStore,1,0,$state.current.name,13);
                        var url = 'http://remote.supportminds.com/';
                        $("#frame").attr("src", url); 
                                   
                    }, function(value){ 
                      if($rootScope.getglobaldata.Client === 'GearHead')
                      {
                        $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOGEARHEADREMOTESESSION;
                      }
                      else{
                        $scope.msgDescription=$rootScope.getglobalErrorMessage.INFOREMOTESESSION;
                      }
                          
                          $scope.headerText=$rootScope.getglobalErrorMessage.HDRREMOTE;
                         ngDialog.openConfirm(
                          {
                          template: 'remotesupportdialog',
                          className: 'ngdialog-theme-default',                     
                          scope: $scope
                                              
                          }                
                      )
                      .then(function(value){
                        if (($rootScope.homeClicked)) {
                          $rootScope.redirectmenu('contactsupport',1);
                        }
                        else
                        {
                          var clickedID=localStorage.getItem('clickedID');
                          var stateName=localStorage.getItem('stateName');
                          loadPageContent($rootScope.getglobalmenudata[0].submenu,$state,$rootScope,$cookieStore,1,0,stateName,parseInt(clickedID,10));
                        }
                    }, function(value){

                    }); //E

                    }); //End ngDialog.open

});
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
angular.module( 'activei.scheduleacall', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'scheduleacall', {
    url: '/scheduleacall',
  views:{      
      "RightView":{
        templateUrl:"support/scheduleacall/scheduleacallRight.tpl.html",
        controller:"scheduleacallRightController"
        }
    },
    data:{ pageTitle: 'Schedule a Call' }
  })
.state("newschedule", {
       url: "/newschedule",
       views: {             
         'RightView': { 
          templateUrl: 'support/scheduleacall/newschedule.tpl.html',
          controller: "newscheduleController" 
         }
       }
         });
})

//
//Schedule Right View Controller Initialization
.controller( 'scheduleacallRightController', function scheduleacallRightController( $scope,$http ,$rootScope,$cookieStore ,$state) {
$scope.isShowbutton=false;
$rootScope.isMiddleCont = true;
$scope.isCalanderLoaded=false;

  
//get created schedule and load
$scope.scheduledcase=function()
{ 
    try{
      getSchedule($scope,$http,$cookieStore,$rootScope); 
    }
    catch(e){
        stackTrace('scheduleacallRightController','scheduledcase',e,$rootScope.getglobaldata.Client);
    }
};
  $scope.redirectToNewSchedule=function()
  {
    $rootScope.isnewpage=true;
    $state.go('newschedule');
  };

   $scope.refreshScheduleacall=function()
  {
    // $state.reload();
    $scope.scheduledcase();
  };
  

})
//
//New Schedule Controller Initialization
.controller( 'newscheduleController', function newscheduleController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {

//Load Date and time on page load
$scope.dateTimeControls=function()
{
    try{
    var d = new Date();
    var currDate = d.getDate();
    var currMonth = d.getMonth() + 1;
    var currYear = d.getFullYear();
    currDate=(parseInt(currDate,10) < 10)?'0'+currDate:currDate;
    currMonth=(parseInt(currMonth,10) < 10) ?'0'+currMonth:currMonth;
    var dateStr = currMonth + "/" + currDate + "/" + currYear; 
    $('#txtDate').val(dateStr);
    $('#txtDate').datepicker({ format: "mm/dd/yyyy" });
    //To show the time 30 minutes ahead
    var thirtyMinutesLater = new Date(d.getTime() + (31 * 60 * 1000));
    
    $(".txttimepicker").timepicker({
        defaultTime: thirtyMinutesLater,
                minuteStep: 1,
                showInputs: false,
                disableFocus: false
    }); 
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','dateTimeControls',e,$rootScope.getglobaldata.Client);
    } 
};

 
//Load Product on Init
$scope.loadProduct=function()
{    
    try{
        getScheduelProduct($scope,$http,$rootScope,$cookieStore); 
    }
    catch(e)
    {
        stackTrace('newscheduleController','loadProduct',e,$rootScope.getglobaldata.Client);
    }
};

//functionality get all TimeZoneDetails
$scope.getallTimeZoneDetails=function(){
        
        showLoader();   
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetAllTimeZones";
        var param={};
        $http.post(servicePath,param).then(function(result,status,headers,config){             
            $.loader('close'); 
            $scope.TimeZoneDetails=result.data.d;
        }).error(function(result,status,headers,config){ 
            $.loader('close');
        });
};

//functionality used to save the new schedule
$scope.saveNewSchedule=function(isformvalid){
    try
    {  
    $scope.headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE; 
    $scope.msgDescription=$rootScope.getglobalErrorMessage.SUCCESSSCHEDULESAVE; 
    if (isformvalid) { //form validation if
    if ($scope.showControlValidation()) {
    if (validateDatetime($scope,$rootScope,ngDialog)) { //validate date and time if   
        
        // var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.selectedproduct.ProductName + "," + $scope.callBackNumber + "," + escape($scope.scheduleProblemTitle);
        var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.scheduleTimeZone.TimeZone + "," + $scope.callBackNumber + "," + encodeURIComponent($scope.scheduleProblemTitle);
        // var param = '{ "customerId":'+ parseInt(localStorage.getItem('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + $scope.scheduleProblemTitle + '", "caseCauses": "", "caseNotes": "' + $scope.scheduleProblemDescription + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
        $scope.serviceData=createScheduleCase($scope,$rootScope,scheduleCall);
        showLoader();   
        $http.post($scope.serviceData.servicePath,$scope.serviceData.param).then(function(result,status,headers,config){             
            $.loader('close'); 
            if ($rootScope.getglobaldata.Client === 'GearHead') {
                if (result.data.d) { 
                    ngDialog.openConfirm(
                    {
                        template: 'successdialog',
                        className: 'ngdialog-theme-default',                     
                        scope: $scope
                    }                
                    )
                    .then(function(value){
                         $state.go('scheduleacall');
                    }, function(value){
                    }); //End ngDialog.open 
                }
                else
                {
                  //  alert(result.data.d);
                }
            }
            else{
            if (result !== null) { 
                ngDialog.openConfirm(
                {
                    template: 'successdialog',
                    className: 'ngdialog-theme-default',                     
                    scope: $scope
                }                
                )
                .then(function(value){
                                                                       
                     $state.go('scheduleacall');
                             
                    }, function(value){
                        
                    }); //End ngDialog.open 
                }
                else
                {
                  //  alert(result.data.d);
                }
            }

        }).error(function(result,status,headers,config){ 
            $.loader('close');
        });


                //  ngDialog.openConfirm(
                //     {

                //     template: 'confirmdialog',
                //     className: 'ngdialog-theme-default',                     
                //     scope: $scope
                                        
                //     }                
                // )
                // .then(function(value){
                       
                    
                //     var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.selectedproduct.ProductName + "," + $scope.callBackNumber + "," + $scope.scheduleProblemTitle;
                //     var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "ScheduleaCall";
                                          
                //                         var param = '{ "customerId":'+ parseInt($cookieStore.get('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + $scope.scheduleProblemTitle + '", "caseCauses": "", "caseNotes": "' + $scope.scheduleProblemDescription + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
                //                         $http.post(servicePath,param).then(function(result,status,headers,config){
                //                             if (result.data.d) {
                //                                 $state.go('scheduleacall');
                //                             }
                //                             else
                //                             {

                //                             }

                //                         }).error(function(result,status,headers,config){

                //                         });
                    
                             
                //     }, function(value){
                        

                //     }); //End ngDialog.open

    }     //validate date and time if
  }     //form validation if end
}
    }
    catch(e)
    {
        stackTrace('newscheduleController','saveNewSchedule',e,$rootScope.getglobaldata.Client);
    }
};      //end saveNewSchedule function

$scope.showControlValidation=function(){
    var messageText="";
    var headerText="";
    var buttonText="";


     if($scope.callBackNumber.length < 10){
        
         messageText=$rootScope.getglobalErrorMessage.SCHEDULECALLBACK;
         headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE;
         buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        $("#ngDialogbtnWarningOkButton").focus();
        //Show the info message
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
        $("#txtPhoneNumber").focus();

        return false;
     }
     else if(parseInt($scope.callBackNumber,10) <= 0){
         messageText=$rootScope.getglobalErrorMessage.VALIDATECALLBACK;
         headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE;
         buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        $("#ngDialogbtnWarningOkButton").focus();
        //Show the info message
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
        $("#txtPhoneNumber").focus();
        return false;
     }
     else{
        return true;
     }
    
  };

});     //End Controller



////get the created schedule details
function getSchedule($scope,$http,$cookieStore,$rootScope)
{ 
    try{ 
        $('#calendar').fullCalendar('today');
        if (!$scope.isCalanderLoaded) {
            $scope.isCalanderLoaded=true;
             //Display the fullcalander
            $('#calendar').fullCalendar({
                editable: false,
                eventLimit: true, // allow "more" link when too many events      
                selectable: true,
                slotDuration: '03:00:00',
                allDay : true,
                // Options
                header: {
                            left: 'prev,next today',
                            center: 'title',
                            // right: 'month,basicWeek,basicDay'
                            right: 'month,basicWeek,basicDay'
                        },
                eventClick:  function(event) { 
                        // $('#modalBody').html(event.title);
                        $('#lblSchedule').text(event.title);
                        $('#modalTitle').html("Schedule a Call"); 
                        $('#fullCalModal').appendTo("body").modal('show');
                        // $('#fullCalModal').modal();
                        },
                disableDragging: true
                // ,eventClick: function(calEvent, jsEvent, view) {
                //     jsEvent.preventDefault();
                //     // Go to and show day view for start date of clicked event
                //     $('#calendar').fullCalendar('gotoDate', calEvent.start);
                //     $('#calendar').fullCalendar('changeView', "basicDay");
                //     $('#calendar').fullCalendar('option', 'contentHeight', 350);
                //     $('#calendar').fullCalendar('option', 'eventLimit', false);
                //     // .fc-basic-view tbody .fc-row
                //     // $(".fc-basic-view tbody .fc-row").attr('min-height','23vw');
                // },
                // dayClick: function(date, allDay, jsEvent, view) {
                // $('#calendar').fullCalendar( 'changeView', 'basicDay');
                // $('#calendar').fullCalendar( 'gotoDate', date);
                // $('#calendar').fullCalendar('option', 'contentHeight', 350);
                // $('#calendar').fullCalendar('option', 'eventLimit', false);
                // // $('#containerDayCal')
                // // $(".fc-basic-view tbody .fc-row").attr('min-height','23vw');
                // },
                
                // eventLimitClick : function(date, allDay, jsEvent, view){
                //    $('#calendar').fullCalendar( 'changeView', 'basicDay');
                //    alert(jsEvent.length);
                //    $('#calendar').fullCalendar( 'renderEvent', jsEvent , 'stick');
                // }

            });
        }
        $('#calendar').fullCalendar('removeEvents');
    // $rootScope.getglobaldata =offlineGlobalData;
     $scope.isShowbutton=true;   //show the button
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "MyScheduleCases";
         var customerId= localStorage.getItem('StoredCustomerID') ;
        // var customerId = 22933063 ;
        // var customerId= 2 ;
        var param = '{ "customerId":"' + customerId + '"}';
        showLoader(); 
       
     //Get created schedule and display the schedule event in calander   
    $http.post(servicePath, param).then(function (result, status, headers, config) {
        var schuduledEvent = result.data.d;
        // schuduledEvent = schuduledEvent.sort(function (a, b) {
        //        return a.ScheduleTimeStamp.localeCompare( b.ScheduleTimeStamp );
        // });
        for (var j = 0; j < schuduledEvent.length; j++) {
            var scheduledDate = new Date(schuduledEvent[j]["ScheduleDate"].toString());
            var scheduleTime = "";

            if (schuduledEvent[j]["ScheduleTime"] !== null && schuduledEvent[j]["ScheduleTime"] !== undefined)
            {
                scheduleTime = schuduledEvent[j]["ScheduleTime"].toString();
            }

           var scheduleTitle = "";
            if (schuduledEvent[j]["CaseSummary"].toString() !== "") {  
                scheduleTitle = unescape(schuduledEvent[j]["CaseSummary"].toString()) + "," + scheduleTime;                 
                var startDate=scheduledDate.getFullYear() +"-"+ (parseInt(scheduledDate.getMonth(),10)+1) +"-"+ scheduledDate.getDate() +" "+scheduleTime;
                var eventDetails = {

                    title: scheduleTitle,
                    // start: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate())
                    start: new Date(startDate),
                    allday : false
                };
                //render events to the calander  
                 $('#calendar').fullCalendar( 'renderEvent', eventDetails , 'stick');

            }


        } //for loop end
        $.loader('close');
    
    }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
            $.loader('close');
    });
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','getSchedule',e,$rootScope.getglobaldata.Client);
    }
   
}


//get the product based on the customer ID
function getScheduelProduct($scope,$http,$rootScope,$cookieStore) {
    try{
         var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetProductInfo";
        var customerId= localStorage.getItem('StoredCustomerID') ; 
        // var param = '{ "customerID":' + parseInt(customerId,10) + ',"email": "","address": ""}';
      var param = customerProductInfo($rootScope); 
    // //get the product based on the customer ID
    $http.post(servicePath, param).then(function (resp, status, headers, config) {
        
        if ($rootScope.getglobaldata.Client === 'GearHead') {
             $scope.productbuild=[];
            $.each(resp.data.d,function(key,values){
                $scope.procuctsinfo={};
                $scope.procuctsinfo.ProductName=values.Product;
                $scope.procuctsinfo.RegistrationId=values.Registration_ID;
                $scope.procuctsinfo.SerialNo=values.Serial_Number;
                $scope.procuctsinfo.PurchaseDate=values.Purchase_Date;
                $scope.procuctsinfo.CountryPurchase=values.Country_Purchased;
                $scope.procuctsinfo.ProductExpired=values.PsExpiry;
                $scope.procuctsinfo.SwExpired=values.SwExpiry;
                $scope.procuctsinfo.ProductWarranty=values.Warranty;
                $scope.productbuild.push($scope.procuctsinfo);
            });
            $scope.procuctdetails=$scope.productbuild;

        }
        else{
            $scope.procuctdetails=resp.data.d;  
        }
        
        
    }).error(function(serverResponse, status, headers, config){
      //alert("failure");
      $.loader('close');
    });
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','getScheduelProduct',e,$rootScope.getglobaldata.Client);
    }
   

}

//functionality to validate if the date is current date then check time is greater than 30 mins compare to current time
function validateDatetime($scope,$rootScope,ngDialog) {
    try{
        var isValid = true;
        //Split the selected date
        var date = $("#txtDate").val();
        var time = $("#txtTime").val();
        //var date = $scope.scheduleDate;
        var dateArray = date.split(' ');
        var selectdate = dateArray[0].split('/');

        //Split the Current date
        var todayDate = new Date();
        var dd = todayDate.getDate();
         dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
        mm = todayDate.getMonth() + 1; //January is 0!
        mm=(parseInt(mm,10) < 10) ?'0'+mm:mm;
        
        // dd=(dd.length=1)?'0'+dd:dd;
        // var mm = todayDate.getMonth() + 1; //January is 0!
        // mm=(mm.length=1)?'0'+mm:mm;

        var yyyy = todayDate.getFullYear();
        var hours = todayDate.getHours();
        var minutes = todayDate.getMinutes();
 
        //change the dateformat
        var t1 = yyyy +''+ mm +''+ dd ;
         var t2 = selectdate[2] + selectdate[0]  + selectdate[1];
        //Convert 24 hours format
        var twhours = formatConversion(time); 
        //Split the time
        var timeArray = twhours.split(' ');
        var times = timeArray[0].split(':');
        
        
        //Compare the current date and selected date
            if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULE,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60; 
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULE,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }  
            }
             return true;
    }
    catch(e)
    {
        // stackTrace(e);        
        stackTrace('newscheduleController','validateDatetime',e,$rootScope.getglobaldata.Client);
    }
}


//functionality to format the time
 function formatConversion() {
     try{ 
        //Convert time 24 hour format 
        //var time = $scope.scheduleTime;
        var hrs = Number(time.match(/^(\d+)/)[1]);
        var mnts = Number(time.match(/:(\d+)/)[1]);
        var format = time.match(/\s(.*)$/)[1];
        if (format === "PM" && hrs < 12)
        {hrs = hrs + 12;} 
        if (format === "AM" && hrs == 12)
        {hrs = hrs - 12;} 
        var hours = hrs.toString();
        var minutes = mnts.toString();
        if (hrs < 10) {
          hours = "0" + hours;
        }
        if (mnts < 10) {
          minute1 = "0" + minutes;
        }
        return hours + ":" + minutes; 
    }
    catch(e)
    {
        // stackTrace(e);
    }  
}

function checkCallbackNumber(ctrl,event)
{
    if (ctrl.value.length < 10) {
         angular.element(document.getElementById("rightCont")).scope().showControlValidation();
         event.preventDefault();
         return false;
    }
}
function onkeyup(e) {
    var code;
    if (!e) { e = window.event;} // some browsers don't pass e, so get it from the window
    if (e.keyCode) {code = e.keyCode;} // some browsers use e.keyCode
    else if (e.which) {code = e.which;}  // others use e.which

    if (code == 8 || code == 46){
        return false;
    }
}
function preventBackspace(e) {
        var evt = e || window.event;
        if (evt) {
            var keyCode = evt.charCode || evt.keyCode;
            if (keyCode === 8) {
                if (evt.preventDefault) {
                    evt.preventDefault();
                } else {
                    evt.returnValue = false;
                }
            }
        }
    }
/*
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
angular.module( 'activei.webticket', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'webticket', {
    url: '/webticket',
  views:{
      "RightView":{
        templateUrl:"support/webticket/webticketRight.tpl.html",
        controller:"webticketRightController"
    
    }
    },
    data:{ pageTitle: 'Web ticket' }
  })
.state("newticket", {
       url: "/newticket",
       views: { 
         'RightView': { 
          templateUrl: 'support/webticket/newticket.tpl.html',
          controller: "newticketRightController" 
         }
       }
         });
})

/**
 * Encoding and Decoding the HTML.
 */
 

// .filter('unsafe',function($sce){
//     return function(val){
//         return $sce.trustAsHtml(val);
//       };
//     }) 

/**
 * And of course we define a controller for our route.
 */

.controller( 'webticketRightController', function webticketRightController( $scope,$http ,$rootScope,$cookieStore ,$state,$sce) {   

$rootScope.isMiddleCont = true;
$scope.isNewText=false;
var result='';
var remword='';
$scope.wrapWord=function(text)
{
  if ($scope.isNewText) {
    $scope.isNewText=false;
    result='';
    remword='';
  }
    if (text.length > 40) {
          result+=text.substring(0,40);
          remword=text.substring(40,text.length);
          if (remword.length > 40) {
              result+="<br/>";
              $scope.wrapWord(remword);
          }
          else
          {
            result+=remword;
          }
      }
      else
      {
        result=text;
      }
      return result;
};

$scope.wrappedResult = function(text) {
    var s = text ? text.split(/\s+/) : 0; // it splits the text on space/tab/enter
    var wordCount=s ? s.length : '';
    var wrappedText='';
    if (wordCount === 1) {
      wrappedText= $scope.wrapWord(s[0]);
    }
    return wrappedText;
};


$scope.bindCaseDetails=function()
{ 
  bindCaseDetailsDataTable($scope,$http,$cookieStore,$rootScope);
};

$scope.encodeSummary = function(snippet) { 
     return unescape(snippet);
    //  var vText=snippet;
    //  var s = vText ? vText.split(/\s+/) : 0; // it splits the text on space/tab/enter
    //   var wordCount=s ? s.length : '';
    //   var wrappedText='';
    // if (wordCount === 1) {
    //   $scope.isNewText=true;
    //   wrappedText= $scope.wrapWord(s[0]);
    // }
    // else
    // {
    //   wrappedText=vText;
    // }
    //   return wrappedText;
};

$scope.redirectToNewTicket=function()
{
  $rootScope.isnewpage=true;
  $state.go('newticket');
};
 $scope.refreshwebticket=function()
   {
    $state.reload();
   }; 
})
//Controller for NewTicket
.controller( 'newticketRightController', function newticketRightController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog,$sce) {
    $scope.getProductDet=function()
    {
        getProducts($scope,$http,$rootScope,$cookieStore);
    };
  
    $scope.TrustDangerousSnippet = function(snippet) { 
      return $sce.trustAsHtml(snippet);
    };

$scope.createNewTicket=function(frmNewCaseValid){
   try {
   
    $scope.headerText=$rootScope.getglobalErrorMessage.HDRNEWTICKET; 
    $scope.msgDescription=$rootScope.getglobalErrorMessage.SUCCESSWTICKETSAVE;
    if(frmNewCaseValid){
      showLoader();
        var customerId= localStorage.getItem('StoredCustomerID') ;
        var serialNumber =$scope.selectedproductdet.RegistrationId;
        var registrationId = 0;

        var txtSummary = encodeURIComponent($('#txtSummary').val());  
        var txtProblem = encodeURIComponent($('#txtProblem').val()); 

        //  var txtSummary = $('#txtSummary').val();  
        // var txtProblem = $('#txtProblem').val(); 


        var params=createNewWebTicket($scope,$rootScope,txtSummary,txtProblem);
        // var params = '{ "customerId":"' + parseInt(customerId,10) + '", "registrationId": "' + registrationId + '", "serialNumber": "' + serialNumber +
        //                 '", "caseSummary": "' + txtSummary + '","caseProblem": "", "caseCauses": "", "caseNotes": "' + txtProblem +
        //                 '", "caseSource":"Online", "caseAssingTo":"css@cssconnect.com", "caseQueueId":63}';
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CreateCase";         
        $http.post(servicePath, params).then(function (resp, status, headers, config){
          $.loader('close');
          var isTicketCreated=false;
          if ($rootScope.getglobaldata.Client === 'GearHead') {
            if (resp.data.d !=='0') {
                isTicketCreated=true;
            }
          }
          else{
            isTicketCreated=resp.data.d;
          }

             if (isTicketCreated === true){
              
                ngDialog.openConfirm(
                              {

                              template: 'successdialog',
                              className: 'ngdialog-theme-default',                     
                              scope: $scope
                                                  
                              }                
                          )
                          .then(function(value){                                  
                               $state.go('webticket');
                              }, function(value){

                              }); //End ngDialog.open 

                   //showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRNEWTICKET,$rootScope.getglobalErrorMessage.SUCCESSWTICKETSAVE,$rootScope.getglobalErrorMessage.BTNOK);
                   //$state.go('webticket');
                }
                else{
                    //alert("error");
                }
        })
        .error(function (serverResponse, status, headers, config) {
           $.loader('close');
            //alert("failure");
        });
       }
       
    } catch (e) {
        // stackTrace(e);
        stackTrace('newticketRightController','createNewTicket',e,$rootScope.getglobaldata.Client);
    }
};
});

function bindCaseDetailsDataTable($scope,$http,$cookieStore,$rootScope)
{
  try{
        // $rootScope.getglobaldata =offlineGlobalData;
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetCases";
        var customerEmail = "";
        var customerPhoneNo = "";
        var customerIsoCountry = "";
        var customerExactPhone=0;
        var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10);
        // var customerId= 22933063 ;
        var param = '{ customerId:' + parseInt(customerId,10) + ', customerEmail:"' + customerEmail + '", customerPhoneNo:"' + customerPhoneNo + '", customerIsoCountry:"' + customerIsoCountry + '", customerExactPhone:' + parseInt(customerExactPhone,10) + '}';
       showLoader();
        $http.post(servicePath, param).success(function (resp) 
        {
          if(resp.d !== null)
          {
            $('.table-responsive').slimScroll({
                wheelStep: 5,
                width: "100%",
                 height: "27vw"
              }); 
            $scope.caseDetails=resp.d;
             
          }
          else
          {
            $(".table-responsive").append("<center><p>No records available</p></center>");
          }
         
        $.loader('close');
        }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
             $.loader('close');
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('newticketRightController','bindCaseDetailsDataTable',e,$rootScope.getglobaldata.Client);
  }
       
}

function getProducts($scope,$http,$rootScope,$cookieStore) {
  try{
     var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetProductInfo";
    var customerId= localStorage.getItem('StoredCustomerID') ;
    // var param = '{ "customerID":' + parseInt(customerId,10) + ',"email": "","address": ""}';
    var param=customerProductInfo($rootScope);
    $http.post(servicePath,param).success(function (resp)
    {
        // $scope.productdetail=resp.d;
        if ($rootScope.getglobaldata.Client === 'GearHead') {
             $scope.productbuild=[];
            $.each(resp.d,function(key,values){
                $scope.procuctsinfo={};
                $scope.procuctsinfo.ProductName=values.Product;
                $scope.procuctsinfo.RegistrationId=values.Registration_ID;
                $scope.procuctsinfo.SerialNo=values.Serial_Number;
                $scope.procuctsinfo.PurchaseDate=values.Purchase_Date;
                $scope.procuctsinfo.CountryPurchase=values.Country_Purchased;
                $scope.procuctsinfo.ProductExpired=values.PsExpiry;
                $scope.procuctsinfo.SwExpired=values.SwExpiry;
                $scope.procuctsinfo.ProductWarranty=values.Warranty;
                $scope.productbuild.push($scope.procuctsinfo);
            });
            $scope.productdetail=$scope.productbuild;

        }
        else{ 
            $scope.productdetail=resp.d;  
        }
    }).error(function (serverResponse, status, headers, config) {
           // alert("failure");
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('newticketRightController','getProducts',e,$rootScope.getglobaldata.Client);
  }
   
} 


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
angular.module('activei.networkmap', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('networkmap', {
        url: '/networkmap',
        views: {
            "RightView": {
                templateUrl: "systemtools/networktools/networkmap/networkmap.tpl.html",
                controller: "networkmapController"
            }
        },
        data: { pageTitle: 'Network Map' }
    });
})
/**
* And of course we define a controller for our route.
*/

.controller('networkmapController', function networkmapController($scope, $rootScope, $http, $state, $cookieStore, ngDialog) {
    $rootScope.isMiddleCont = true;
    $scope.serviceurl = $rootScope.getglobaldata.getServiceURL;
    $scope.myinfo = $rootScope.myinfo;

    var scanners, adapters, printers, usbs;
    $scope.loadDevices = function () {
        try {
            if ($rootScope.userDetails.IsNetwork === 'True') {
                showmap($scope, $rootScope);
            }
            else {
                offlineshowmap();
            }
        }
        catch (ex) {
            // stackTrace(ex);
            stackTrace('networkmapController','loadDevices',ex,$rootScope.getglobaldata.Client);
        }
    };

    $scope.adddevicesList = function () {
        adddevices($scope);
    };

    $scope.removedevicesList = function () {
        $scope.msgDescription = $rootScope.getglobalErrorMessage.INFOREMOVEDEVICE;
        $scope.headerText = $rootScope.getglobalErrorMessage.HDRNETWORKMAP;
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
                removedevices($scope);
            }, function (value) {

            });
    };

    $scope.updateDeviceDetails = function (lnk) {
        var deviceindex = $($(lnk).parent()).attr('deviceindex');
        var devlistindex = $($(lnk).parent()).attr('devlistindex');
        var specificdevindex = $($(lnk).parent()).attr('specificdevindex');
        var usbclassindex = $($(lnk).parent()).attr('usbclassindex');
        var alliasname;

        if ($(lnk).hasClass('lan')) {
            if ($(lnk).hasClass('save')) {
                alliasname = $(lnk).closest('table').find('.allias').find('input').val();
                $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].AlliasName = alliasname;
                if (alliasname === '') {
                    $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
                    return;
                }
            }
            else if ($(lnk).hasClass('add')) {
                $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].IsRemove = false;
                $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].Class = '';
            }
            else {
                //$scope.mydevicelist[deviceindex].devList[devlistindex].LANList.splice(specificdevindex, 1);
                $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].IsRemove = true;
                $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].Class = 'disable';
            }
        }
        else if ($(lnk).hasClass('uusb')) {
            if ($(lnk).hasClass('save')) {
                alliasname = $(lnk).closest('table').find('.allias').find('input').val();
                $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].AlliasName = alliasname;
                if (alliasname === '') {
                    $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
                    return;
                }
            }
            else if ($(lnk).hasClass('add')) {
                $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].IsRemove = false;
                $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].Class = '';
            }
            else {
                //$scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList.splice(usbclassindex, 1);
                //$scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].IsRemove = true;
                $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].IsRemove = true;
                $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].Class = 'disable';
            }
        }
        else if ($(lnk).hasClass('pprinter')) {
            if ($(lnk).hasClass('save')) {
                alliasname = $(lnk).closest('table').find('.allias').find('input').val();
                $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].AlliasName = alliasname;
                if (alliasname === '') {
                    $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
                    return;
                }
            }
            else if ($(lnk).hasClass('add')) {
                $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].IsRemove = false;
                $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].Class = '';
            }
            else {
                //$scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList.splice(specificdevindex, 1);
                $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].IsRemove = true;
                $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].Class = 'disable';
            }
        }
        else if ($(lnk).hasClass('pnetwork')) {
            if ($(lnk).hasClass('save')) {
                alliasname = $(lnk).closest('table').find('.allias').find('input').val();
                $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].AlliasName = alliasname;
                if (alliasname === '') {
                    $(lnk).closest('table').find('.allias').find('input').css({ "border": "1px solid Red" });
                    return;
                }
            }
            else if ($(lnk).hasClass('add')) {
                $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].IsRemove = false;
                $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].Class = '';
            }
            else {
                //$scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList.splice(specificdevindex, 1);
                $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].IsRemove = true;
                $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].Class = 'disable';
            }
        }

        adddevices($scope, deviceindex, devlistindex);
        bindnetworkmap($scope); tooltip.hide();
    };
});

function offlineshowmap() {
    showLoader();
    $('.btnrenewal_position .netgearbtncolor').remove();
    var connectedDev = window.external.loaddevices();
    var parsedDevices = JSON.parse(connectedDev);

    binddevice(parsedDevices.DeviceList, 0, 0, false);

    $.loader('close');
}

function showmap($scope, $rootScope) {
    try {
        var params = { username: localStorage.getItem("StoredCustomerID") };

       showLoader();
       $.ajax({
           type: "POST",
           url: $scope.serviceurl + "getDevice",
           data: params,
           success: function (d) {
             //alert(JSON.stringify(d));

               //prevoius data
               // $scope.mydevicelist = d.success.devices;
 //alert(JSON.stringify($scope.mydevicelist));
               //current data
               var connectedDev = window.external.loaddevices();
               var parsedDevices = JSON.parse(connectedDev);
               $scope.parsedDeviceList = parsedDevices;
               $scope.devList = parsedDevices.DeviceList;


               //New code

               if (d.success == null) {
                   $scope.mydevicelist = [];
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
               }
               else {
                   $scope.mydevicelist = d.success.devices;
               }

               $.each($scope.mydevicelist, function (idx, rec) {//devices
                   var devlsit = [];
                   if (rec.macAdd == $scope.myinfo.MACAddress) {
                       devlsit = rec.devList;
                   }

                   $.each(devlsit, function (i, lan) {//devlist
                       $.each($scope.devList.LANList, function (ctidx, ctrec) {
                           var status = false;
                           $.each(lan.LANList, function (ii, l) {
                               if (ctrec.MACAddress == l.MACAddress) {
                                   status = true;
                                   if (l.IsRemove === true) {
                                       ctrec.IsRemove = true;
                                       ctrec.Class = 'disable';
                                   }
                               }
                           });
                           if (status === false) {
                               ctrec.Class = 'new';
                           }
                       });

                       $.each(lan.LANList, function (ii, l) {//lanlist
                           var status = false;
                           $.each($scope.devList.LANList, function (ctidx, ctrec) {
                               if (l.MACAddress == ctrec.MACAddress) {
                                   status = true;
                                   if (l.AlliasName !== undefined) {
                                       ctrec.AlliasName = l.AlliasName;
                                   }
                               }
                           });
                           if (status === false) {
                               l.Status = 'Inactive';
                               l.Class = 'not';
                               $scope.devList.LANList.push(l);
                           }
                       });

                       $.each($scope.devList.USBList, function (ctidx, ctrec) {
                           var status = false;
                           $.each(lan.USBList, function (si, l) {
                               if (ctrec.VendorId == l.VendorId && ctrec.ProductID == l.ProductID) {
                                   status = true;
                                   if (l.IsRemove === true) {
                                       ctrec.IsRemove = true;
                                       ctrec.Class = 'disable';
                                   }
                                   ctrec.DeviceList = l.DeviceList;
                               }
                           });
                           if (status === false) {
                               ctrec.Class = 'new';
                           }
                       });

                       $.each(lan.USBList, function (si, l) {
                           var status = false;
                           $.each($scope.devList.USBList, function (ctidx, ctrec) {
                               if (l.VendorId == ctrec.VendorId && l.ProductID == ctrec.ProductID) {
                                   status = true;
                                   ctrec.DeviceList = l.DeviceList;
                               }
                           });
                           if (status === false) {
                               l.Status = 'Inactive';
                               l.Class = 'not';
                               $scope.devList.USBList.push(l);
                           }
                       });

                       $.each($scope.devList.PrinterList, function (ctidx, ctrec) {
                           var status = false;
                           $.each(lan.PrinterList === undefined ? [] : lan.PrinterList, function (pidx, prec) {
                               if (ctrec.DeviceID == prec.DeviceID) {
                                   status = true;
                                   if (prec.IsRemove === true) {
                                       ctrec.IsRemove = true;
                                       ctrec.Class = 'disable';
                                   }
                                   if (prec.AlliasName !== undefined) {
                                       ctrec.AlliasName = prec.AlliasName;
                                   }
                               }
                           });
                           if (status === false) {
                               ctrec.Class = 'new';
                           }
                       });

                       $.each(lan.PrinterList === undefined ? [] : lan.PrinterList, function (pidx, prec) {//lanlist
                           var status = false;
                           $.each($scope.devList.PrinterList, function (ctidx, ctrec) {
                               if (prec.DeviceID == ctrec.DeviceID) {
                                   status = true;
                                   if (prec.AlliasName !== undefined) {
                                       ctrec.AlliasName = prec.AlliasName;
                                   }
                               }
                           });
                           if (status === false) {
                               prec.Status = 'Inactive';
                               prec.Class = 'not';
                               $scope.devList.PrinterList.push(prec);
                           }
                       });

                       $.each($scope.devList.NetworkAdapterList, function (ctidx, ctrec) {
                           var status = false;
                           $.each(lan.NetworkAdapterList === undefined ? [] : lan.NetworkAdapterList, function (pidx, prec) {
                               if (prec.Id == ctrec.Id) {
                                   status = true;
                                   if (prec.IsRemove === true) {
                                       ctrec.IsRemove = true;
                                       ctrec.Class = 'disable';
                                   }
                                   if (prec.AlliasName !== undefined) {
                                       ctrec.AlliasName = prec.AlliasName;
                                   }
                               }
                           });
                           if (status === false) {
                               ctrec.Class = 'new';
                           }
                       });

                       $.each(lan.NetworkAdapterList === undefined ? [] : lan.NetworkAdapterList, function (pidx, prec) {//lanlist
                           var status = false;
                           $.each($scope.devList.NetworkAdapterList, function (ctidx, ctrec) {
                               if (prec.Id == ctrec.Id) {
                                   status = true;
                                   if (prec.AlliasName !== undefined) {
                                       ctrec.AlliasName = prec.AlliasName;
                                   }
                               }
                           });
                           if (status === false) {
                               prec.Status = 'Inactive';
                               prec.Class = 'not';
                               $scope.devList.NetworkAdapterList.push(prec);
                           }
                       });

                   });
               });

               var devicelist = JSON.stringify($scope.devList);

               var params = { username: localStorage.getItem("StoredCustomerID"), devType: "desktop", name: $scope.myinfo.MachineName, ipaddress: $scope.myinfo.IPAddress, macAdd: $scope.myinfo.MACAddress, devList: devicelist };
               // alert(JSON.stringify(params));
               $.ajax({
                   type: "POST",
                   url: $rootScope.getglobaldata.getServiceURL + "addDevice",
                   data: params,
                   success: function (d) {
                       $.loader('close');
                       getdevices($scope);
                   },
                   error: function (e) {
                       $.loader('close');
                   }
               });

           },
           error: function (e) {
               $.loader('close');
               //alert("failed");
           }
       });
    }
    catch (ex) {
        // stackTrace(ex);
        stackTrace('networkmapController','showmap',ex,$rootScope.getglobaldata.Client);
    }
}

function tooltipbtnclk(lnk) {
    angular.element(document.getElementById('rightCont')).scope().updateDeviceDetails(lnk);
}

function getdevices($scope) {
    try {
        var params = { username: localStorage.getItem("StoredCustomerID") };
        $.ajax({
            type: "POST",
            url: $scope.serviceurl + "getDevice",
            data: params,
            success: function (d) {
                $scope.mydevicelist = d.success.devices;
                bindnetworkmap($scope);
            },
            error: function (e) {
                //alert("failed");
            }
        });
    }
    catch (ex) {
        // stackTrace(ex);
    }
}

function adddevices($scope, deviceindex, devlistindex) {
    try {
        var devicelist = JSON.stringify($scope.mydevicelist[deviceindex].devList[devlistindex]);
        //alert(devicelist);
        var params = { username: localStorage.getItem("StoredCustomerID"), devType: "desktop",name: $scope.myinfo.MachineName,ipaddress: $scope.myinfo.IPAddress, macAdd: $scope.myinfo.MACAddress, devList: devicelist };
        //alert(JSON.stringify(params));
        $.ajax({
            type: "POST",
            url: $scope.serviceurl + "addDevice",
            data: params,
            success: function (d) {
                //alert("success");
            },
            error: function (e) {
              //  alert(JSON.stringify(e));
            }
        });
    }
    catch (ex) {
        // stackTrace(ex);
    }
}

function removedevices($scope) {
    try {
        var params = { username: localStorage.getItem("StoredCustomerID"), macAdd: $scope.myinfo.MACAddress };
        //alert(JSON.stringify(params));
        $.ajax({
            type: "POST",
            url: $scope.serviceurl + "removeDevice",
            data: params,
            success: function (d) {
                bindnetworkmap($scope);
            },
            error: function (e) {
               // alert("failed");
            }
        });
    }
    catch (ex) {
        // stackTrace(ex);
    }
}

function binddevice(lan, idx, i,isonline) {
    $('.networkmap .lanlist').html('');
    $.each(lan.LANList, function (ii, l) {//lanlist
        if (l.IsRemove === true && l.Class == 'not') {
        }
        else{
            var tooltip = '<table>';
            if (isonline) {
                if (l.Class == 'not') {
                    tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
                }
                else {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
                    }
                    else {
                        tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.MachineName + "'/></td></tr>";
                    }
                }
            }
            else {
                tooltip += "<tr><td>Machine Name</td><td class='allias'>&nbsp;:&nbsp;" + l.MachineName + "</td></tr>";
            }
            tooltip += "<tr><td>IP Address</td><td>&nbsp;:&nbsp;" + l.IPAddress + "</td></tr>";
            tooltip += "<tr><td>MAC Address</td><td>&nbsp;:&nbsp;" + l.MACAddress + "</td></tr>";
            tooltip += "<tr><td>Host Name</td><td>&nbsp;:&nbsp;" + l.HostName + "</td></tr>";
            tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
            if (isonline) {
                tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";

                if (l.Class != 'not') {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td class='tooltip-lanlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn lan add' type='button'>Add Device</button></td></tr>";
                    }
                    else {
                        tooltip += "<tr><td class='tooltip-lanlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn lan save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn lan remove' type='button'>Remove Device</button></td></tr>";
                    }
                }
            }
            tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
            $('.networkmap .lanlist').append('<div class="lanlst"><div class="machine ' + l.Class + '"></div><li deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.MachineName : l.AlliasName) + '</li></div>');
        }
    });

    if ($('.networkmap .lanlist').html() === '') {
        $('.networkmap .lanlist').html('No LAN Machine Available');
    }

    $('.networkmap .usblist').html('');
    $.each(lan.USBList, function (si, l) {
        if (l.IsRemove === true && l.Class == 'not') {}
        else
        {
            $.each(l.DeviceList, function (iii, recc) {
                var tooltip = '<table>';
                if (isonline) {
                    if (l.Class == 'not') {
                        tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
                    }
                    else {
                        if (l.IsRemove === true) {
                            tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
                        }
                        else {
                            tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "'/></td></tr>";
                        }
                    }
                }
                else {
                    tooltip += "<tr><td>Friendly Name</td><td class='allias'>&nbsp;:&nbsp;" + (recc.FriendlyName === '' ? (recc.AlliasName === undefined ? recc.FriendlyName : recc.AlliasName) : recc.FriendlyName) + "</td></tr>";
                }
                tooltip += "<tr><td>VendorID</td><td>&nbsp;:&nbsp;" + l.VendorId + "</td></tr>";
                tooltip += "<tr><td>ProductID</td><td>&nbsp;:&nbsp;" + l.ProductID + "</td></tr>";
                tooltip += "<tr><td>DeviceID</td><td>&nbsp;:&nbsp;" + l.DeviceId + "</td></tr>";
                tooltip += "<tr><td>Device Class</td><td>&nbsp;:&nbsp;" + recc.DeviceClass + "</td></tr>";
                tooltip += "<tr><td>Device Manufacturer</td><td>&nbsp;:&nbsp;" + recc.DeviceManufacturer + "</td></tr>";
                tooltip += "<tr><td>Device Description</td><td>&nbsp;:&nbsp;" + recc.DeviceDescription + "</td></tr>";
                tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
                if (isonline) {
                    tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
                    if (l.Class != 'not') {
                        if (l.IsRemove === true) {
                            tooltip += "<tr><td class='tooltip-usblist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + si + "' usbclassindex='" + iii + "'><button onclick='tooltipbtnclk(this);' class='map-btn uusb add' type='button'>Add Device</button></td></tr>";
                        }
                        else {
                            tooltip += "<tr><td class='tooltip-usblist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + si + "' usbclassindex='" + iii + "'><button class='map-btn uusb save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn uusb remove' type='button'>Remove Device</button></td></tr>";
                        }
                    }
                }
                tooltip += "</table>";                                                              //ondblclick = "return changeAlliasName(this);"
                $('.networkmap .usblist').append('<div class="usblst"><div class="usb ' + l.Class + '"></div><li deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + si + '" usbclassindex="' + iii + '" title="' + tooltip + '">' + (recc.AlliasName === undefined ? (recc.FriendlyName === "" ? recc.DeviceClass : recc.FriendlyName) : recc.AlliasName) + '</li></div>');
            });
        }
    });

    if ($('.networkmap .usblist').html() === '') {
        $('.networkmap .usblist').html('No USB Device Available');
    }

    $('.networkmap .printerlist').html('');
    $.each(lan.PrinterList, function (ii, l) {//lanlist
        if (l.IsRemove === true && l.Class == 'not') {}
        else
        {
            var tooltip = '<table>';
            if (isonline) {
                if (l.Class == 'not') {
                    tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
                }
                else {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
                    }
                    else {
                        tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.Name + "'/></td></tr>";
                    }
                }
            }
            else {
                tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
            }
            tooltip += "<tr><td>Is Default</td><td>&nbsp;:&nbsp;" + l.IsDefault + "</td></tr>";
            tooltip += "<tr><td>IsNetwork Printer</td><td>&nbsp;:&nbsp;" + l.isNetworkPrinter + "</td></tr>";
            tooltip += "<tr><td>Device ID</td><td>&nbsp;:&nbsp;" + l.DeviceID + "</td></tr>";
            tooltip += "<tr><td>IP Address</td><td>&nbsp;:&nbsp;" + l.IPAddress + "</td></tr>";
            tooltip += "<tr><td>Status</td><td>&nbsp;:&nbsp;" + l.Status + "</td></tr>";
            if (isonline) {
                tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
                if (l.Class != 'not') {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td class='tooltip-printerlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn pprinter add' type='button'>Add Device</button></td></tr>";
                    }
                    else {
                        tooltip += "<tr><td class='tooltip-printerlist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn pprinter save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn pprinter remove' type='button'>Remove Device</button></td></tr>";
                    }
                }
            }
            tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
            $('.networkmap .printerlist').append('<div class="printerlst"><div class="printer ' + l.Class + '"></div><li style="max-width:150px;" deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.Name : l.AlliasName) + '</li></div>');
        }
    });

    if ($('.networkmap .printerlist').html() === '') {
        $('.networkmap .printerlist').html('No Printer Available');
    }

    $('.networkmap .networklist').html('');
    $.each(lan.NetworkAdapterList, function (ii, l) {//lanlist
        if (l.IsRemove === true && l.Class == 'not') { }
        else {
            var tooltip = '<table>';
            if (isonline) {
                if (l.Class == 'not') {
                    tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
                }
                else {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
                    }
                    else {
                        tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;<input type='text' value='" + l.Name + "'/></td></tr>";
                    }
                }
            }
            else {
                tooltip += "<tr><td>Name</td><td class='allias'>&nbsp;:&nbsp;" + l.Name + "</td></tr>";
            }
            tooltip += "<tr><td>NetworkInterface Type</td><td>&nbsp;:&nbsp;" + l.NetworkInterfaceType + "</td></tr>";
            tooltip += "<tr><td>Description</td><td>&nbsp;:&nbsp;" + l.Description + "</td></tr>";
            tooltip += "<tr><td>Operational Status</td><td>&nbsp;:&nbsp;" + l.OperationalStatus + "</td></tr>";
            tooltip += "<tr><td>Speed</td><td>&nbsp;:&nbsp;" + l.Speed + "</td></tr>";
            tooltip += "<tr><td>Support MultiCast</td><td>&nbsp;:&nbsp;" + l.SupportsMultiCast + "</td></tr>";
            if (isonline) {
                tooltip += "<tr><td colspan='2' align='right'><br/></td></tr>";
                if (l.Class != 'not') {
                    if (l.IsRemove === true) {
                        tooltip += "<tr><td class='tooltip-networklist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button onclick='tooltipbtnclk(this);' class='map-btn pnetwork add' type='button'>Add Device</button></td></tr>";
                    }
                    else {
                        tooltip += "<tr><td class='tooltip-networklist' colspan='2' align='center' deviceindex='" + idx + "' devlistindex='" + i + "' specificdevindex='" + ii + "'><button class='map-btn pnetwork save' onclick='tooltipbtnclk(this);' type='button'>Save Changes</button><button onclick='tooltipbtnclk(this);' class='map-btn pnetwork remove' type='button'>Remove Device</button></td></tr>";
                    }
                }
            }
            tooltip += "</table>";                                                   //deviceindex,devlistindex,specificdevindex   //ondblclick="return changeAlliasName(this);"
            $('.networkmap .networklist').append('<div class="networklst"><div class="network ' + l.Class + '"></div><li style="max-width:150px;" deviceindex="' + idx + '" devlistindex="' + i + '" specificdevindex="' + ii + '"  title="' + tooltip + '">' + (l.AlliasName === undefined ? l.Name : l.AlliasName) + '</li></div>');
        }
    });

    if ($('.networkmap .networklist').html() === '') {
        $('.networkmap .networklist').html('<li>No Network Adapter Available</li>');
    }

    $('.networkmap').slimScroll({
        wheelStep: 5,
        height: "30vw",
        width: "100%"
    });

    $('.networkmap .lanlist .lanlst').mouseover(function (d) {
        tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
        return;
    });

    $('.networkmap .usblist .usblst').mouseover(function (d) {
        tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
        return;
    });

    $('.networkmap .printerlist .printerlst').mouseover(function (d) {
        tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
        return;
    });

    $('.networkmap .networklist .networklst').mouseover(function (d) {
        tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
        return;
    });
}

function bindnetworkmap($scope) {
    //alert(JSON.stringify($scope.mydevicelist));
    $.each($scope.mydevicelist, function (idx, rec) {//devices
        //var devlsit = rec.devList;
        var devlsit = [];
        if (rec.macAdd == $scope.myinfo.MACAddress) {
            devlsit = rec.devList;
        }

        $.each(devlsit, function (i, lan) {//devlist
            binddevice(lan, idx, i,true);
        });
    });
   
    $('.networkmap .lanlist .lanlst li').dblclick(function () {
        var deviceindex = $(this).attr('deviceindex');
        var devlistindex = $(this).attr('devlistindex');
        var specificdevindex = $(this).attr('specificdevindex');

        $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
        $(this).find('input').focusout(function () {
            var alliasname = $(this).val();
            var li = $(this).parent();
            li.text(alliasname);

            $scope.mydevicelist[deviceindex].devList[devlistindex].LANList[specificdevindex].AlliasName = alliasname;

            $($(li).parent()).mouseover(function (d) {
                tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
                return;
            });
            adddevices($scope, deviceindex, devlistindex);
        });
        $(this).find('input').focus();

        $($(this).parent()).off();
        tooltip.hide();
    });

    $('.networkmap .usblist .usblst li').dblclick(function () {
        var deviceindex = $(this).attr('deviceindex');
        var devlistindex = $(this).attr('devlistindex');
        var specificdevindex = $(this).attr('specificdevindex');
        var usbclassindex = $(this).attr('usbclassindex');

        $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
        $(this).find('input').focusout(function () {
            var alliasname = $(this).val();
            var li = $(this).parent();
            li.text(alliasname);

            $scope.mydevicelist[deviceindex].devList[devlistindex].USBList[specificdevindex].DeviceList[usbclassindex].AlliasName = alliasname;

            $($(li).parent()).mouseover(function (d) {
                tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
                return;
            });
            adddevices($scope, deviceindex, devlistindex);
        });
        $(this).find('input').focus();

        $($(this).parent()).off();
        tooltip.hide();
    });

    $('.networkmap .printerlist .printerlst li').dblclick(function () {
        var deviceindex = $(this).attr('deviceindex');
        var devlistindex = $(this).attr('devlistindex');
        var specificdevindex = $(this).attr('specificdevindex');

        $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
        $(this).find('input').focusout(function () {
            var alliasname = $(this).val();
            var li = $(this).parent();
            li.text(alliasname);

            $scope.mydevicelist[deviceindex].devList[devlistindex].PrinterList[specificdevindex].AlliasName = alliasname;

            $($(li).parent()).mouseover(function (d) {
                tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
                return;
            });
            adddevices($scope, deviceindex, devlistindex);
        });
        $(this).find('input').focus();

        $($(this).parent()).off();
        tooltip.hide();
    });

    $('.networkmap .networklist .networklst li').dblclick(function () {
        var deviceindex = $(this).attr('deviceindex');
        var devlistindex = $(this).attr('devlistindex');
        var specificdevindex = $(this).attr('specificdevindex');

        $(this).html('<input style="width:90px; height:20px;" value="' + $(this).text() + '"/>'); //onblur="saveAlliasName(this);"
        $(this).find('input').focusout(function () {
            var alliasname = $(this).val();
            var li = $(this).parent();
            li.text(alliasname);

            $scope.mydevicelist[deviceindex].devList[devlistindex].NetworkAdapterList[specificdevindex].AlliasName = alliasname;

            $($(li).parent()).mouseover(function (d) {
                tooltip.pop(this, $(this).find('li').attr('title'), { position: 3, cssClass: "auto" });
                return;
            });
            adddevices($scope, deviceindex, devlistindex);
        });
        $(this).find('input').focus();

        $($(this).parent()).off();
        tooltip.hide();
    });
}
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
angular.module( 'activei.networkspeed', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'networkspeed', {
    url: '/networkspeed',
    views:{
       "RightView":{
        templateUrl:"systemtools/networktools/networkspeed/networkspeed.tpl.html",
        controller:"networkspeedController" 
    }
    },
    data:{ pageTitle: 'Network Speed' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'networkspeedController', function networkspeedController( $scope ,$rootScope,$http,$state,$interval) {
  $rootScope.isMiddleCont = true;  
 var imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; 
 
var downloadSize = 4995374; //bytes
$scope.uploadspeed=0;
$scope.downloadspeed=0;
$scope.initNetworkSpeed =function()
{
    
   /* var oProgress = document.getElementById("progress");
    oProgress.innerHTML = "Loading the image, please wait...";*/
    //var oProgress = document.getElementById("progress");
    //oProgress.innerHTML = "Loading the image, please wait...";
     showLoader();
     $rootScope.isNetworkSpeed=true;

     $interval(function() {
     // var downloadspeedMbps= measureDownloadSpeed();
     // var uploadspeedMbps= measureuploadSpeed(30);
      //debugger;
      // tick(downloadspeedMbps,uploadspeedMbps);
      
      $.loader('close');
      if ($rootScope.isNetworkSpeed) {
        window.external.getUploadTransferRate();  
        measureConnectionSpeed();
      }
       // window.external.getUploadTransferRate();  
       //  measureConnectionSpeed();
     }, 5000);
//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!




function measureConnectionSpeed() {
    $scope.uploadspeed=window.external.getUploadingrate();
    $scope.downloadspeed=window.external.getDownloadingrate();
    tick($scope.downloadspeed,$scope.uploadspeed);
    //var oProgress = document.getElementById("progress");
    /*var startTime, endTime;
     startTime = (new Date()).getTime();
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };
    
    download.onerror = function (err, msg) {
        //oProgress.innerHTML = "Invalid image, or error downloading";
    };
    
   
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        $scope.downloadspeed=speedMbps;
        $scope.uploadspeed=window.external.getUploadingrate();
        tick(speedMbps,$scope.uploadspeed);
       /* oProgress.innerHTML = "Your connection speed is: <br />" + 
           speedBps + " bps<br />"   + 
           speedKbps + " kbps<br />" + 
           speedMbps + " Mbps<br />";
    }*/
}

/*function checkUploadSpeed( iterations, update ) {
    var average = 0,
        index = 0,
        timer = window.setInterval( check, 5000 ); //check every 5 seconds
    check();
    
    function check() {
        var xhr = new XMLHttpRequest(),
            url = '?cache=' + Math.floor( Math.random() * 10000 ), //prevent url cache
            data = getRandomString( 1 ), //1 meg POST size handled by all servers
            uploadstartTime,
            speed = 0;
        xhr.onreadystatechange = function ( event ) {
            if( xhr.readyState === 4 ) {
                speed = Math.round( 1024 / ( ( new Date() - uploadstartTime ) / 1000 ) );
                if(average === 0 )
                {
                 average = speed ;
                }
                else
                {
                 average = Math.round( ( average + speed ) / 2 );
                }
                update( speed, average );
                index++;
                if( index === iterations ) {
                    window.clearInterval( timer );
                }
            }
        };
        xhr.open( 'POST', url, true );
        uploadstartTime = new Date();
        xhr.send( data );
    }
    
    function getRandomString( sizeInMb ) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?", //random data prevents gzip effect
            iterations = sizeInMb * 1024 * 1024, //get byte count
            result = '';
        for( var index = 0; index < iterations; index++ ) {
            result += chars.charAt( Math.floor( Math.random() * chars.length ) );
        }    
        return result;
    }
}

checkUploadSpeed( 30, function ( speed, average ) {
    document.getElementById( 'speed' ).textContent = 'speed: ' + speed + 'kbs';
    document.getElementById( 'average' ).textContent = 'average: ' + average + 'kbs';
} );
*/
/*
checkUploadSpeed( 30, function ( speed, average ) {
    document.getElementById( 'speed' ).textContent = 'speed: ' + speed + 'kbs';
    document.getElementById( 'average' ).textContent = 'average: ' + average + 'kbs';
} );*/



    var t = -1;
    var n = 10;
    var duration = 750;

    var data1 = initialise(); 
    var data2 = initialise();
    function initialise()
    {
        var time = -1;
        var arr = [];
        for (var i = 0; i < n; i++)
        {
            var obj = {
                time: time++,
                value:  0
            };
            arr.push(obj);
        }   
        t = time;
        return arr;
    }
    
    // push a new element on to the given array
    function updateData(a,speedVal)
    {
        var obj = {
            time:  t,  
            value: speedVal  //value: Math.floor(Math.random()*100)
        };
        a.push(obj);
    }
    
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 580 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;
     
    var x = d3.scale.linear()
        .domain([t-n+1, t])
        .range([0, width]);
     
    var y = d3.scale.linear()
        .domain([0, 10])
        .range([height, 0]);
     
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d, i) { return x(d.time); })
        .y(function(d, i) { return y(d.value); });
        
    var svg = d3.select(".networkSpeed").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    // extra svg to clip the graph and x axis as they transition in and out
    var graph = g.append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);   
    
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var axis = graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x.axis=xAxis);
     
    g.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
     
    var path1 = graph.append("g")
        .append("path")
        .data([data1])
        .attr("class", "line1");
        
    var path2 = graph.append("g")
        .append("path")
        .data([data2])
        .attr("class", "line2");
    

    //tick();
        
    function tick(downloadSpeed,uploadSpeed) {
        t++;
        
        // push
        updateData(data1,downloadSpeed);
        updateData(data2,uploadSpeed);

        // update the domains
        x.domain([t - n + 2 , t]);
        
        // redraw the lines
        graph.select(".line1").attr("d", line).attr("transform", null);
        graph.select(".line2").attr("d", line).attr("transform", null);
        
        // slide the line left
        path1.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
        path2.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
       
            
         // slide the x-axis left
        axis.transition()
            .duration(duration)
            .ease("linear")
            .call(xAxis);
           // .each("end", tick);


       // data1.shift();
       //data2.shift();
       
        
    }
   /* function tick1(uploadSpeed) {
debugger;
        t++;
        
        // push
        //updateData(data1,downloadSpeed);
        updateData(data2,uploadSpeed);

        // update the domains
        x.domain([t - n + 2 , t]);
        
        // redraw the lines
       // graph.select(".line1").attr("d", line).attr("transform", null);
        graph.select(".line2").attr("d", line).attr("transform", null);
        
        // slide the line left
        path1.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
        path2.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
       
            
         // slide the x-axis left
        axis.transition()
            .duration(duration)
            .ease("linear")
            .call(xAxis);
           // .each("end", tick);


       // data1.shift();
       //data2.shift();
       
        
    }*/
};

/*function measureConnectionSpeed() {
    var oProgress = document.getElementById("progress");
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };
    
    download.onerror = function (err, msg) {
        oProgress.innerHTML = "Invalid image, or error downloading";
    };
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        oProgress.innerHTML = "Your connection speed is: <br />" + 
           speedBps + " bps<br />"   + 
           speedKbps + " kbps<br />" + 
           speedMbps + " Mbps<br />";
    }
}*/

    
});



    



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
angular.module( 'activei.networktools', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'networktools', {
    url: '/networktools',
	views:{
           "RightView":{
        template:"",
        controller:"networktoolsRightController"
		
		}
    },
    data:{ pageTitle: 'Network Tools' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'networktoolsRightController', function networktoolsRightController( $scope ,$rootScope,$http,$state) {
  $rootScope.isMiddleCont = true;
   // $rootScope.polyInit();
  });
    



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
angular.module( 'activei.networkusage', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'networkusage', {
    url: '/networkusage',
  views:{
       "RightView":{
        templateUrl:"systemtools/networktools/networkusage/networkusage.tpl.html",
        controller:"networkusageController" 
    }
    },
    data:{ pageTitle: 'Network Usage' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'networkusageController', function networkusageController( $scope ,$rootScope,$http,$state) {
  $rootScope.isMiddleCont = true;  
  var results = "false";
  $scope.initBWLoaoded = function()
  {
    try{
      showLoader();
      window.external.loadBandwidthUsages();
    }
    catch(e)
    {
      stackTrace('networkusageController','initBWLoaoded',e,$rootScope.getglobaldata.Client);
    }
  };
  
  /* $scope.$on('$viewContentLoaded', function(event) {
       $scope.loadBandwidthUsage();  
    });*/
  
/*   $scope.$on('$viewContentLoaded', function(){

  });*/

    
});
 function loadBandwidthUsageDetails()
  {
    try{
    results=window.external.loadBandwidthDetails();
      if (results === "false") {
          $(".networkUsage").empty();
           var noRecords="<div class='diskAnalHeader' style='margin-top:2vw;'><span><b>No Records found</b></span></div>";
          $(".networkUsage").append(noRecords);
          
      }
      else{
        $(".networkUsage").empty();
          $(".networkUsage").append(results);
           $('.networkUsage').slimScroll({
            wheelStep: 5,
            height   : "30vw",
            width    : "100%"
          });
         
    }
    } catch (e) {
        stackTrace('networkusageController','loadBandwidthUsageDetails',e,offlineGlobalData.Client);
    }
    
  }
  function contentloaded()
  {
    $.loader('close');
  }
    



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
angular.module( 'activei.antivirus', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'antivirus', {
    url: '/antivirus',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/antivirus/antivirus.tpl.html",
        controller:"antivirusController" 
    }
    },
    data:{ pageTitle: 'AntiVirus' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'antivirusController', function antivirusController( $scope ,$rootScope,$http,$state,ngDialog) { 
  $rootScope.isMiddleCont = true; 
          //$("#btnfix").attr("disabled",true); 
          //$("#btnshowdetails").attr("disabled",true);
  $("#btnshowdetails").hide();
  $("#btnfix").hide();
  $("#dvantivirus").show();
  $("#dvfooter").show(); 

  var checkedDrives="";
  $scope.loadDriver=function(){  
    try{     
        driversList=window.external.defragmentationInit(true,false,false); //hardcode 
        $scope.driversListDetails=JSON.parse(driversList);
        } catch (e) {
        // stackTrace(e);
        stackTrace('antivirusController','loadDriver',e,$rootScope.getglobaldata.Client);
    }
  };

$scope.openBrowse = function()
  {
    try
    {
      $scope.filepath=window.external.openFolderBrowseDialog(); 
    } 
    catch(e)
    {
      // stackTrace(e);
      stackTrace('antivirusController','openBrowse',e,$rootScope.getglobaldata.Client);
    } 
  };
      
  $scope.redirecttoantiviruspath = function () {   
    try{  
      $rootScope.isAntivirusScanned=true;
      var antiscan="";
      antiscan = $("input[name=chkJunkFile]:checked").val();  
      if(antiscan === '1'){  
        //$("#btnfix").attr("disabled",true); 
        //$("#btnshowdetails").attr("disabled",true); 
        $("#btnshowdetails").hide();
        $("#btnfix").hide();
        $("#dvshowresults").show();
         $('#dvshowresults').slimScroll({
              wheelStep: 5,
              height   : "5vw",
              width    : "99%"
            });
        $("#chkJunkInternetOptimizer").attr("disabled",true);
        $("#chkDiskPerformance").attr("disabled",true);  
        $("#junkimg").removeClass("tuner_space").addClass("rotating_space"); 
        window.external.doAntiVirusScan(1,"","");  
      }
      else if(antiscan === '2'){  
        var ischecked=false; 
         angular.forEach($scope.driversListDetails,function(values,index){
            if(values.IsSelected){
                ischecked=true;
            }
         }); 
         if (ischecked) { 
          $("#dvshowresults").show();   
           $('#dvshowresults').slimScroll({
              wheelStep: 5,
              height   : "1vw",
              width    : "99%"
            });
            $("#chkJunkFile").attr("disabled",true);
            $("#chkDiskPerformance").attr("disabled",true); 
            $("#btnscan").attr("disabled",true);
            //$("#btnshowdetails").attr("disabled",true);
            $("#btnshowdetails").hide();
            $("#btnfix").hide();
           // $("#btnfix").attr("disabled",true);
            $("#junkimg").show();
            $("#junkimg").removeClass("tuner_space").addClass("rotating_space"); 
            $("#dv2").hide();  
            var jsonList = '[', jsonData = '';
           angular.forEach($scope.driversListDetails,function(values,index){
              
              jsonData += jsonData==='' ? '': ',';
              jsonData += '{"IsSelected":"'+values.IsSelected+'", "DriveName":'+JSON.stringify(values.DriveName)+'}';
            });
            jsonList += jsonData;
            jsonList +=']';  
             window.external.doAntiVirusScan(2,jsonList,""); //hard code 
         } 
         else
         {  
            var msgText=$rootScope.getglobalErrorMessage.ERRORANTIVIRUSDRIVE;
            var hdrText=$rootScope.getglobalErrorMessage.HDRANTIVIRUS;
            var btnText=$rootScope.getglobalErrorMessage.BTNOK;
            //Show the info message
             showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,hdrText,msgText,btnText);                       
            $("#dv2").show();
            $("#junkimg").hide();
            $("#btnscan").attr("disabled",false); 
            $("#dvshowresults").hide();  
         }  
      }
       else if(antiscan === '3'){  
        var filepathval  = $("#txtbro").val();
        if (filepathval !== "" ){   
          $("#dvshowresults").show(); 
           $('#dvshowresults').slimScroll({
              wheelStep: 5,
              height   : "5vw",
              width    : "99%"
            }); 
          $("#chkJunkInternetOptimizer").attr("disabled",true);
          $("#chkJunkFile").attr("disabled",true);
          $("#btnscan").attr("disabled",true);
          //$("#btnshowdetails").attr("disabled",true);
          $("#btnshowdetails").hide();
         // $("#btnfix").attr("disabled",true);
          $("#btnfix").hide();
          $("#junkimg").removeClass("tuner_space").addClass("rotating_space");  
          window.external.doAntiVirusScan(3,"",filepathval); //hard code
        }
        else
        {
          var messageText=$rootScope.getglobalErrorMessage.VALIDATEFILEEXISTS;
               var headerText=$rootScope.getglobalErrorMessage.HDRANTIVIRUS;
               var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
               showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,headerText,messageText,buttonText);                                   
        } 
      } 
      }
  
   catch(e){
    // stackTrace(e);
    stackTrace('antivirusController','redirecttoantiviruspath',e,$rootScope.getglobaldata.Client);
   } 

  }; 

  //Fix the Antivirus 
  $scope.fixVirusClean=function()
  {  
     try
        {  
           if($('input[type=checkbox]:checked').length === 0){
               var messageText=$rootScope.getglobalErrorMessage.ERRORANTIVIRUS;
               var headerText=$rootScope.getglobalErrorMessage.HDRANTIVIRUS;
               var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
               showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,headerText,messageText,buttonText);                       
          }
          else{ 
               var jsonList = '[', jsonData = ''; 
               angular.forEach($scope.scannedAntivirusFiles,function(values,index){
                  if (values.Check) {
                      jsonData += jsonData==='' ? '': ',';
                  jsonData += '{"Check":"'+values.Check+'", "IsVirus":"'+values.IsVirus+'", "VirusName":'+JSON.stringify(values.VirusName)+',"Path":'+JSON.stringify(values.Path)+'}';
                  }
                });
               jsonList += jsonData;
               jsonList +=']'; 
               var removeResult = window.external.fixAntivirusClean((jsonList));
               var arrdata = JSON.parse(removeResult); 
               if(arrdata.length > 0) 
               { 
                 $scope.updadminStatus(arrdata);
                 var msgText=$rootScope.getglobalErrorMessage.SUCCESSANTIVIRUS;
                 var hdrText=$rootScope.getglobalErrorMessage.HDRANTIVIRUS;
                 var btnText=$rootScope.getglobalErrorMessage.BTNOK; 
                 showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,hdrText,msgText,btnText);                       
               } 
          }  
     }
     catch(e)
     {
      // stackTrace(e);
      stackTrace('antivirusController','fixVirusClean',e,$rootScope.getglobaldata.Client);
     } 
  };

  $scope.showScandetails=function()
  { 
     try
        {
          $("#btnscan").attr("disabled",true);
          $("#dvScannnedDetails").show();
          $("#dvshowresults").hide();
          $("#junkimg").hide();
          $("#dv2").hide();
          $("#dv3").hide(); 
          var scannedvirusfiles=window.external.viewScannedFiles();  
          $scope.scannedAntivirusFiles=JSON.parse(scannedvirusfiles); 
          //$("#btnshowdetails").attr("disabled",true);
          $("#btnshowdetails").hide();
          // $("#dvScannnedDetails").slimScroll({
          //     wheelStep: 5,
          //     height   : "20vw",
          //     width    : "99%"
          //   });
     }
     catch(e)
     {
      // stackTrace(e);
      stackTrace('antivirusController','showScandetails',e,$rootScope.getglobaldata.Client);
     } 
  };
  $scope.getArrayIndexForKey =  function(arr, key, val){
    for(var i = 0; i < arr.length; i++){
      if(arr[i][key] == val) {
        return i; 
      }
      } 
    return -1;
  }; 

$scope.stopScan=function(){
  window.external.resetAntivirus();
};
  $scope.updadminStatus = function(data) {  
    angular.forEach(data,function(values,index){ 
      var arrindex = $scope.getArrayIndexForKey($scope.scannedAntivirusFiles, "Path", values.Path);  
      if(arrindex >= 0) {
        $scope.scannedAntivirusFiles.splice(arrindex, 1);  
      } 
      });  
  }; 
}); 
 
 function setantivirusScannedFileDetails(scanData)
{
  try
  {   
    $('#scanresult').text('');
    $('#scanresultcount').text('');
     var arr = scanData.split('^^');
     if(arr.length > 2) //scanned successfully scenario
     {    
       $("#btnscan").attr("disabled",false); 
       //$("#btnshowdetails").attr("disabled",false);
       $("#btnshowdetails").show();
       $("#btnfix").show();
       //$("#btnfix").attr("disabled",false);
       $("#junkimg").removeClass("rotating_space").addClass("clean_space");
     }
     if(arr.length > 1)
     {  
     $("#scanresult").text(arr[0]); 
     if(arr[0] === "No Threats Found")
     {  
      //$("#btnshowdetails").attr("disabled",true);
      $("#btnshowdetails").hide();
      //$("#btnfix").attr("disabled",true);
      $("#btnfix").hide();
      $("#chkJunkInternetOptimizer").attr("disabled",false);
      $("#chkDiskPerformance").attr("disabled",false);
      $("#chkJunkFile").attr("disabled",false); 
     } 
     if(arr[1] !== "") {  
        $("#scanresultcount").text(arr[1]);  
      }
     }
     else{ 
      $("#scanresult").text(scanData); 
     } 
}catch(e) {
   // stackTrace(e);
   stackTrace('antivirusController','setantivirusScannedFileDetails',e,offlineGlobalData.Client);
}
}

// function getScanData(data)
// { 
//     var scanDetails=window.external.getScandetails(); 
//     var arr = data.split('^^');
//      if(arr.length > 2) //scanned successfully scenario
//      {  
//      $("#btnscan").attr("disabled",false);
//      $("#btnshowdetails").attr("disabled",false);
//      $("#btnfix").attr("disabled",false);
//      $("#junkimg").removeClass("rotating_space").addClass("clean_space");
//      }  
//      if(arr.length > 1)
//      {
//      $("#scanresult").text(arr[0]);
//      if(arr[1] !== "") {
//         $("#scanresultcount").text(arr[1]);  
//       }
//      }
//      else{
//       $("#scanresult").text(scanData); 
//      }  
//       $("#dvregScannnedDetails").show();
      
// }

function deepscan(id){  
  var rdoid="";
  window.external.resetAntivirus();
  if(id == 1)
  {  
    $("#junkimg").removeClass("clean_space").addClass("tuner_space"); 
    $("#junkimg").show(); 
    $("#dv2").hide();
    $("#dv3").hide();  
    $("#dvshowresults").hide(); 
  }
  else if(id == 2)
  { 
    $("#dvshowresults").hide(); 
    $("#dv2").show();
    $("#junkimg").hide(); 
    $("#dv3").hide(); 
  }
  else
  {
    $("#junkimg").removeClass("clean_space").addClass("tuner_space");
    $('#txtbro').val('');
    $("#dvshowresults").hide();
    $("#dv3").show();
    $("#junkimg").show(); 
    $("#dv2").hide(); 
  } 
} 


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
angular.module( 'activei.databackup', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'databackup', {
    url: '/databackup',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/databackup/databackup.tpl.html",
        controller:"databackupController" 
    }
    },
    data:{ pageTitle: 'DataBackup' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'databackupController', function databackupController( $scope ,$rootScope,$http,$state,ngDialog) {
  $rootScope.isMiddleCont = true;
  $("#btnfileUpload").attr("disabled",true);

  $scope.uploadstart = function(){
    try{
    var files = document.getElementById('file').files;
    if (files.length !== 0 ){
      $("#btnfileUpload").attr("disabled",true);
      $("#btnbrowse").attr("disabled",true);
      $("#file").attr("disabled",true);
      $scope.disProgressbar =true;
     // var percentcompleted=Math.round((loadingval*100)/totalval);
     //document.getElementById("szliderbar").style.display='block';
     
      uploadFile();
      $scope.disProgressbar =false;
    }
    else
    {
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRDATABACKUP,$rootScope.getglobalErrorMessage.ERRORDATBACKUPNOFILE,$rootScope.getglobalErrorMessage.BTNOK);
    }
  }
  catch(e){
    stackTrace('databackupController','uploadstart ',e,$rootScope.getglobaldata.Client);
  }
  };
 /*$scope.loader= function()
{
  drawszlider(100,50);
};*/

});

var totUploadedsize=0;
var totUploadededsize=0;
var percentCurrent=0;
var uploadingFileCnt=0;
function bindFileList()
{
  try
  {
    
    var files = document.getElementById('file').files;
    // if (files.length > 0) {
        var fileStringHead="<table class=diskBackupTable border=1;cellspacing=0;cellpadding=1;width:100%;><tbody>";
        var fileHeaderRow="<tr class=filesHeader><td>File Name</td><td>File Size</td><td >Sync Status</td></tr>";
        var tableBodystring="";
        document.getElementById("szliderbar").style.width='0%';
        document.getElementById("szazalek").innerHTML='0%';
        if (files.length > 0) {
          $("#btnfileUpload").attr("disabled",false);
          // $("#file").val(files.length+" files selected");
        }
      for(var i=0;i<files.length;i++)
        {
           var file = document.getElementById('file').files[i]; 
           var sizeinbytes = document.getElementById('file').files[i].size;
           var fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
           var fSize = sizeinbytes; j=0;while(fSize>900){fSize=(fSize/1024);j++;} 
           var sizeformat = (Math.round(fSize*100)/100)+' '+fSExt[j];

           tableBodystring = tableBodystring+"<tr><td>"+file.name+"</td><td>"+sizeformat+"</td><td id=progress"+i+" class='icon-checkmark progressStart'>&nbsp;<span id=progressText"+i+">Yet to start</span></td></tr>";
           totUploadedsize = totUploadedsize+ file.size;
        }

      if(files.length<8)
      {
        for (var a=files.length;a<8;a++)
        {
            tableBodystring = tableBodystring+"<tr class=whitebackground><td colspan=3>&nbsp;</td></tr>";
        }
      }
      var fileStringFoot="</tbody></table>";
      fileStringTable=fileStringHead+fileHeaderRow+tableBodystring+fileStringFoot;
      $(".fileListTable").empty();
      $(".fileListTable").append(fileStringTable);
      if(files.length > 8)
      {
        $('.fileListTable').slimScroll({
                      wheelStep: 5,
                      width: "100%",
                       height: "80%"
                    });
        }
        else{
        $('.fileListTable').slimScroll({
                      wheelStep: 5,
                      width: "100%",
                       height: "100%"
                    });
      }
    // }
  
}
  catch(e)
  {
    // stackTrace(e);
    stackTrace('databackupController','bindFileList',e,offlineGlobalData.Client);
  } 
}
function uploadFile () {
  try
  {
    document.getElementById("szliderbar").style.width='0%';
     document.getElementById("szazalek").innerHTML='0%';
     // $('#file').val('');
     uploadingFileCnt=0;
    var files = document.getElementById('file').files; 
    uploadSelectedFiles(files,0);
  // for(var i=0;i<files.length;i++)
  //   {
  //     // alert('uploadFile');
      
  //     var file =document.getElementById('file').files[i];
  //     var fd = new FormData();
  //     var key='Super/'+file.name;
  //        POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
  //           "conditions": [
  //                           ["eq", "$bucket", "jack2"],
  //                           ["starts-with", "$key", "Super/"+file.name],
  //                           {"acl": "public-read"},
  //                           {"x-amz-meta-filename": file.name},
  //                           ["starts-with", "$Content-Type", file.type]
  //                         ]
  //         };      

  //     var secret = "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi";
  //     var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
  //     var signature = b64_hmac_sha1(secret, policyBase64);
  //     fd.append("key", "Super/"+file.name);
  //     fd.append("acl", "public-read"); 
  //     fd.append("Content-Type",file.type);      
  //     fd.append("AWSAccessKeyId", "AKIAJPSOLEVW3CMPKP7Q");
  //     fd.append("x-amz-meta-filename",file.name);
  //     fd.append("policy", policyBase64);
  //     fd.append("signature",signature);

  //     fd.append("file",document.getElementById('file').files[i]);

  //    // uploadFiles(file.size);

  //     $.ajax({
  //             url: 'https://jack2.s3.amazonaws.com/',
  //             type: 'POST',
  //             data: fd,
  //             async: false,
  //             cache: false,
  //             contentType: false,              
  //             processData: false,
  //             success: uploadComplete(file.size),
  //             error: uploadFailed
  //           }); 
  // }

  
  }

  catch(e)
  {
    // stackTrace(e);
    stackTrace('databackupController','uploadFile',e,offlineGlobalData.Client);
  } 
}

function uploadSelectedFiles(files,position)
{
  // alert(position);
    var file =document.getElementById('file').files[position];
      var fd = new FormData();
      var key='Super/'+file.name;
         POLICY_JSON = { "expiration": "2020-12-01T12:00:00.000Z",
            "conditions": [
                            ["eq", "$bucket", "jack2"],
                            ["starts-with", "$key", "Super/"+file.name],
                            {"acl": "public-read"},
                            {"x-amz-meta-filename": file.name},
                            ["starts-with", "$Content-Type", file.type]
                          ]
          };      

      var secret = "FqpOdFoVxpdRtUV837qb7lBkQBJEHa7uMuqkEIUi";
      var policyBase64 = Base64.encode(JSON.stringify(POLICY_JSON));
      var signature = b64_hmac_sha1(secret, policyBase64);
      fd.append("key", "Super/"+file.name);
      fd.append("acl", "public-read"); 
      fd.append("Content-Type",file.type);      
      fd.append("AWSAccessKeyId", "AKIAJPSOLEVW3CMPKP7Q");
      fd.append("x-amz-meta-filename",file.name);
      fd.append("policy", policyBase64);
      fd.append("signature",signature);

      fd.append("file",document.getElementById('file').files[position]);

     // uploadFiles(file.size);

      $.ajax({
              url: 'https://jack2.s3.amazonaws.com/',
              type: 'POST',
              data: fd,
              //async: false,
              cache: false,
              contentType: false,              
              processData: false,
              success: function(data) {
                //alert ("complete success thiru"+data);
                uploadComplete(file.size,files,position); 
              },
              error: uploadFailed
            }); 
}

function uploadFiles(filesize)
{
  // alert('In');
   $.post('https://jack2.s3.amazonaws.com/',fd).success(function (resp) {  
        // alert(resp);
        uploadComplete(filesize);
      }).error(function (resp) {
        uploadFailed(evt);
         // alert("failure"+ JSON.stringify(data));
      });
}

  function uploadComplete(filesize,files,pos) {
    try
    { 
      // alert('uploadComplete');
      //totUploadededsize = totUploadededsize + filesize;
      // alert("totUploadededsize--"+totUploadededsize +"filesize--"+filesize);
      //drawszlider(pos,files.length);

      var percentcompleted=Math.round(((pos+1)*100)/files.length);
      document.getElementById("szliderbar").style.width=percentcompleted+'%';
      document.getElementById("szazalek").innerHTML=percentcompleted+'%';

      $("#progress"+uploadingFileCnt).removeClass("progressStart").addClass("progressEnd");
      $("#progressText"+uploadingFileCnt).empty();
      $("#progressText"+uploadingFileCnt).html('Uploaded');
      uploadingFileCnt=uploadingFileCnt+1; 
      if(totUploadededsize === totUploadedsize) {
         document.getElementById("szliderbar").style.width='0%';
         document.getElementById("szazalek").innerHTML='';
         $('#file').val('');
         totUploadededsize=0;
         totUploadedsize=0;
         uploadingFileCnt=0;
      }

      //index++;
      // alert('files.length--'+(files.length-1) +"--index--"+pos);
      if ((parseInt(files.length,10)-1) > pos) {
        // alert('In');
          uploadSelectedFiles(files,++pos);
      }
      else if((parseInt(files.length,10)-1) === pos) {
          $("#btnbrowse").attr("disabled",false);
          $("#file").attr("disabled",false);
          $('#file').val('');
      }
    }
    catch(e)
    { 
      // stackTrace(e);
      stackTrace('databackupController','uploadComplete',e,offlineGlobalData.Client);
    } 
  }

  function uploadFailed(evt) {
    try{ 
         $("#progress"+uploadingFileCnt).removeClass("progressStart").addClass("progressfailed");
          $("#progressText"+uploadingFileCnt).empty();
          $("#progressText"+uploadingFileCnt).html('Failed to Upload');
    }
    catch(e)
    {
       // stackTrace(e);
       stackTrace('databackupController','uploadFailed',e,offlineGlobalData.Client);
    }
  }

  function uploadCanceled(evt) {
    alert("The upload has been canceled by the user or the browser dropped the connection.");
  }

  function opendatabackup()
  {
     $("#file").click();
  }





 
    



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
angular.module( 'activei.defragmentation', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'defragmentation', {
    url: '/defragmentation',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/defragmentation/defragmentation.tpl.html",
        controller:"defragmentationController" 
    }
    },
    data:{ pageTitle: 'Defragmentation' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'defragmentationController', function defragmentationController( $scope ,$rootScope,$http,$state,$timeout,ngDialog) {
  $rootScope.isMiddleCont = true; 

  setForceDefragControl();
  $("#dvDefragmentationDetails").hide();
  $("#dvDefragmentOptions").show();
  $scope.startDefragment=function(){
    try {

      var analysis,deframentation,forcedefragmentation;
      if ($("input[name=rdbdefraganalyse]:checked").val() === '0') {
         analysis=true;
         deframentation=false; 
         $('#spnanalyse').show();
         $('#spndefragment').hide();
      }
      else
      {
        analysis=false;
        deframentation=true; 
        $('#spnanalyse').hide();
         $('#spndefragment').show();
      }
      forcedefragmentation=$("#chkForceDefragment").is(":checked");
      driversList=window.external.defragmentationInit(analysis,deframentation,forcedefragmentation);
      $scope.driversListDetails=JSON.parse(driversList);
    } catch (e) {
        // stackTrace(e);
        stackTrace('defragmentationController','startDefragment ',e,$rootScope.getglobaldata.Client);
    }
  };

  $scope.initDefragmentation=function(){
    // alert($("#chkForceDefragment").is(":checked"));
    try {
   
    var ischecked=false;
     angular.forEach($scope.driversListDetails,function(values,index){
        if(values.IsSelected){
            ischecked=true;
        }
     });

     if (ischecked) {
      $scope.loaderdisplay = true;
       $('#btnStart').hide();
       $('#btnStop').show();
        var jsonList = '[', jsonData = '';
       angular.forEach($scope.driversListDetails,function(values,index){
          
          jsonData += jsonData==='' ? '': ',';
          jsonData += '{"IsSelected":"'+values.IsSelected+'", "DriveName":'+JSON.stringify(values.DriveName)+'}';

        });
       jsonList += jsonData;
       jsonList +=']';
       var analysis,deframentation,forcedefragmentation;
      if ($("input[name=rdbdefraganalyse]:checked").val() === '0') {
         analysis=true;
         deframentation=false;
      }
      else
      {
        analysis=false;
        deframentation=true;
      }
     
      forcedefragmentation=$("#chkForceDefragment").is(":checked");
         window.external.startDefragmentationProcess(jsonList,analysis,deframentation,forcedefragmentation);
         // $timeout( function(){ $scope.showReport(); }, 20000);   
     }
     else
     {
        var messageText=$rootScope.getglobalErrorMessage.DEFRAGDRIVEMSG;
        var headerText=$rootScope.getglobalErrorMessage.HDRDEFRAG;
        var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        //Show the info message
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
     }
   }
     catch(e){
      // stackTrace(e);
      stackTrace('defragmentationController','initDefragmentation ',e,$rootScope.getglobaldata.Client);
     }

  };

  $scope.showReport=function(){
    try {
       reportData=window.external.getAnalysisReport();
       $("#dvDefragmentOptions").hide();
       $("#dvDefragmentationDetails").show();
       $(".diskAnalysis").empty();
       $(".diskAnalysis").append(reportData);
     }
       catch(e){
      // stackTrace(e);
      stackTrace('defragmentationController','showReport ',e,$rootScope.getglobaldata.Client);
     }
  };

  $scope.closeAnalysisDetails=function(){
    try{
      $('#btnStart').show();
      $('#btnStop').hide();
      $state.reload();
     }
     catch(e){
      // stackTrace(e);
      stackTrace('defragmentationController','closeAnalysisDetails ',e,$rootScope.getglobaldata.Client);
     }
  };

  $scope.stopProcess=function(){
    try{
      $scope.loaderdisplay = false;
      window.external.stopDefragmentationProcess();
    }
     catch(e){
      // stackTrace(e);
      stackTrace('defragmentationController','stopProcess ',e,$rootScope.getglobaldata.Client);
     }
  };
       
});

function showDefragmentReportData()
{
   reportData=window.external.getAnalysisReport();
   $("#dvDefragmentOptions").hide();
   $("#dvDefragmentationDetails").show();
   $(".diskAnalysis").empty();
   $(".diskAnalysis").append(reportData);
}

function setForceDefragControl(){
  try{
   $("#chkForceDefragment").attr("checked",false);
  if($("input[name=rdbdefraganalyse]:checked").val() === '0'){

  $("#chkForceDefragment").attr("disabled",true); 
  $('#spnanalyse').show();
  $('#spndefragment').hide();
  }
  else{
    $("#chkForceDefragment").attr("disabled",false); 
    $('#spnanalyse').hide();
    $('#spndefragment').show();
  }
  }
   catch(e){
    // stackTrace(e);
    stackTrace('defragmentationController','setForceDefragControl ',e,offlineGlobalData.Client);
   }
}
 
    



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
angular.module( 'activei.firewall', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'firewall', {
    url: '/firewall',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/firewall/firewall.tpl.html",
        controller:"firewallController" 
    }
    },
    data:{ pageTitle: 'Firewall' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'firewallController', function firewallController( $scope ,$rootScope,$http,$state,ngDialog) {

$scope.openBrowse = function()
{
  try
  {
    $scope.filepath=window.external.openBrowseDialog();
  } 
  catch(e)
  {
    // stackTrace(e);
    stackTrace('firewallController','openBrowse ',e,$rootScope.getglobaldata.Client);
  } 
};
 
  $rootScope.isMiddleCont = true; 
       $("#dv2").hide();
       $("#dv3").hide(); 
       $("#dv4").hide();
       $("#dv5").hide();
       $("#dv6").hide(); 
       $("#btncancel").hide();

  $scope.redirecttoProgrampath = function (type) { 
    try
    { 
       switch(type) {
      case 'dv1':
          $("#dv1").show();
          if($("input[name=rdbappPort]:checked").val()==='application'){
            $("#dv2").hide();
          }
          else{
            $("#dv6").hide();
          }
          $("#dv3").hide(); 
          $("#dv4").hide(); 
          $("#dv5").hide();
          break; 
        case 'dv2': 
          $("#dv1").hide();
          if($("input[name=rdbappPort]:checked").val() === 'application'){
            $("#dv2").show();
            $("#dv6").hide();
          }
          else{
            $("#dv6").show();
            $("#dv2").hide();
          }
          $("#dv3").hide(); 
          $("#dv4").hide();
          $("#dv5").hide();
          break;
        case 'dv3': 
          if($("input[name=rdbappPort]:checked").val() === 'application'){
            if($scope.filepath === null || $scope.filepath === undefined){
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORAPPPATH,$rootScope.getglobalErrorMessage.BTNOK);
              break;
            }
             $("#dv2").hide();
          }
          else{
              if($scope.portnumbers === null || $scope.portnumbers === undefined ||  $.trim($scope.portnumbers) === "")
              {
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORPORTNO,$rootScope.getglobalErrorMessage.BTNOK);
                break;
              }
              else
              {
                var validPort=window.external.portValidation($scope.portnumbers);
                if(validPort === false)
                {
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORINVALIDPORTNO,$rootScope.getglobalErrorMessage.BTNOK);
                  break;
                }
              }
              $("#dv6").hide();
          }
          $("#dv1").hide();
          $("#dv3").show();
          $("#dv4").hide(); 
          $("#dv5").hide(); 
          break;
        case 'dv4':
          $("#dv1").hide();
          $("#dv2").hide();
          $("#dv3").hide(); 
          $("#dv4").show(); 
          $("#dv5").hide();
          break;
        case 'dv5':
       

        var chkDomain=$('#chkDomain').is(':checked');
        var chkPrivate=$('#chkPrivate').is(':checked');
        var chkPublic=$('#chkPublic').is(':checked');

           if(chkDomain !== true && chkPrivate !== true && chkPublic !== true)
              {
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORPROFILE,$rootScope.getglobalErrorMessage.BTNOK);
                break;
              }
          $("#dv1").hide();
          $("#dv2").hide();
          $("#dv3").hide(); 
          $("#dv4").hide(); 
          $("#dv5").show();
          break;
      }
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('firewallController','redirecttoProgrampath ',e,$rootScope.getglobaldata.Client);
    } 
  }; 
  $scope.createFirwallrule =function()
  {
    try
    {
      if($scope.ruleName === null || $scope.ruleName === undefined)
        {
          showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORRULENAME,$rootScope.getglobalErrorMessage.BTNOK);
          return;
        }
        var rdbinOutBound = $("input[name=rdbinOutBound]:checked").val();

        var rdbappPort = $("input[name=rdbappPort]:checked").val();

        var rdbPorts = $("input[name=rdbPorts]:checked").val();

        var rdballwConct= $("input[name=rdballwConct]:checked").val();

       var chkDomain  = $('#chkDomain').is(":checked");
       var chkPrivate = $('#chkPrivate').is(":checked");
       var chkPublic  = $('#chkPublic').is(":checked");

       var filepathval  = $("#txtbro").val();
       var portnumbersVal  = $("#portnumbers").val();

       var ruleNameVal  = $("#ruleName").val();
       var ruleDescriptionVal  = $("#ruleDescription").val();      
       var fwruleCreated="";
       try{ 
        fwruleCreated = window.external.fwapplicationRule(rdbinOutBound, rdballwConct,  chkDomain,  chkPrivate,  chkPublic,  rdbappPort,  filepathval,  rdbPorts,  portnumbersVal,  ruleDescriptionVal,  ruleNameVal);    
        }
        catch(e)
        {
          // stackTrace(e);
          stackTrace('firewallController','createFirwallrule ',e,$rootScope.getglobaldata.Client);
        }
       if (fwruleCreated !== "Failed" && fwruleCreated !== null)
       {
          showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,fwruleCreated,$rootScope.getglobalErrorMessage.BTNOK);
       }
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('firewallController','createFirwallrule ',e,$rootScope.getglobaldata.Client);
    }
    };
 
  $scope.cancelFirwallrule =function()
  { 
      $scope.redirecttoProgrampath('dv1');
  };
  
});
 
    



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
angular.module( 'activei.parentalcontrol', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'parentalcontrol', {
    url: '/parentalcontrol',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/parentalcontrol/parentalcontrol.tpl.html",
        controller:"parentalcontrolController" 
    }
    },
    data:{ pageTitle: 'Parental Control' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'parentalcontrolController', function parentalcontrolController( $scope ,$rootScope,$http,$state,$cookieStore,$filter,ngDialog){
  $rootScope.isMiddleCont = true;  
   $scope.frmdata={};
      $scope.frmdata.Slno = [];   
    $scope.blockWebsite = function () {  
      try
      {  
        var txt = $('#txturl').val(); 
        var re = /(http(s)?:\\)?([\w-]+\.)+[\w-]+[.com|.in|.org]+(\[\?%&=]*)?/;

        if($("#txturl").val === '') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'Please Enter the Website URL',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }
          else if(re.test(txt)){  
            var urlParts = txt.replace('http://','').replace('https://','').split(/[/?#]/);
            var domain = urlParts[0]; 
            var keepGoing = true;
            angular.forEach($scope.productDetailsNew, function(value, key) {  
                 mystr=value.Blocked; 
                 var urlmystr = mystr.replace('http://','').replace('https://','').split(/[/?#]/);
                 var urlmystrdomain = urlmystr[0];  
                 if(keepGoing && urlmystrdomain === domain){ 
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'The URL has Blocked Already',$rootScope.getglobalErrorMessage.BTNOK);                             
                   keepGoing = false;
                 }  
            });

            if(keepGoing) {
              showLoader();
              var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"AddParental"; 
              var customerId=parseInt(localStorage.getItem('StoredCustomerID'),10); 
              $scope.date = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');  
              var param = '{"parentalDetails": {"Blocked": "'+ $scope.frmdata.txturl +'","BlockedOn": "'+ $scope.date +'", "Type": "Website", "Customer_ID":'+ customerId + '}}'; //Data sent to server        
                $http.post(servicePath, param).success(function (result) { 
                $.loader('close');  
                    var ss = result.d;
                    if(result.d) { 
                      window.external.writeTextToHost($scope.frmdata.txturl);
                      $("#txturl").val('');
                      showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'URL Blocked Successfully',$rootScope.getglobalErrorMessage.BTNOK);                               
                      $scope.bindblockDetails();
                    }   
                }).error(function (serverResponse, status, headers, config) {
                  $.loader('close');
                  stackTrace(e);
                    //alert("failure");
                });
            } 
          }
          
          else
          {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'Please Enter Valid URL',$rootScope.getglobalErrorMessage.BTNOK);           
            return false; 
          }
      }
      catch(e)
      {
        // stackTrace(e);
        stackTrace('parentalcontrolController','blockWebsite ',e,$rootScope.getglobaldata.Client);
      }
      
  };

    $scope.bindblockDetails=function()
      {     
        try
        {
          getproductDet($scope,$http,$cookieStore,$rootScope); 
        }
        catch(e)
        {
          // stackTrace(e);
          stackTrace('parentalcontrolController','bindblockDetails ',e,$rootScope.getglobaldata.Client);
        } 
      };
 
    $scope.UnblockWebsite = function () {   
      try
      { 
        // showLoader();
        var values=$scope.frmdata.Slno;   
        var selArr = [];  
        angular.forEach(values, function(value, key) {  
          if(value && value != "false" ) { 
            selArr.push(parseInt(value,10));
          }  
        }); 
        // if(selArr.length === 0){ 
        //   showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'Please Select atleast one Blocked Site',$rootScope.getglobalErrorMessage.BTNOK);                     
        //   return false;
        // }
        if($('input[type=checkbox].chkparentalurl:checked').length === 0){ 
          showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'Please Select atleast one Blocked Site',$rootScope.getglobalErrorMessage.BTNOK);
          return false;
        }
        else{
          if(selArr.length > 0) { 
            var blockedUrl = $.map($scope.productDetailsNew, function(val,i) {
              if($.inArray( val.Slno, selArr) > -1) {
                return val.Blocked; 
              }
            });
          if(blockedUrl.length > 0)
          {  
            window.external.replaceTextInHost(JSON.stringify(blockedUrl));
            var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"RemoveParental"; 
            
             //Data to server  
             showLoader(); 
            angular.forEach(selArr, function(value, key) {  
                  var param = {};    
                  param.slno = value;
                  deleteWeb($scope,$http, servicePath, param);  
                    var arrindex = $scope.getArrayIndexForKey($scope.productDetailsNew, "Slno", value);                      
                    if(arrindex >= 0) {
                      $scope.productDetailsNew.splice(arrindex, 1);  
                    }   
            });
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPARENTALCONTROL,'URL Unblocked Successfully',$rootScope.getglobalErrorMessage.BTNOK);
            values="";
            $.loader('close');  
          } 
        }
        }

         
     } 
     catch(e)
     {
      $.loader('close'); 
      // stackTrace(e);
      stackTrace('parentalcontrolController','UnblockWebsite ',e,$rootScope.getglobaldata.Client);
     }
    }; 

    $scope.getArrayIndexForKey =  function(arr, key, val){
    for(var i = 0; i < arr.length; i++){
      if(arr[i][key] == val) {
        return i; 
      }
      } 
    return -1;
  };

    $scope.convertDate = function(date){  
              var convertedDate = new Date
                          (
                               parseInt(date.replace(/(^.*\()|([+-].*$)/g, ''),10)
                          ); 
              var dat = (convertedDate.getMonth() + 1) + "/" + convertedDate.getDate() + "/" + convertedDate.getFullYear();  
              return dat;
            
};

  }); 
    
function deleteWeb($scope,$http, servicePath, param) {
  try
  {   
     $.post(servicePath,param).success(function (resp) {  
        return true;  
      }).error(function (data) {
        $.loader('close');
         // alert("failure"+ JSON.stringify(data));
      });
  }
  catch(e){
    // stackTrace(e);
    stackTrace('parentalcontrolController','deleteWeb ',e,offlineGlobalData.Client);
    $.loader('close'); 
  } 
}
function getproductDet($scope,$http,$cookieStore,$rootScope){ 
try
{
      var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "RetriveALLParental";  
      var param={};
      param.customerID = parseInt(localStorage.getItem('StoredCustomerID'),10); 
      $http.post(servicePath,param).then(function (resp) 
          {
            if(resp.data.d !== null && resp.data.d!== undefined && resp.data.d!=='')
            {  
              $('.table-responsive').slimScroll({
                wheelStep: 5,
                width: "100%",
                 height: "20vw"
              });
              var ss = resp.data.d[0].BlockedOn; 
              $(".parental_display").show();  
              $scope.productDetailsNew = resp.data.d;
            }
            else
            {
              $(".parental_display").hide();
            }
          }).error(function (serverResponse, status, headers, config) {
              //alert("failure");
          });
} 
catch(e) 
{
  // stackTrace(e);
  stackTrace('parentalcontrolController','getproductDet ',e,offlineGlobalData.Client);
}  
}
 
    



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
angular.module( 'activei.pcoptimization', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'pcoptimization', {
    url: '/pcoptimization',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/pcoptimization/pcoptimization.tpl.html",
        controller:"pcoptimizationController"
    
    }
    },
    data:{ pageTitle: 'PC Optimization' }
  }); 
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'pcoptimizationsuiteController', function pcoptimizationsuiteController( $scope ,$rootScope,$http,$state,ngDialog) {
  $rootScope.isMiddleCont = true;
   
  })
.controller( 'pcoptimizationController', function pcoptimizationController( $scope ,$rootScope,$http,$state,ngDialog) {
  $scope.junkDetails=null;
  $rootScope.isMiddleCont = true;
  $scope.chkJunkFile=true;
  $scope.chkInternetOptimizer=true;
  $scope.isfixAllbtnShow=true;
  $scope.isshowAllfiles=true;
    $('.diskAnalysis').slimScroll({
          wheelStep: 5,
          height   : "24vw",
          width    : "100%"
        });
  $("#dvpcOptimizatoinScan").show();

    $scope.scanJunkFiles=function()
    { 
      try
      { 
         if (!$scope.chkJunkFile && !$scope.chkInternetOptimizer && !$scope.chkDiskPerformance) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRPCOPTIMIZATION,$rootScope.getglobalErrorMessage.INFOPCOPTIMIZATION,$rootScope.getglobalErrorMessage.BTNOK);
            return false;
        } 
        $("#dvshowresults").hide();

        $("#btnScanNow").attr("disabled",true);
        $("#chkJunkFiles").attr("disabled",true);
        $("#chkJunkInternetOptimizer").attr("disabled",true);
        $("#chkDiskPerformance").attr("disabled",true);
        $("dvshowwarning").hide();
        $("#spnRecordCount").hide();
        $("#btnFixAll").attr("disabled",false);
        $("#btnFixAll").hide();
        $("#btnShowDetails").hide();
        $('#diskperofromanceReport').hide();
        $("#junkimg").removeClass().addClass("tuner_space");
        $("#internetimg").removeClass().addClass("tuner_space");
        $("#diskimg").removeClass().addClass("tuner_space");
        var isJunkfile=($scope.chkJunkFile!==true)?false:$scope.chkJunkFile;
        var isInternet=($scope.chkInternetOptimizer!==true)?false:$scope.chkInternetOptimizer;
        var isDiskPerfo=($scope.chkDiskPerformance!==true)?false:$scope.chkDiskPerformance;
        if (isJunkfile) {
          $("#junkimg").removeClass("tuner_space").addClass("rotating_space");
        }
        else if (isInternet) {
           $("#internetimg").removeClass("tuner_space").addClass("rotating_space");
         }
         else
         {
           $("#btnStopScan").show();
           $("#btnScanNow").hide();
          $("#diskimg").removeClass("tuner_space").addClass("rotating_space");

         }
        
        window.external.doPCOptimization(isJunkfile,isInternet,isDiskPerfo);
      } 
      catch(e)
    {
     // stackTrace(e);
     stackTrace('pcoptimizationController','scanJunkFiles ',e,offlineGlobalData.Client);
    } 
    };

 

  $scope.loadJunkDetails=function()
  {
      try
        {
          if ($scope.junkDetails===null ) {
            junkFilesList = window.external.getHistory();
            $scope.junkDetails=  JSON.parse(junkFilesList); 
          }
         }catch(e)
        {
          // stackTrace(e);
          stackTrace('pcoptimizationController','loadJunkDetails ',e,offlineGlobalData.Client);
        }
  };

    $scope.showJunkFileDetails=function()
    {
      try
      {
        $("#dvpcOptimizatoinScan").hide();
        $("#dvpcOptimizatoinShowDetails").show();
        $scope.loadJunkDetails();
      }
      catch(e)
      {
        // stackTrace(e);
        stackTrace('pcoptimizationController','showJunkFileDetails ',e,offlineGlobalData.Client);
      } 
    };

    $scope.redirectToPCOptimization=function()
    {
      try{
        $("#dvpcOptimizatoinScan").show();
        $("#dvpcOptimizatoinShowDetails").hide();
      }
      catch(e)
      {
        // stackTrace(e);
        stackTrace('pcoptimizationController','redirectToPCOptimization ',e,offlineGlobalData.Client);
      } 
    };

     $scope.deleteJunkFiles=function()
    {
      try
      {
        $("#btnFixAll").attr("disabled",true);
        $("#btnScanNow").attr("disabled",true);  
        $("#dvshowresults").hide();
        $scope.junkDetails= null;
        window.external.deleteAllJunkFiles();
      }
      catch(e)
      { 
        // stackTrace(e);
        stackTrace('pcoptimizationController','deleteJunkFiles ',e,offlineGlobalData.Client);
      }
    };

  $scope.deleteSelctedJunkFiles=function()
  {
      try
        {
          var isSelected=false;
          angular.forEach($scope.junkDetails,function(values,index){
            if (values.IsSelected) {
              isSelected=true;
              return;
            }  
         });

          if (isSelected) {
              var jsonList = '[', jsonData = '';

             angular.forEach($scope.junkDetails,function(values,index){

                jsonData += jsonData==='' ? '': ',';
                jsonData += '{"IsSelected":"'+values.IsSelected+'", "FilePath":'+JSON.stringify(values.FilePath)+'}';
                
              });
             jsonList += jsonData;
             jsonList +=']';
             $scope.junkDetails= null;
             $("#dvshowresults").hide();
            window.external.deleteSelectedJunkFiles((jsonList));
          }
          else{
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,$rootScope.getglobalErrorMessage.HDRPCOPTIMIZATION,$rootScope.getglobalErrorMessage.INFOPCOPTSELECT,$rootScope.getglobalErrorMessage.BTNOK);
          }
        
     }
     catch(e)
     {
      // stackTrace(e);
      stackTrace('pcoptimizationController','deleteSelctedJunkFiles ',e,offlineGlobalData.Client);
     }
  };

  $scope.showDisperfomanceDetails=function()
  {   
    try
    {
      discperformancedet=window.external.getDiscPerformanceDetails();
        $("#dvdiscPerformanceDetails").show();

      // $scope.discDefragmentDetails=discperformancedet;
      $(".diskAnalysis").empty();
      $(".diskAnalysis").append(discperformancedet);


      // alert($scope.discDefragmentDetails);
      $("#dvpcOptimizatoinShowDetails").hide();
      $("#dvpcOptimizatoinScan").hide(); 
    }
    catch(e)
    {
       // stackTrace(e);
       stackTrace('pcoptimizationController','showDisperfomanceDetails ',e,offlineGlobalData.Client);
    }
      
  };

  $scope.hideDisperfomanceDetails=function()
  {
      $("#dvdiscPerformanceDetails").hide();
     $("#dvpcOptimizatoinShowDetails").hide();
      $("#dvpcOptimizatoinScan").show();
  };

  $scope.stopDiskScan=function()
  {
    try{
      window.external.stopScan();
    }
    catch(e)
    {
       // stackTrace(e); 
       stackTrace('pcoptimizationController','stopDiskScan ',e,offlineGlobalData.Client);
    } 
  }; 
  });
 function chkAllJunkFiles () {
    
      if($("#chkAllFiles").is(":checked")) { 
          $("input[type=checkbox][name=chkJunkData]").attr("checked", true);
      }
  }  
function getStatus(isJunk,isIntOpt,isDiskPer)
{
  try
  {
    if (isJunk === "True" && isIntOpt === "True") {
       $("#junkimg").removeClass("rotating_space").addClass("static_space");
      
        $("#internetimg").removeClass("tuner_space").addClass("rotating_space");
      }
      else if (isDiskPer === 'True') {
         $("#diskimg").removeClass("tuner_space").addClass("rotating_space");
      }
  }
  catch(e)
  {
    // stackTrace(e); 
    stackTrace('pcoptimizationController','getStatus ',e,offlineGlobalData.Client);
  }
     
}

function getStatusList(list,isJunk,isIntOpt,isDiskPer)
{
  try
  {
    list=(list===null)?0:list;
    if(list.length > 0)
    {
       $("#dvshowresults").show();
       $("#dvshowwarning").show(); 
       $("#spnRecordCount").show().text("Problems Found :"+list.length);
       $("#spanresult").hide();
       $("#dvRecordCountsuccess").hide();
       $("#spnRecordCountsuccess").hide(); 
       if (isJunk === "True") {
          $("#junkimg").removeClass().addClass("error_space");
         
        }
       if (isIntOpt === "True") {
         $("#internetimg").removeClass().addClass("error_space");
       }
       if (isDiskPer === 'True') {
        $("#diskimg").removeClass().addClass("rotating_space");
        $("#btnScanNow") .hide();
        $("#btnStopScan").show();
       
       }

       if (isJunk === "True" && isDiskPer === 'False') {
           $("#btnScanNow") .show();
                  
           $("#btnFixAll").show();
           $("#btnShowDetails").show();
           $("#btnStopScan").hide();
       }
       $("#btnFix").attr("disabled",false);
       $("#btnShowDetails").attr("disabled",false);
       

    }
    else
    {
        $("dvshowwarning").hide();
        $("#spnRecordCount").hide().text("");
        if (isJunk === 'True') {
          $("#junkimg").removeClass().addClass("clean_space");
        }
       if (isIntOpt === 'True') {
         $("#internetimg").removeClass().addClass("clean_space");
       }
       if (isDiskPer === 'True') {
        $("#diskimg").removeClass().addClass("rotating_space");
        $("#btnScanNow") .hide();
        $("#btnStopScan").show();
       }
       $("#btnFixAll").hide();
       $("#btnShowDetails").hide();
    }
        $("#btnScanNow").attr("disabled",false);    
      $("#chkJunkFiles").attr("disabled",false);
       $("#chkJunkInternetOptimizer").attr("disabled",false);
       $("#chkDiskPerformance").attr("disabled",false);
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('pcoptimizationController','getStatusList ',e,offlineGlobalData.Client);
  } 
}
    

function changeJunkCompleted()
{
  try
  {
     $("dvshowwarning").hide();
     $("#spnRecordCount").hide().text("");
     $("#junkimg").removeClass().addClass("clean_space");
     $("#btnFixAll").hide();
     $("#btnShowDetails").hide();
     $("#btnScanNow").attr("disabled",false);
     $("#chkJunkFiles").attr("disabled", false);
     $("#chkJunkInternetOptimizer").attr("disabled", false);
     $("#chkDiskPerformance").attr("disabled", false);
  }
  catch(e){
    // stackTrace(e);
    stackTrace('pcoptimizationController','changeJunkCompleted ',e,offlineGlobalData.Client);
  }
     
}


function changeSelectedFileJunkCompleted()
{
  try{
     $("#junkimg").removeClass().addClass("clean_space");
     $("#spnRecordCount").hide().text("Optimization Complete");
     $("#dvpcOptimizatoinShowDetails").hide();
     $("#dvpcOptimizatoinScan").show();
     $("#btnFixAll").hide();
     $("#btnShowDetails").hide();
     $("#btnScanNow").attr("disabled",false);
     $("#chkJunkFiles").attr("disabled", false);
     $("#chkJunkInternetOptimizer").attr("disabled", false);
     $("#chkDiskPerformance").attr("disabled", false);
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('pcoptimizationController','changeSelectedFileJunkCompleted ',e,offlineGlobalData.Client);
  }    
}

function diskPerformanceShow(isJunk,isIntOpt,isDiskPer,filelistcount,isdiscperformance,isScanStopped)
{
  try
  {
    var showText='';
    var showsuccessText='';
    if (isScanStopped==='False') {
      if (isdiscperformance === 'True') { 
        $("#diskimg").removeClass().addClass("clean_space");
        $("#dvshowresults").show();
        // $("#spnRecordCount").show();
        $("#spanresult").show();
        $("#dvshowwarning").hide();
        $("#diskperofromanceReport").show();
        $("#dvRecordCountsuccess").show();
       if(parseInt(filelistcount,10) > 0){
        $("#dvshowwarning").show();
        $("#spnRecordCount").show().text("Problems Found : "+filelistcount);
        $("#spnRecordCountsuccess").show().text("Disk performance analysis completed."); 
       }
       else
       { 
        $("dvshowwarning").hide();
        $("#dvshowresults").show(); 
        $("#spanresult").show();
        $("#diskperofromanceReport").show(); 
        $("#spnRecordCountsuccess").show().text("Disk performance analysis completed."); 
       } 
      
      }
      else{ 
          $("#diskimg").removeClass().addClass("error_space");
          $("#spanresult").hide();
          $("#diskperofromanceReport").hide();
          $("#dvRecordCountsuccess").show();
         if(parseInt(filelistcount,10) > 0){
          $("dvshowresults").show();
          $("#dvshowwarning").show();
          $("#spnRecordCount").show().text("Problems Found : "+filelistcount);
          $("#spnRecordCountsuccess").show().text("Insufficient privileges to perform Disk Analysis."); 
         }
         else
         {
          $("#dvshowwarning").hide();
          $("#spnRecordCount").hide();
          $("#spnRecordCountsuccess").show().text("Insufficient privileges to perform Disk Analysis."); 
         }  
      }
    }
    else{
        $("#diskimg").removeClass().addClass("error_space");
        $("#spanresult").hide();
        $("#diskperofromanceReport").hide();
        $("#dvRecordCountsuccess").show();
        if(parseInt(filelistcount,10) > 0){
          $("#dvshowwarning").show();
          $("#spnRecordCount").show().text("Problems Found : "+filelistcount);
          $("#spnRecordCountsuccess").show().text("Disk Analysis cancelled by user."); 
         }
         else
         {
          $("dvshowwarning").hide();
          $("#spnRecordCount").hide();
          $("#spnRecordCountsuccess").show().text("Disk Analysis cancelled by user."); 
         }
        
    }
    $("#btnScanNow") .show();
    $("#btnScanNow").attr("disabled",false);
    $("#btnStopScan").hide();
    $("#chkJunkFiles").attr("disabled",false);
    $("#chkJunkInternetOptimizer").attr("disabled",false);
    $("#chkDiskPerformance").attr("disabled",false);
    
    $("#btnFixAll").attr("disabled",false);
    if (isJunk && (parseInt(filelistcount,10) > 0)) {
      $("#btnShowDetails").show();

      $("#btnFixAll").show();
    }else{
      $("#btnShowDetails").hide();
      $("#btnFixAll").hide();
    }
    
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('pcoptimizationController','diskPerformanceShow ',e,offlineGlobalData.Client);
  } 
}

function checkDiscPerformance()
{
  try
  {
    $("#diskimg").removeClass("tuner_space").addClass("rotating_space");
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('pcoptimizationController','checkDiscPerformance ',e,offlineGlobalData.Client);
  }
}

function changeInternetOptimizerCompleted(isJunk,isIntOpt,isDeleteSelectedFiles)
{
  try
  {
    if (isDeleteSelectedFiles==='True') {
    $("#dvpcOptimizatoinShowDetails").hide();
    $("#dvpcOptimizatoinScan").show();
  }
  $("#dvshowwarning").show();
  $("#spnRecordCount").show().text("Optimization Complete");
  $("#btnScanNow").attr('disabled',false);
  $("#btnScanNow") .show();
  $("#btnStopScan").hide();
  $("#btnFixAll").hide();
  $("#btnShowDetails").hide();
  if (isJunk==='True') {
      $("#junkimg").removeClass().addClass("clean_space");
  }
  if (isIntOpt === 'True') {
      $("#internetimg").removeClass().addClass("clean_space");
  }
  }
  catch(e){
    // stackTrace(e);
    stackTrace('pcoptimizationController','changeInternetOptimizerCompleted ',e,offlineGlobalData.Client);
  } 
}


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
angular.module( 'activei.registrycleaner', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'registrycleaner', {
    url: '/registrycleaner',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/registrycleaner/registrycleaner.tpl.html",
        controller:"registrycleanerController" 
    }
    },
    data:{ pageTitle: 'Registry Cleaner' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'registrycleanerController', function registrycleanerController( $scope ,$rootScope,$http,$state,ngDialog) {
  $("#dvregScanOptions").show();
  $("#btnViewDetails").hide();
  $("#btnFix").hide();
  $rootScope.isMiddleCont = true; 
  
  //show registry 
  $scope.showRegistryCleaner=function(){
    try
    {
      $scope.setValue();
      window.external.showRegistryCleaner();
    }
    catch(e)
    {
       // stackTrace(e);
       stackTrace('registrycleanerController','showRegistryCleaner ',e,offlineGlobalData.Client);    
     }
    
  };

  $scope.setValue=function()
  {
    try
    {
      $scope.ischkControlScan= false;
      $scope.ischkUserScan= false;
      $scope.ischkSysSoftwareScan= false;
      $scope.isSysFontScan= false;

      $scope.ischksysHelipFilesScan= false;
      $scope.ischkSharedLibScan= false;
      $scope.ischkStartUpScan= false;
      $scope.ischkInstallationstrScan= false;
      $scope.ischkVirtualDevScan= false;
      $scope.ischkHistoryScan= false;
      $scope.ischkDeepScan= false;
      $scope.ischkMRUlstScan= false;
      $scope.ischkSysRestoreScan=true;
    }
    catch(e)
    {
      // stackTrace(e);
        stackTrace('registrycleanerController','setValue ',e,offlineGlobalData.Client);
    }
      
  };

  //Start the registry scan
  $scope.startRegistryScanning=function(){
    try
    {
      if($('input[type=checkbox].chkregistryscan:checked').length === 0){
           var messageText=$rootScope.getglobalErrorMessage.SCANOPTIONMSG;
           var headerText=$rootScope.getglobalErrorMessage.HDRREGISTRY;
           var buttonText=$rootScope.getglobalErrorMessage.BTNOK; 
           showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,headerText,messageText,buttonText);        
      }
      else{
            $("#dvregScanOptions").hide();
            $("#dvregScanningFileDetails").show();
            $("#btnStartScan").hide();
            $("#btnStopScan").show();
            $("#btnFix").hide();
            window.external.startRegistryScan($scope.ischkControlScan,$scope.ischkUserScan,$scope.ischkSysSoftwareScan,$scope.isSysFontScan, 
            $scope.ischksysHelipFilesScan,$scope.ischkSharedLibScan,$scope.ischkStartUpScan,$scope.ischkInstallationstrScan, 
            $scope.ischkVirtualDevScan,$scope.ischkHistoryScan,$scope.ischkDeepScan,$scope.ischkMRUlstScan,$scope.ischkSysRestoreScan);

      } 
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('registrycleanerController','startRegistryScanning ',e,offlineGlobalData.Client);
    } 
  };

  //Stop the registry scan
  $scope.stopRegistryScan=function(){
    // $("#btnStopScan").hide();
    window.external.stopRegistryScan();

  };

  //View Scanned Registry Details
  $scope.viewRegistryFiles=function()
  {
    try
    {
      $("#dvregScanOptions").hide();
      $("#dvregScanningFileDetails").hide();
      $("#dvregScannnedDetails").show();
      $("#btnStartScan").hide();
      $("#btnViewDetails").hide();
      $("#btnFix").show();
        scannedfiles=window.external.viewScannedRegistryFiles(); 
        $scope.scannedRegistryFiles=JSON.parse(scannedfiles);
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('registrycleanerController','viewRegistryFiles ',e,offlineGlobalData.Client);
    } 
  };

  //Fix the registry 
  $scope.fixRegistryClean=function()
  {

     try
        {
         var jsonList = '[', jsonData = '';

       angular.forEach($scope.scannedRegistryFiles,function(values,index){
          if (values.Check) {
              jsonData += jsonData==='' ? '': ',';
          jsonData += '{"Check":"'+values.Check+'", "Root":'+JSON.stringify(values.Root)+',"Key":'+JSON.stringify(values.Key)+',"Name":'+JSON.stringify(values.Name)+',"Value":'+JSON.stringify(values.Value)+',"Data":'+JSON.stringify(values.Data)+',"ImagePath":'+JSON.stringify(values.ImagePath)+',"Id":'+values.Id+',"Scope":'+values.Scope+',"RootValue":'+values.RootValue+'}';
          }
        });
       jsonList += jsonData;
       jsonList +=']';
       window.external.fixRegistryClean((jsonList));
     }
     catch(e)
     {
      // stackTrace(e);
      stackTrace('registrycleanerController','fixRegistryClean ',e,offlineGlobalData.Client);
     }
      // window.external.fixRegistryClean();
  };

  //Restore the registry
  $scope.restoreRegistry=function(){
    try{        
        window.external.restoreRegistry();
     }
     catch(e){
      // stackTrace(e);
      stackTrace('registrycleanerController','restoreRegistry ',e,offlineGlobalData.Client);
     }
  };

  $scope.showScanCompletedmessage=function(){
    var messageText=$rootScope.getglobalErrorMessage.SCANCOMPLSUCCESS;
    var headerText=$rootScope.getglobalErrorMessage.HDRREGISTRY;
    var buttonText=$rootScope.getglobalErrorMessage.BTNOK;
    //Show the info message
    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,headerText,messageText,buttonText);
    
  };
       
});


function setScannedFileDetails(scanData)
{
  try
  {
    var ObjScan = JSON.parse(scanData);
    $("#scanName").text(ObjScan.scanName);
    $("#scanDescription").text(ObjScan.scanDescription);
    $("#matchCount").text(ObjScan.matchCount);
    $("#lastMatch").text(ObjScan.lastMatch);
    $("#scanHive").text(ObjScan.scanHive);
    $("#subKey").text(ObjScan.subKey);
    $("#keyCount").text(ObjScan.keyCount);
    $("#segmentsScanned").text(ObjScan.segmentsScanned);
    $("#segmentsRemaining").text(ObjScan.segmentsRemaining);
    $("#timeElapsed").text(ObjScan.timeElapsed);

}catch(e) {
   // stackTrace(e);
   stackTrace('registrycleanerController','setScannedFileDetails ',e,offlineGlobalData.Client);
}
}

function scanCompleted()
{
    try{
        $("#btnStopScan").hide();
        $("#btnViewDetails").show();    
        angular.element(document.getElementById("rightCont")).scope().showScanCompletedmessage();
        return;
    }
    catch(e){
      // stackTrace(e);
      stackTrace('registrycleanerController','scanCompleted ',e,offlineGlobalData.Client);
    }
}


 
    




angular.module( 'activei.scheduledactivities', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'scheduledactivities', {
    url: '/scheduledactivities',
  views:{
           "RightView":{
             templateUrl:"systemtools/scheduledactivities/scheduledactivities.tpl.html", 
        controller:"scheduledactivitiesController"
    
    }
    },
    data:{ pageTitle: 'Scheduled Activities' }
  });
})

.controller( 'scheduledactivitiesController', function scheduledactivitiesController( $scope ,$rootScope,$http,$state,ngDialog) {
 
  $rootScope.isMiddleCont = true; 
   
$scope.schedulerActivities = function () {  
    try
    {     
       var schdactivi="";
       var recurdays="";  
       var rdbdaily = $("input[name=rdodaily]:checked").val();   
       var date="";
       var time=""; 
       var dateArray="";var selectdate="";var todayDate="";var dd="";var mm="";var yyyy="";
       var hours="";var minutes="";var t1="";var t2="";var twhours="";var timeArray="";
       var times="";var utcCurrenddate="";
       var uctselectedDate="";
       var minusmilisec ="";
       var sec="";
       var min=""; 
       var wdays ="";
       var mdays ="";
       var checkedweekValues="";
       var checkedmonthValues="";
       var selectmnth="";

       if(rdbdaily == "daily") { 
          recurdays=$("#txtdays").val(); 
          date = $("#txtDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtdays").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#txtdays").val() === '0') || ($("#txtdays").val() === '00') || ($("#txtdays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if((parseInt($("#txtdays").val(),10) > 365)) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'The Recovery Days should not be greater than 365 Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else { 
            date=$("#txtDate").val(); 
            time=$scope.frmData.txtTime;  
            dateArray = date.split(' ');
            selectdate = dateArray[0].split('/'); 
            //Split the Current date
            todayDate = new Date();
            dd = todayDate.getDate(); 
            dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
            mm = todayDate.getMonth() + 1; //January is 0!
            mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
            yyyy = todayDate.getFullYear();
            hours = todayDate.getHours();
            minutes = todayDate.getMinutes(); 
            //change the dateformat 
             t1 = yyyy +''+ mm +''+ dd ;
             t2 = selectdate[2]  + selectdate[0]  + selectdate[1]; 
              //Convert 24 hours format
             twhours = formatConversion(time);

            //Split the time
             timeArray = twhours.split(' ');
             times = timeArray[0].split(':');  
            //Compare the current date and selected date 
            if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60; 
                if (min <= 30) {
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEACTIVITYTIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            }
          }
       }

       else if(rdbdaily == "weekly") {
           recurdays=$("#txtweekdays").val(); 
          date = $("#txtweekDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtweekTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($('input[name=weekdays]:checked').length === 0){ 
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Select the Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtweekdays").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#txtweekdays").val() === '0') || ($("#txtweekdays").val() === '00') || ($("#txtweekdays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }
          else if(parseInt(recurdays,10) > 52)
          {
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter Week between 1 to 52 ',$rootScope.getglobalErrorMessage.BTNOK);           
              return false;
          }
          else { 
              date=$("#txtweekDate").val(); 
              time=$scope.frmData.txtweekTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes();  
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];  
                //Convert 24 hours format
                 twhours = formatConversion(time); 
                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);                 
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       }
       else if(rdbdaily == "monthly") {
           recurdays=$("#txtmonthlydays").val(); 
          date = $("#txtmonthlyDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtmonthlyTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($('input[name=monthlydays]:checked').length === 0){ 
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Select the Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#monthlydays").val() === '0') || ($("#monthlydays").val() === '00') || ($("#monthlydays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }  
          else { 
            recurdays=0; 
              date=$("#txtmonthlyDate").val(); 
              time=$scope.frmData.txtmonthlyTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes(); 
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];    
                //Convert 24 hours format
                 twhours = formatConversion(time); 
                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) { 
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       }
       else if(rdbdaily == "onetime") {
           recurdays=0; 
          date = $("#txtonetimeDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtoneTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false; 
          }
          else { 
              date=$("#txtonetimeDate").val(); 
              time=$scope.frmData.txtoneTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes();  
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];
                //Convert 24 hours format
                 twhours = formatConversion(time);

                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       } 
       
        checkedweekValues = $('input[name=weekdays]:checked').map(function() {
            return this.value;
        }).get();
         checkedmonthValues = $('input[name=monthlydays]:checked').map(function() {
            return this.value;
        }).get();  
         
        wdays = checkedweekValues.join(); 
        mdays = checkedmonthValues.join();  
        try{ 
        //$scope.loaderdisplay = true;     
         schdactivi = window.external.createScheduleactivities(rdbdaily,parseInt(recurdays,10),date,time,wdays,mdays);               
        // $scope.loaderdisplay = false;
         //schdactivi = window.external.createScheduleactivities('monthly',3,'02/25/2015','11:30 PM','',01);               
        }
        catch(e){
          // stackTrace(e);
          stackTrace('scheduledactivitiesController','schedulerActivities ',e,offlineGlobalData.Client);
        } 
      
       if (schdactivi !== "Failed" && schdactivi !== null)
       {
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.SUCCESSSCHEDULEDACTIVITIESSAVE,$rootScope.getglobalErrorMessage.BTNOK);
       }
    //}
       
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('scheduledactivitiesController','schedulerActivities ',e,offlineGlobalData.Client);
    }
  };

  $scope.dateTimeControls=function()
{
    try{
    var d = new Date();
    var currDate = d.getDate();
    var currMonth = d.getMonth() + 1;
    var currYear = d.getFullYear(); 
    currDate=(parseInt(currDate,10) < 10)?'0'+currDate:currDate;
    currMonth=(parseInt(currMonth,10) < 10) ?'0'+currMonth:currMonth;
    var dateStr = currMonth + "/" + currDate + "/" + currYear;
    $('#txtDate').val(dateStr);
    $('#txtDate').datepicker({ format: "mm/dd/yyyy" }); 
    $('#txtweekDate').val(dateStr);
    $('#txtweekDate').datepicker({ format: "mm/dd/yyyy" }); 
    $('#txtmonthlyDate').val(dateStr);
    $('#txtmonthlyDate').datepicker({ format: "mm/dd/yyyy" });
    $('#txtonetimeDate').val(dateStr);
    $('#txtonetimeDate').datepicker({ format: "mm/dd/yyyy" });
    //To show the time 30 minutes ahead
    var thirtyMinutesLater = new Date(d.getTime() + (31 * 60 * 1000));
    
    $(".txttimepicker").timepicker({
                defaultTime: thirtyMinutesLater,
                minuteStep: 1,
                showInputs: false,
                disableFocus: true
    });  
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('scheduledactivitiesController','dateTimeControls ',e,offlineGlobalData.Client);
    } 
};

});
 
function rdbChangeEvent(){ 
var rdoid=$("input[name=rdodaily]:checked").val(); 

 var d = new Date();
    var rdbcurrDate = d.getDate();
    var rdbcurrMonth = d.getMonth() + 1;
    var rdbcurrYear = d.getFullYear(); 
    rdbcurrDate=(parseInt(rdbcurrDate,10) < 10)?'0'+rdbcurrDate:rdbcurrDate;
    rdbcurrMonth=(parseInt(rdbcurrMonth,10) < 10) ?'0'+rdbcurrMonth:rdbcurrMonth;
    var rdbdateStr = rdbcurrMonth + "/" + rdbcurrDate + "/" + rdbcurrYear;

    $('#txtDate').val(rdbdateStr);
    $('#txtweekDate').val(rdbdateStr);
    $('#txtmonthlyDate').val(rdbdateStr);
    $('#txtonetimeDate').val(rdbdateStr);

    $('#txtTime').val('');
    $('#txtweekTime').val('');
    $('#txtmonthlyTime').val('');
    $('#txtoneTime').val('');

    $('#txtdays').val('');
    $('#txtmonthlydays').val('');
    $('#txtweekdays').val(''); 

    $('input:checkbox[name=weekdays]').attr('checked',false);
    $('input:checkbox[name=monthlydays]').attr('checked',false); 

    $(".dvscheduler").hide(); 
    $("#" + rdoid).show(); 
}

//functionality to format the time
 function formatConversion(time) {
    try{
         
        //var time = $scope.scheduleTime;
        var hrs = Number(time.match(/^(\d+)/)[1]);
        var mnts = Number(time.match(/:(\d+)/)[1]);
        var format = time.match(/\s(.*)$/)[1];
        if (format === "PM" && hrs < 12)
        {hrs = hrs + 12;} 
        if (format === "AM" && hrs == 12)
        {hrs = hrs - 12;} 
        var hours = hrs.toString();
        var minutes = mnts.toString();
        if (hrs < 10) {
          hours = "0" + hours;
        }
        if (mnts < 10) {
          minute1 = "0" + minutes;
        }
        return hours + ":" + minutes; 
    }
    catch(e)
    {
    // stackTrace(e);
    stackTrace('scheduledactivitiesController','formatConversion ',e,offlineGlobalData.Client);
    }  
}


 
    



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
angular.module( 'activei.systemtools', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'systemtools', {
    url: '/systemtools',
	views:{
           "RightView":{
        template:"",
        controller:"systemtoolsRightController"
		
		}
    },
    data:{ pageTitle: 'System Tools' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'systemtoolsRightController', function systemtoolsRightController( $scope ,$rootScope,$http,$state) {
  $rootScope.isMiddleCont = true;
  // $rootScope.polyInit();
  $('#background_logo').removeClass().addClass('cont_bg_logo');
   // $rootScope.showSystemToolsMenuDescription = function (hoveredMenu, isHover) {
   //      switch (hoveredMenu) {            
   //           case 'PCOptimizationSuite':
   //           alert(isHover);
   //              $rootScope.ispcoptimizationsuiteMenuDescription = isHover;
   //              break;    
   //          default: break;

   //      }
   //  };

  });
    



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
angular.module('activei.channelinterface', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('channelinterface', {
        url: '/channelinterface',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/channelinterface/channelinterface.tpl.html",
                controller: "channelinterfaceController"
            }
        },
        data: { pageTitle: 'Channel Interface' }
    });
})
/**
* And of course we define a controller for our route.
*/

.controller('channelinterfaceController', function channelinterfaceController($scope, $rootScope, $http, $state, $cookieStore, $filter) {
    $rootScope.isMiddleCont = true;
    $scope.loadWifiChannelDetails = function () {
        try{
        var results = "false";
        window.external.wifi_dBm();
        results = window.external.getCurrentWifiChannels();
        if (results === "false") {
            $("#wifiChannel").append("No Wi-Fi access points found.");
        }
        else {
            $("#wifiChannel").append(results);
            $("#wifiChannelTbl").slimScroll({
                wheelStep: 1,
                width: "100%",
                height: "23vw",
                display: "none"
            });
        }
        } catch (e) {
        // stackTrace(e);
        stackTrace('channelinterfaceController','loadWifiChannelDetails ',e,offlineGlobalData.Client);
    }
    };
}); 
    
 
 
    



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
angular.module('activei.dbmgraph', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('dbmgraph', {
        url: '/dbmgraph',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/dbmgraph/dbmgraph.tpl.html",
                controller: "dbmgraphController"
            }
        },
        data: { pageTitle: 'dBm Graph' }
    });
})
/**
 * And of course we define a controller for our route.
 */
.controller('dbmgraphController', function dbmgraphController($scope, $rootScope, $http, $state, $cookieStore, $interval) {
    $rootScope.isMiddleCont = true;

    $scope.initializeGuage = function () {
      try{
        window.external.wifi_dBm();
        createGauges();
        //setInterval(updateGauges, 200);
        } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','initializeGuage ',e,offlineGlobalData.Client);
    }

    };
    
});

function updateLables() {
  try{
    wifiname=window.external.getWifiname();
    sigquality = window.external.getsigquality();
    if(wifiname === ""){
      document.getElementById("dbmdisplay").style.display="none";
      document.getElementById("dbmhide").style.display="block";
    }
    else
    {
       document.getElementById("dbmdisplay").style.display="block";
       document.getElementById("dbmhide").style.display="none";
       $("#wifiname").text(wifiname);
     $("#signalquality").text(sigquality);  
    }
    
     } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','updateLables ',e,offlineGlobalData.Client);
    }
     
}   
 var gauges = [];
      
function createGauge(name, label, min, max)
{
  try{
  var config = 
  {
    size: 200,
    label: label,
    min: undefined !== min ? min : -100,
    max: undefined !== max ? max : 0,
    minorTicks: 5
  };
  
  var range = config.max - config.min;
  config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
  config.redZones = [{ from: config.min + range*0.9, to: config.max }];
  
  gauges[name] = new Gauge(name + "GaugeContainer", config);
  gauges[name].render();
  } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','createGauge ',e,offlineGlobalData.Client);
    }
}

function createGauges()
{
  createGauge("network", "");
  /*createGauge("cpu", "CPU");
  createGauge("network", "Network");*/
  //createGauge("test", "Test", -100, 0 );
}
      
function updateGauges(datavalue)
{
  for (var key in gauges)
  {
   // var value = getRandomValue(gauges[key]);
    var value=datavalue;
    gauges[key].redraw(value);
  }
}

function getRandomValue(gauge)
{
  var overflow = 0;
  return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
}
 
 
    



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
angular.module( 'activei.networkdetails', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'networkdetails', {
    url: '/networkdetails',
  views:{
       "RightView":{
        templateUrl:"systemtools/wifitools/networkdetails/networkdetails.tpl.html",
        controller:"networkdetailsController" 
    }
    },
    data:{ pageTitle: 'Network Details' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'networkdetailsController', function networkdetailsController( $scope ,$rootScope,$http,$state,$cookieStore,$filter){
  $rootScope.isMiddleCont = true;
  $scope.wifidetailsLoad = function () {
    try{
      window.external.wifi_dBm();
      responseHtml = window.external.getWiFiDetails();

    if (responseHtml === "false") {
        $("#wifidetails").append("No Wi-Fi access points found.");
    }
    else {
        $("#wifidetails").append(responseHtml);
        $("#wifidetails").slimScroll({
            wheelStep: 1,
            width: "100%",
            height: "30vw",
            display: "none"
        });
    }
    } catch (e) {
      // stackTrace(e);
      stackTrace('networkdetailsController','wifidetailsLoad ',e,offlineGlobalData.Client);
    }
  };
 }); 
    
 
 
    



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
angular.module('activei.signalstrength', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('signalstrength', {
        url: '/signalstrength',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/signalstrength/signalstrength.tpl.html",
                controller: "signalstrengthController"
            }
        },
        data: { pageTitle: 'Signal Strength' }
    });
})
/**
 
 * And of course we define a controller for our route.
 */


.controller('signalstrengthController', function signalstrengthController($scope, $rootScope, $http, $state, $cookieStore) {
    $rootScope.isMiddleCont = true;
    $scope.drawChart = function () {
        try{
        window.external.wifi_dBm();
        var isconnected = "false";
        isconnected = window.external.getWiFiGraph();
        if (isconnected === "false") {
           document.getElementById('wifidiv').style.display = "none";
            $("#wifiAnalytics").append("No Wi-Fi access points found.");
        }
        else {
            document.getElementById('wifidiv').style.display = "block";
            var jsonResult = parseJSON(isconnected);
            jsonResult = JSON.parse(jsonResult);
            renderLiveGraph(jsonResult);
        }
        } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','drawChart ',e,offlineGlobalData.Client);
    }
    };
}); 

function parseJSON(results) {   
    try{
    var jsonString = results.split(',');
    var jsonResult = '[';
    for (var i = 0; i <= jsonString.length; i++) {
        if (jsonString[i] !== "" && jsonString[i] !== undefined && jsonString[i + 1] !== "" && jsonString[i + 1] !== undefined) {
            jsonResult += '{"_id":"' + jsonString[i] + '",' + '"dBm":' + jsonString[i + 1] + '},';
            i = i + 1;
        }
    }
    var jsonval = jsonResult.slice(0, jsonResult.lastIndexOf(","));
    jsonResult = jsonval + ']';    
    return jsonResult;
    } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','parseJSON ',e,offlineGlobalData.Client);
    }
}

function renderLiveGraph(jsonData) {
    try{
    var divId = "#wifiAnalytics";
    VIZ.stackBarChart(divId, $.extend(true, [], jsonData));
    $(".rdowifi").click(function () {
        if (this.id == 'sbar') {
            VIZ.stackBarChart(divId, $.extend(true, [], jsonData));
            VIZ.onResize();
        } else if (this.id == 'line') {
            VIZ.lineChart(divId, jsonData);
            VIZ.onResize();
        } else if (this.id == 'area') {
            VIZ.stackChart(divId, jsonData, 'zero');
            VIZ.onResize();
        } else {
            VIZ.stackChart(divId, jsonData, 'wiggle');
            VIZ.onResize();
        }
    });

    VIZ.onResize();
    $(window).on("resize", function () {
      //  VIZ.onResize();
    });
    } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','renderLiveGraph ',e,offlineGlobalData.Client);
    }
}

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
angular.module( 'activei.wifitools', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'wifitools', {
    url: '/wifitools',
	views:{
           "RightView":{
        template:"",
        controller:"wifitoolsRightController"
		
		}
    },
    data:{ pageTitle: 'Wi-Fi Tools' }
  });
})
/**
 * And of course we define a controller for our route.
 */

.controller( 'wifitoolsRightController', function wifitoolsRightController( $scope ,$rootScope,$http,$state) {
  $rootScope.isMiddleCont = true;
   // $rootScope.polyInit();
  });
    



angular.module("globalData", [])
.controller("StaticResourceData", ['$scope','$http', function($scope, $http)
		{    
			$http.get('assets/StaticResources/data.txt').then(function(response){
			//alert('StaticResourceData read');
				$scope.getglobaldata = response.data;
				
		});
	//alert('StaticResourceData end');
		}]
);

function GetKeyValue($scope, $http) {
    var path = "assets/StaticResource/data.txt";
    $http.get(path).then(function (response) {
        //        $scope.$apply(function () {
		//alert(response);
        $scope.getglobaldata = response.data;
        //        });

    });
}

function chkalphaNumeric(e) {
        var regex = new RegExp("^[a-zA-Z0-9!@$',:;?/%*#.&]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        } 
        return false;
    }

function removeextra() {
    var initVal = $('#txt_Problem').val();
    outputVal = initVal.replace(/[^0-9a-zA-Z]/g,"");       
    if (initVal != outputVal) {
        $(this).val(outputVal);
    }
}

//functionality used to allow only numeric values
function isNumber(evt) {  
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//functionality used to allow only Alphabet values
function ValidateAlpha(evt)
    {
        var keyCode = (evt.which) ? evt.which : evt.keyCode;
        if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32){         
        return false;
        }
        return true;
    } 

//
function csscorpRedirect()
{
    window.external.csscorpRedirection();
}
//functionality used to load dynamic left and right content
function loadPageContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID)
{
    contentHide();  
    hideSystemToolsDescription();
   if (stateName!== '') {     
        $state.go(stateName);   
        showleftrightContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID);
     }

}

//hide left and right menu and unbind the event
function contentHide()
{

    //hide left content 
    //if left side menu increased then we need to increase the count of variable "i"
    for (var i = 1; i <= 7; i++) {

       $("#div"+i).hide();
       $("#div"+i).unbind("click");
       $("#spn"+i).unbind("click");
       
    }

    //hide right content 
    //if right side menu increased then we need to increase the count of variable "j"
    for (var j = 1; j <= 12; j++) {
       
       $("#divright"+j).hide();
       $("#divright"+j).unbind("click");
       $("#spnright"+j).unbind("click");
       $("#divright"+j).unbind("mouseenter");
       $("#divright"+j).unbind("mouseleave");
    }

}

//functionality to dynamically load left and right content based on JSON data
//back button functionality has been implemented
function showleftrightContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID)
{

    try{
    //for each for load left content
     angular.forEach(jsondata,function(values,keys){

       if (parseInt(values.parent_id,10) === parseInt(parentid,10)) {

            $("#dvleftcontent").show();
			$("#dvleftcontent").removeClass();
			$("#dvleftcontent").addClass('slide');

            

            // $("#div"+values.leftPositionID).removeClass('poly_active').addClass('polygon');

            $("#div"+values.leftPositionID).removeClass('leftpoly_active').addClass('leftpolygon');

            if (parseInt(clickedID,10)=== parseInt(values.id,10)) {
                // $("#div"+values.leftPositionID).removeClass('polygon').addClass('poly_active');
                $("#div"+values.leftPositionID).removeClass('leftpolygon').addClass('leftpoly_active');
                //bind event to back button 
                $("#dvgoback").unbind("click");
                $("#dvgoback").on('click', function(){
                    if ($rootScope.isAntivirusScanned) {
                        $rootScope.isAntivirusScanned=false;
                        window.external.resetAntivirus();    
                    }
                    if ($rootScope.isNetworkSpeed) {
                        $rootScope.isNetworkSpeed=false;
                        window.external.resetNetworkSpeed();    
                    } 
                    $rootScope.homeClicked=true;
                    if (parseInt(parentid,10)=== 0 && !$rootScope.isnewpage) {
                        $state.go('home');
                    }
                    else if ($rootScope.isnewpage) {
                        $rootScope.isnewpage=false;
                        if (values.statename === 'messagecenter' || values.statename === 'knowledgebase') {
                            $state.reload();
                        }
                        else{
                            $state.go(values.statename);
                        }
                    }
                    else{

                        backButton(values.parent_id,values.id,$state,$rootScope,$cookieStore);
                    }
                    
                });
            }



            //used to load the current page when no session key available in remote support
            if (parseInt(parentid,10)=== 1 && stateName!=='remotesupport') {
                $rootScope.homeClicked=false;
                  localStorage.setItem('clickedID',clickedID);
                 localStorage.setItem('stateName',stateName);
            }

            //based the clicked menu we need to bind the click event dynamically
            if (stateName !== values.statename) {
                 
                //bind the click event for dynamic left menu
                if((values.hasOwnProperty("active") && values.active==='Y') || (!values.hasOwnProperty("active")))  {
                     $("#div"+values.leftPositionID).show(); 
                    $("#spnimg"+values.leftPositionID).removeClass().addClass(values.classname);
                    $("#spn"+values.leftPositionID).text(values.name);
                    $("#div"+values.leftPositionID).on('click', function(){
                        if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                           $rootScope.offlineerrorUpgrade();
                        }
                        
                        else{
                            //
                            if ((parseInt($rootScope.userDetails.ContractAvailability,10) ===0) && ((parseInt(values.id,10) === 1 || parseInt(values.id,10) === 3))) {
                                $rootScope.inActiveUserErrorMessage();  
                            }
                            else
                            {
                                $rootScope.leftclicked=true;
                            loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                            }
                            
                        }

                    });

                    $("#spn"+values.leftPositionID).on('click', function(){
                    //     $rootScope.leftclicked=true;
                    // loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                         if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                           $rootScope.offlineerrorUpgrade();
                        }
                        else{
                             if ((parseInt($rootScope.userDetails.ContractAvailability,10) ===0) && ((parseInt(values.id,10) === 1 || parseInt(values.id,10) === 3))) {
                                $rootScope.inActiveUserErrorMessage();  
                            }
                            else
                            {
                                $rootScope.leftclicked=true;
                            loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                            }
                            
                        }
                    });
                }
            }
            else
            {
                $("#div"+values.leftPositionID).show(); 
                    $("#spnimg"+values.leftPositionID).removeClass().addClass(values.classname);
                    $("#spn"+values.leftPositionID).text(values.name);
                //unbind the click event of the selected menu
                $("#div"+values.leftPositionID).unbind("click");
                 $("#spn"+values.leftPositionID).unbind("click");
            }

            //check and load right content of the selected menu
            if (parseInt(clickedID,10)=== parseInt(values.id,10)) {
                //for each for load right content
                angular.forEach(jsondata[keys].submenu,function(values,index){

                    $("#rightCont").hide();
                    
                    
                    //add mouseenter and mouseleave event when hover on system tools menu
                    if (parseInt(clickedID,10) === 3) {
                        showsystemToolsDescription(values.statename,values.rightPositionID);
                    }

                    if (values.statename === "remotesupport") {
                        $("#divright"+values.rightPositionID).show();
                        $("#spnright"+values.rightPositionID).text(values.name);
                        $("#spnrgtimg"+values.rightPositionID).removeClass().addClass(values.classname);
                         $("#divright"+values.rightPositionID).on('click', function(){
                            $rootScope.leftclicked=false;
                            $state.go(values.statename);
                        });
                    }
                    else
                    {
                        //bind the click event for dynamic right menu
                            if((values.hasOwnProperty("active") && values.active==='Y') || (!values.hasOwnProperty("active")))  {
                                $("#divright"+values.rightPositionID).show();
                                $("#spnright"+values.rightPositionID).text(values.name);
                                $("#spnrgtimg"+values.rightPositionID).removeClass().addClass(values.classname);
                                 $("#divright"+values.rightPositionID).on('click', function(){
                                     if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                                       $rootScope.offlineerrorUpgrade();
                                    }
                                    
                                    else{
                                        $rootScope.leftclicked=false; 
                                        $rootScope.kbFlag = null;
                                     // if (parseInt(clickedID,10) !== 3) {
                                        loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                    }
                                     // }

                                });
                                 $("#spnright"+values.rightPositionID).on('click', function(){
                                    if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                                       $rootScope.offlineerrorUpgrade();
                                    }
                                    
                                    else{
                                        $rootScope.leftclicked=false;
                                        $rootScope.kbFlag = null;
                                       // loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                        // if (parseInt(clickedID,10) !== 3) {
                                            loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                         // }
                                     }

                                });
                            }
                    }

                }); //right foreach end

				$("#dvrightcontent").show();
				$("#dvrightcontent").addClass('slide');

            } //right if end
                          
             
        }  //if end
    });  //foreach end
} catch (e) {
        // stackTrace(e);
        stackTrace('CommonUtil','showleftrightContent ',e,offlineGlobalData.Client);
    }

}

//bind event to back button 
function backButton(parentID,ClickedID,$state,$rootScope,$cookieStore)
{
    try{
         var isBackMenu=false;         
        angular.forEach($rootScope.getglobalmenudata,function(values,keys){
            if (!isBackMenu) {
                if (parseInt(values.id,10)=== parseInt(parentID,10)) {
                isBackMenu=true;
                loadPageContent($rootScope.getglobalmenudata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                return;
            }
            else{
                angular.forEach($rootScope.getglobalmenudata[keys].submenu,function(submenuvalue,index){
                        
                        if (parseInt(submenuvalue.id,10)=== parseInt(parentID,10)) {
                            isBackMenu=true;
                            loadPageContent($rootScope.getglobalmenudata[keys].submenu,$state,$rootScope,$cookieStore,submenuvalue.parent_id,submenuvalue.id,submenuvalue.statename,submenuvalue.id);
                            return;
                        }
                });
            }
           }
            
        });

    } catch (e) {
        // stackTrace(e);
        stackTrace('CommonUtil','backButton ',e,offlineGlobalData.Client);
    }

}

//functionality used to show and hide system tools menu descriptions
function showsystemToolsDescription(statename,rightPositionID)
{
    switch (statename) {
            case 'pcoptimizationsuite':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvOptimizationsuite").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvOptimizationsuite").hide();
                        });

                break;     
                 case 'routerconfig':

                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvrouterConfig").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvrouterConfig").hide();
                        });

                break;   
                 case 'networktools':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvNetworkTools").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvNetworkTools").hide();
                        });

                break;   
                 case 'wifitools':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvwifiTools").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvwifiTools").hide();
                        });

                break;   
                 case 'scheduledactivities':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvScheduleActivities").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvScheduleActivities").hide();
                        });

                break;                     
            default: break;

        }
}

function hideSystemToolsDescription()
{
    $("#dvOptimizationsuite").hide();
    $("#dvrouterConfig").hide();
    $("#dvNetworkTools").hide();
    $("#dvwifiTools").hide();
    $("#dvScheduleActivities").hide();
}

//common functionality to show warning and Information dialog boxes 
function showMessage($scope,ngDialog,templateName,headerText,messageText,buttonText){

    $scope.infomsgDescription=messageText;
    $scope.headerText=headerText;
    $scope.okButton=buttonText;
    if (templateName==='Warning') {

        $scope.dialogclass="icon-invalid invalid";
    }
    else if (templateName==='Information') {
        
        $scope.dialogclass="icon-info invalid";

    }
    
    ngDialog.open({     template: 'infoDialog',
                            plain: false,
                             scope: $scope
                        }); 
}

function stackTrace(controllerName,methodName,ex,clientName)
{
    // alert(controllerName);
    // alert(methodName);
    // alert($rootScope.getglobaldata.Client);
    window.external.writeClientSideError(controllerName,methodName,JSON.stringify(ex.stack),clientName);
    // throw ex;
   // alert(ex);
}
function drawszlider(totalval, loadingval){
    // alert('documentrawszlider');
    var percentcompleted=Math.round((loadingval*100)/totalval);
    document.getElementById("szliderbar").style.width=percentcompleted+'%';
    document.getElementById("szazalek").innerHTML=percentcompleted+'%';
    
}

function showLoader()
{
    $.loader({
              className:"blue-with-image-2",
              content:''
          });
}



function messageCount($rootScope)
{
	var param='';
	if ($rootScope.getglobaldata.Client === 'GearHead') {
            param = { "customerId": localStorage.getItem('StoredCustomerID') };
         }
         else{
           param= { "customerID": localStorage.getItem('StoredCustomerID') };
         }
         return param;
}

function customerProductInfo($rootScope)
{
	var param='';
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             param = { "customerId": parseInt(localStorage.getItem('StoredCustomerID'),10) };
     }
     else{
       param = '{ "customerID":' + parseInt(localStorage.getItem('StoredCustomerID'),10) + ',"email": "","address": ""}';
     }
    return param;
}

function createScheduleCase($scope,$rootScope,scheduleCall)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CreateCase";
	}
	else{
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "ScheduleaCall";
	} 
     
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             param ='{ "customerId":0, "registrationId": 0, "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + encodeURIComponent($scope.scheduleProblemTitle) + '", "caseCauses": "", "caseNotes": "' + encodeURIComponent($scope.scheduleProblemDescription) + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
     }
     else{
       param ='{ "customerId":'+ parseInt(localStorage.getItem('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + encodeURIComponent($scope.scheduleProblemTitle) + '", "caseCauses": "", "caseNotes": "' + encodeURIComponent($scope.scheduleProblemDescription) + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
     }
  
    //return serviceData;
    return {"param":param,"servicePath":servicePath};
}

function createNewWebTicket($scope,$rootScope,txtSummary,txtProblem)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
             params = '{ "customerId":0, "registrationId": 0, "serialNumber": "' + $scope.selectedproductdet.SerialNo +
                        '", "caseSummary": "' + txtSummary + '","caseProblem": "", "caseCauses": "", "caseNotes": "' + txtProblem +
                        '", "caseSource":"Online", "caseAssingTo":"", "caseQueueId":63}';
     }
     else{
       params = '{ "customerId":"' + parseInt(localStorage.getItem('StoredCustomerID'),10) + '", "registrationId": "0", "serialNumber": "' + $scope.selectedproductdet.SerialNo +
                        '", "caseSummary": "' + txtSummary + '","caseProblem": "", "caseCauses": "", "caseNotes": "' + txtProblem +
                        '", "caseSource":"Online", "caseAssingTo":"css@cssconnect.com", "caseQueueId":63}';
     }
  
    return params;
}

function customerGetProduct($scope,$rootScope,customerId,customerEmail)
{

	if ($rootScope.getglobaldata.Client === 'GearHead') {
         param = '{ "customerId":' + customerId + ', "customerEmail":"' + customerEmail + '", "customerPhoneNo":"", "customerIsoCountry":"", "customerExactPhone":0}';
     }
     else{
       param = '{ "customerId":'+ customerId +', "email": "'+customerEmail+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
     }
    return param;
}

function customerrenewProductDetails($scope,$rootScope,customerId,contractId)
{
	if ($rootScope.getglobaldata.Client === 'GearHead') {
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetContractsByContractId";
	}
	else{
		servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetRenewProduct";
	}

if ($rootScope.getglobaldata.Client === 'GearHead') {
     param = '{ "customerId" : ' + customerId + ', "contractId" : ' + contractId + '}';
 }
 else{
   param = '{ "customerId":'+ customerId +', "email": "'+localStorage.getItem("CustomerEmail")+'", "phoneNo" : "", "isoCountry" : "", "companyName" : "", "exactPhone": 0}'; //Data to server 
 }
	return {"param":param,"servicePath":servicePath};
}
angular.module( 'plusOne', [] )

.directive( 'plusOne', function() {
  return {
    link: function( scope, element, attrs ) {
      gapi.plusone.render( element[0], {
        "size": "medium",
        "href": "http://bit.ly/ngBoilerplate"
      });
    }
  };
})

;



