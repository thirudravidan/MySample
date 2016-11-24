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

