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
 
    


