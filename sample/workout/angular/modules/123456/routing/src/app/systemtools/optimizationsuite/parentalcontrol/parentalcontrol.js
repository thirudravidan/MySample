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
 
    


