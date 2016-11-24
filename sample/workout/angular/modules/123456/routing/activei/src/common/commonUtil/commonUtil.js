angular.module("globalData", [])
.controller("StaticResourceData", ['$scope','$http', function($scope, $http)
		{    
			$http.get('assets/StaticResources/data.txt').then(function(response){
			//alert('StaticResourceData read');
				$scope.getglobaldata = response.data;
				
		});
	//alert('StaticResourceData end');
		}]
);

function GetKeyValue($scope, $http) {
    var path = "assets/StaticResource/data.txt";
    $http.get(path).then(function (response) {
        //        $scope.$apply(function () {
		//alert(response);
        $scope.getglobaldata = response.data;
        //        });

    });
}

function chkalphaNumeric(e) {
        var regex = new RegExp("^[a-zA-Z0-9!@$',:;?/%*#.&]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        } 
        return false;
    }

function removeextra() {
    var initVal = $('#txt_Problem').val();
    outputVal = initVal.replace(/[^0-9a-zA-Z]/g,"");       
    if (initVal != outputVal) {
        $(this).val(outputVal);
    }
}

//functionality used to allow only numeric values
function isNumber(evt) {  
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

//functionality used to allow only Alphabet values
function ValidateAlpha(evt)
    {
        var keyCode = (evt.which) ? evt.which : evt.keyCode;
        if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32){         
            return false;
        }
        return true;
    } 

//
function csscorpRedirect()
{
    window.external.csscorpRedirection();
}
//functionality used to load dynamic left and right content
function loadPageContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID)
{
    contentHide();  
    hideSystemToolsDescription();
   if (stateName!== '') {   
        // alert(stateName);  
        $state.go(stateName);  
        // alert(JSON.stringify(jsondata)); 
        showleftrightContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID);
     }

}

//hide left and right menu and unbind the event
function contentHide()
{

    //hide left content 
    //if left side menu increased then we need to increase the count of variable "i"
    for (var i = 1; i <= 7; i++) {

       $("#div"+i).hide();
       $("#div"+i).unbind("click");
       $("#spn"+i).unbind("click");
       
    }

    //hide right content 
    //if right side menu increased then we need to increase the count of variable "j"
    for (var j = 1; j <= 12; j++) {
       
       $("#divright"+j).hide();
       $("#divright"+j).unbind("click");
       $("#spnright"+j).unbind("click");
       $("#divright"+j).unbind("mouseenter");
       $("#divright"+j).unbind("mouseleave");
    }

}

//functionality to dynamically load left and right content based on JSON data
//back button functionality has been implemented
function showleftrightContent(jsondata,$state,$rootScope,$cookieStore,parentid,child_id,stateName,clickedID)
{

    try{
    //for each for load left content
     angular.forEach(jsondata,function(values,keys){

       if (parseInt(values.parent_id,10) === parseInt(parentid,10)) {

            $("#dvleftcontent").show();
			$("#dvleftcontent").removeClass();
			$("#dvleftcontent").addClass('slide');            

            // $("#div"+values.leftPositionID).removeClass('poly_active').addClass('polygon');

            $("#div"+values.leftPositionID).removeClass('leftpoly_active').addClass('leftpolygon');

            if (parseInt(clickedID,10)=== parseInt(values.id,10)) {
                // $("#div"+values.leftPositionID).removeClass('polygon').addClass('poly_active');
                $("#div"+values.leftPositionID).removeClass('leftpolygon').addClass('leftpoly_active');
                //bind event to back button 
                $("#dvgoback").unbind("click");
                $("#dvgoback").on('click', function(){
                    if ($rootScope.isAntivirusScanned) {
                        $rootScope.isAntivirusScanned=false;
                        window.external.resetAntivirus();    
                    }
                    if ($rootScope.isNetworkSpeed) {
                        $rootScope.isNetworkSpeed=false;
                        window.external.resetNetworkSpeed();    
                    } 
                    $rootScope.homeClicked=true;
                    if (parseInt(parentid,10)=== 0 && !$rootScope.isnewpage) {
                        $state.go('home');
                    }
                    else if ($rootScope.isnewpage) {
                        $rootScope.isnewpage=false;
                        if (values.statename === 'messagecenter' || values.statename === 'knowledgebase') {
                            $state.reload();
                        }
                        else{
                            $state.go(values.statename);
                        }
                    }
                    else{

                        backButton(values.parent_id,values.id,$state,$rootScope,$cookieStore);
                    }
                    
                });
            }



            //used to load the current page when no session key available in remote support
            if (parseInt(parentid,10)=== 1 && stateName!=='remotesupport') {
                $rootScope.homeClicked=false;
                localStorage.setItem('clickedID',clickedID);
                localStorage.setItem('stateName',stateName);
            }


            //based the clicked menu we need to bind the click event dynamically
            if (stateName !== values.statename) {
                 if (values.statename === "managerouter") {
                    $("#div"+values.leftPositionID).show(); 
                    $("#spnimg"+values.leftPositionID).removeClass().addClass(values.classname);
                    $("#spn"+values.leftPositionID).text(values.name);
                    $("#div"+values.leftPositionID).on('click', function(){
                         showLoader();
                        $rootScope.ischeckingValidIP=window.external.checkvalidIP();
                         $.loader('close');
                        if ($rootScope.ischeckingValidIP) {
                            loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                        }                        
                    });
                }
                else{
                //bind the click event for dynamic left menu
                if((values.hasOwnProperty("active") && values.active==='Y') || (!values.hasOwnProperty("active")))  {
                     $("#div"+values.leftPositionID).show(); 
                    $("#spnimg"+values.leftPositionID).removeClass().addClass(values.classname);
                    $("#spn"+values.leftPositionID).text(values.name);
                    $("#div"+values.leftPositionID).on('click', function(){
                        if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                           $rootScope.offlineerrorUpgrade();
                        }
                        
                        else{
                            //
                            if ((parseInt($rootScope.userDetails.ContractAvailability,10) ===0) && ((parseInt(values.id,10) === 1 || parseInt(values.id,10) === 3))) {
                                $rootScope.inActiveUserErrorMessage();  
                            }
                            else
                            {
                                $rootScope.leftclicked=true;
                                loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                            }
                            
                        }

                    });

                    $("#spn"+values.leftPositionID).on('click', function(){
                    //     $rootScope.leftclicked=true;
                    // loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                         if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                           $rootScope.offlineerrorUpgrade();
                        }
                        else{
                            if ((parseInt($rootScope.userDetails.ContractAvailability,10) ===0) && ((parseInt(values.id,10) === 1 || parseInt(values.id,10) === 3))) {
                                $rootScope.inActiveUserErrorMessage();  
                            }
                            else
                            {
                                $rootScope.leftclicked=true;
                                loadPageContent(jsondata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                            }
                            
                        }
                    });
                }
            }

            }
            else
            {
                $("#div"+values.leftPositionID).show(); 
                    $("#spnimg"+values.leftPositionID).removeClass().addClass(values.classname);
                    $("#spn"+values.leftPositionID).text(values.name);
                //unbind the click event of the selected menu
                $("#div"+values.leftPositionID).unbind("click");
                 $("#spn"+values.leftPositionID).unbind("click");
            }

            //check and load right content of the selected menu
            if (parseInt(clickedID,10)=== parseInt(values.id,10)) {
                //for each for load right content
                angular.forEach(jsondata[keys].submenu,function(values,index){

                    $("#rightCont").hide();
                    //add mouseenter and mouseleave event when hover on system tools menu
                    if (parseInt(clickedID,10) === 3) {
                        showsystemToolsDescription(values.statename,values.rightPositionID);
                    }

                    if (values.statename === "remotesupport") {
                        $("#divright"+values.rightPositionID).show();
                        $("#spnright"+values.rightPositionID).text(values.name);
                        $("#spnrgtimg"+values.rightPositionID).removeClass().addClass(values.classname);
                         $("#divright"+values.rightPositionID).on('click', function(){
                            $rootScope.leftclicked=false;
                            $state.go(values.statename);
                        });
                    }
                    else if (values.statename === "managerouter") {
                        $("#divright"+values.rightPositionID).show();
                        $("#spnright"+values.rightPositionID).text(values.name);
                        $("#spnrgtimg"+values.rightPositionID).removeClass().addClass(values.classname);
                         $("#divright"+values.rightPositionID).on('click', function(){
                            $rootScope.leftclicked=false;
                            showLoader();
                            $rootScope.ischeckingValidIP=window.external.checkvalidIP();
                             $.loader('close');
                            if ($rootScope.ischeckingValidIP) {
                                loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                            }                           
                            
                        });
                    }
                    else
                    {
                        //bind the click event for dynamic right menu
                            if((values.hasOwnProperty("active") && values.active==='Y') || (!values.hasOwnProperty("active")))  {
                                $("#divright"+values.rightPositionID).show();
                                $("#spnright"+values.rightPositionID).text(values.name);
                                $("#spnrgtimg"+values.rightPositionID).removeClass().addClass(values.classname);
                                 $("#divright"+values.rightPositionID).on('click', function(){
                                     if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                                       $rootScope.offlineerrorUpgrade();
                                    }
                                    
                                    else{
                                        $rootScope.leftclicked=false; 
                                        $rootScope.kbFlag = null;
                                     // if (parseInt(clickedID,10) !== 3) {
                                        loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                    }
                                     // }

                                });
                                 $("#spnright"+values.rightPositionID).on('click', function(){
                                    if ($rootScope.userDetails.IsNetwork === 'False' && (parseInt(values.id,10) === 1 || parseInt(values.id,10) === 2 || parseInt(values.id,10) === 4 || parseInt(values.id,10) === 314 || parseInt(values.id,10) === 315 || parseInt(values.id,10) === 333)){
                                       $rootScope.offlineerrorUpgrade();
                                    }
                                    
                                    else{
                                        $rootScope.leftclicked=false;
                                        $rootScope.kbFlag = null;
                                       // loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                        // if (parseInt(clickedID,10) !== 3) {
                                            loadPageContent(jsondata[keys].submenu,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                                         // }
                                     }

                                });
                            }
                    }

                }); //right foreach end

				$("#dvrightcontent").show();
				$("#dvrightcontent").addClass('slide');

            } //right if end
                          
             
        }  //if end
    });  //foreach end
} catch (e) {
        // stackTrace(e);
        stackTrace('CommonUtil','showleftrightContent ',e,offlineGlobalData.Client);
    }

}

//bind event to back button 
function backButton(parentID,ClickedID,$state,$rootScope,$cookieStore)
{
    try{
         var isBackMenu=false;         
        angular.forEach($rootScope.getglobalmenudata,function(values,keys){
            if (!isBackMenu) {
                if (parseInt(values.id,10)=== parseInt(parentID,10)) {
                isBackMenu=true;
                loadPageContent($rootScope.getglobalmenudata,$state,$rootScope,$cookieStore,values.parent_id,values.id,values.statename,values.id);
                return;
            }
            else{
                angular.forEach($rootScope.getglobalmenudata[keys].submenu,function(submenuvalue,index){
                        
                        if (parseInt(submenuvalue.id,10)=== parseInt(parentID,10)) {
                            isBackMenu=true;
                            loadPageContent($rootScope.getglobalmenudata[keys].submenu,$state,$rootScope,$cookieStore,submenuvalue.parent_id,submenuvalue.id,submenuvalue.statename,submenuvalue.id);
                            return;
                        }
                });
            }
           }
            
        });

    } catch (e) {
        // stackTrace(e);
        stackTrace('CommonUtil','backButton ',e,offlineGlobalData.Client);
    }

}

//functionality used to show and hide system tools menu descriptions
function showsystemToolsDescription(statename,rightPositionID)
{
    switch (statename) {
            case 'pcoptimizationsuite':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvOptimizationsuite").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvOptimizationsuite").hide();
                        });

                break;     
                 case 'routerconfig':

                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvrouterConfig").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvrouterConfig").hide();
                        });

                break;   
                 case 'networktools':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvNetworkTools").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvNetworkTools").hide();
                        });

                break;   
                 case 'wifitools':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvwifiTools").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvwifiTools").hide();
                        });

                break;   
                 case 'scheduledactivities':
                     $("#divright"+rightPositionID).bind('mouseenter', function() {
                            $("#dvScheduleActivities").show();
                        });
                        $("#divright"+rightPositionID).bind('mouseleave', function() {
                             $("#dvScheduleActivities").hide();
                        });

                break;                     
            default: break;

        }
}

function hideSystemToolsDescription()
{
    $("#dvOptimizationsuite").hide();
    $("#dvrouterConfig").hide();
    $("#dvNetworkTools").hide();
    $("#dvwifiTools").hide();
    $("#dvScheduleActivities").hide();
}

//common functionality to show warning and Information dialog boxes 
function showMessage($scope,ngDialog,templateName,headerText,messageText,buttonText){

    $scope.infomsgDescription=messageText;
    $scope.headerText=headerText;
    $scope.okButton=buttonText;
    if (templateName==='Warning') {

        $scope.dialogclass="icon-invalid invalid";
    }
    else if (templateName==='Information') {
        
        $scope.dialogclass="icon-info invalid";

    }
    
    ngDialog.open({     template: 'infoDialog',
                            plain: false,
                             scope: $scope
                }); 
}

function stackTrace(controllerName,methodName,ex,clientName)
{
    // alert(controllerName);
    // alert(methodName);
    // alert($rootScope.getglobaldata.Client);
    window.external.writeClientSideError(controllerName,methodName,JSON.stringify(ex.stack),clientName);
    // throw ex;
   // alert(ex);
}
function drawszlider(totalval, loadingval){
    // alert('documentrawszlider');
    var percentcompleted=Math.round((loadingval*100)/totalval);
    document.getElementById("szliderbar").style.width=percentcompleted+'%';
    document.getElementById("szazalek").innerHTML=percentcompleted+'%';
    
}

function showLoader()
{
    $.loader({
              className:"blue-with-image-2",
              content:''
          });
}
