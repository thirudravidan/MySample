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