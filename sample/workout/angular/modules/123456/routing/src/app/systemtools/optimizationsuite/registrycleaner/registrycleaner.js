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


 
    


