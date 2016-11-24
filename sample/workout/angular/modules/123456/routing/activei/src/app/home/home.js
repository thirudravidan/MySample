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
  //Router Auto Heal
  if ($rootScope.getglobaldata.Client === 'Activei') {
     // window.external.createEmailTicket();
     // window.external.createWLANEmailTicket();
     window.external.checkWIFI();
  }

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
  $rootScope.isShoeMenuDesc = ($rootScope.getglobaldata.Client === 'GearHead') ? false : true;
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


$rootScope.redirectToContactSupport=function(){
    loadPageContent($rootScope.getglobalmenudata,$state,$rootScope,$cookieStore,0,0,'contactsupport',1);
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

function contactSupportAssistance() {
  try
  {    
    angular.element(document.getElementById("mainCont")).scope().redirectToContactSupport();
  }
  catch(e)
  {
    stackTrace('AppCtrl','contactSupportAssistance',e,$rootScope.getglobaldata.Client);
  }
}