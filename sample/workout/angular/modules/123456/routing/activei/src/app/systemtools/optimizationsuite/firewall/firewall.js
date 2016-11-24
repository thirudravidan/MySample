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
angular.module( 'activei.firewall', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'firewall', {
    url: '/firewall',
  views:{
       "RightView":{
        templateUrl:"systemtools/optimizationsuite/firewall/firewall.tpl.html",
        controller:"firewallController" 
    }
    },
    data:{ pageTitle: 'Firewall' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'firewallController', function firewallController( $scope ,$rootScope,$http,$state,ngDialog) {

$scope.openBrowse = function()
{
  try
  {
    $scope.filepath=window.external.openBrowseDialog();
  } 
  catch(e)
  {
    // stackTrace(e);
    stackTrace('firewallController','openBrowse ',e,$rootScope.getglobaldata.Client);
  } 
};
 
  $rootScope.isMiddleCont = true; 
       $("#dv2").hide();
       $("#dv3").hide(); 
       $("#dv4").hide();
       $("#dv5").hide();
       $("#dv6").hide(); 
       $("#btncancel").hide();

  $scope.redirecttoProgrampath = function (type) { 
    try
    { 
       switch(type) {
      case 'dv1':
          $("#dv1").show();
          if($("input[name=rdbappPort]:checked").val()==='application'){
            $("#dv2").hide();
          }
          else{
            $("#dv6").hide();
          }
          $("#dv3").hide(); 
          $("#dv4").hide(); 
          $("#dv5").hide();
          break; 
        case 'dv2': 
          $("#dv1").hide();
          if($("input[name=rdbappPort]:checked").val() === 'application'){
            $("#dv2").show();
            $("#dv6").hide();
          }
          else{
            $("#dv6").show();
            $("#dv2").hide();
          }
          $("#dv3").hide(); 
          $("#dv4").hide();
          $("#dv5").hide();
          break;
        case 'dv3': 
          if($("input[name=rdbappPort]:checked").val() === 'application'){
            if($scope.filepath === null || $scope.filepath === undefined){
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORAPPPATH,$rootScope.getglobalErrorMessage.BTNOK);
              break;
            }
             $("#dv2").hide();
          }
          else{
              if($scope.portnumbers === null || $scope.portnumbers === undefined ||  $.trim($scope.portnumbers) === "")
              {
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORPORTNO,$rootScope.getglobalErrorMessage.BTNOK);
                break;
              }
              else
              {
                var validPort=window.external.portValidation($scope.portnumbers);
                if(validPort === false)
                {
                  showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORINVALIDPORTNO,$rootScope.getglobalErrorMessage.BTNOK);
                  break;
                }
              }
              $("#dv6").hide();
          }
          $("#dv1").hide();
          $("#dv3").show();
          $("#dv4").hide(); 
          $("#dv5").hide(); 
          break;
        case 'dv4':
          $("#dv1").hide();
          $("#dv2").hide();
          $("#dv3").hide(); 
          $("#dv4").show(); 
          $("#dv5").hide();
          break;
        case 'dv5':
       

        var chkDomain=$('#chkDomain').is(':checked');
        var chkPrivate=$('#chkPrivate').is(':checked');
        var chkPublic=$('#chkPublic').is(':checked');

           if(chkDomain !== true && chkPrivate !== true && chkPublic !== true)
              {
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORPROFILE,$rootScope.getglobalErrorMessage.BTNOK);
                break;
              }
          $("#dv1").hide();
          $("#dv2").hide();
          $("#dv3").hide(); 
          $("#dv4").hide(); 
          $("#dv5").show();
          break;
      }
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('firewallController','redirecttoProgrampath ',e,$rootScope.getglobaldata.Client);
    } 
  }; 
  $scope.createFirwallrule =function()
  {
    try
    {
      if($scope.ruleName === null || $scope.ruleName === undefined)
        {
          showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,$rootScope.getglobalErrorMessage.ERRORRULENAME,$rootScope.getglobalErrorMessage.BTNOK);
          return;
        }
        var rdbinOutBound = $("input[name=rdbinOutBound]:checked").val();

        var rdbappPort = $("input[name=rdbappPort]:checked").val();

        var rdbPorts = $("input[name=rdbPorts]:checked").val();

        var rdballwConct= $("input[name=rdballwConct]:checked").val();

       var chkDomain  = $('#chkDomain').is(":checked");
       var chkPrivate = $('#chkPrivate').is(":checked");
       var chkPublic  = $('#chkPublic').is(":checked");

       var filepathval  = $("#txtbro").val();
       var portnumbersVal  = $("#portnumbers").val();

       var ruleNameVal  = $("#ruleName").val();
       var ruleDescriptionVal  = $("#ruleDescription").val();      
       var fwruleCreated="";
       try{ 
        fwruleCreated = window.external.fwapplicationRule(rdbinOutBound, rdballwConct,  chkDomain,  chkPrivate,  chkPublic,  rdbappPort,  filepathval,  rdbPorts,  portnumbersVal,  ruleDescriptionVal,  ruleNameVal);    
        }
        catch(e)
        {
          // stackTrace(e);
          stackTrace('firewallController','createFirwallrule ',e,$rootScope.getglobaldata.Client);
        }
       if (fwruleCreated !== "Failed" && fwruleCreated !== null)
       {
          showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRFIREWALL,fwruleCreated,$rootScope.getglobalErrorMessage.BTNOK);
       }
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('firewallController','createFirwallrule ',e,$rootScope.getglobaldata.Client);
    }
    };
 
  $scope.cancelFirwallrule =function()
  { 
      $scope.redirecttoProgrampath('dv1');
  };
  
});
 
    


