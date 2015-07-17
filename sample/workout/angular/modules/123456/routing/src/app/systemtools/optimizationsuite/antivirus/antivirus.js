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

