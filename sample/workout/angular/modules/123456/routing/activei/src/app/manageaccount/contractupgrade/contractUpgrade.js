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

 
 

