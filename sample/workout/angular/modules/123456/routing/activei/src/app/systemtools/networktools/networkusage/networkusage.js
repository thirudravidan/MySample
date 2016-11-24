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
    


