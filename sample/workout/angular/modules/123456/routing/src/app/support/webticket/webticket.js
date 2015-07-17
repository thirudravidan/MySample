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

