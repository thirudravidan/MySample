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
angular.module( 'activei.scheduleacall', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'scheduleacall', {
    url: '/scheduleacall',
  views:{      
      "RightView":{
        templateUrl:"support/scheduleacall/scheduleacallRight.tpl.html",
        controller:"scheduleacallRightController"
        }
    },
    data:{ pageTitle: 'Schedule a Call' }
  })
.state("newschedule", {
       url: "/newschedule",
       views: {             
         'RightView': { 
          templateUrl: 'support/scheduleacall/newschedule.tpl.html',
          controller: "newscheduleController" 
         }
       }
         });
})

//
//Schedule Right View Controller Initialization
.controller( 'scheduleacallRightController', function scheduleacallRightController( $scope,$http ,$rootScope,$cookieStore ,$state) {
$scope.isShowbutton=false;
$rootScope.isMiddleCont = true;
$scope.isCalanderLoaded=false;

  
//get created schedule and load
$scope.scheduledcase=function()
{ 
    try{
      getSchedule($scope,$http,$cookieStore,$rootScope); 
    }
    catch(e){
        stackTrace('scheduleacallRightController','scheduledcase',e,$rootScope.getglobaldata.Client);
    }
};
  $scope.redirectToNewSchedule=function()
  {
    $rootScope.isnewpage=true;
    $state.go('newschedule');
  };

   $scope.refreshScheduleacall=function()
  {
    // $state.reload();
    $scope.scheduledcase();
  };
  

})
//
//New Schedule Controller Initialization
.controller( 'newscheduleController', function newscheduleController( $scope,$http ,$rootScope,$cookieStore ,$state,ngDialog) {

//Load Date and time on page load
$scope.dateTimeControls=function()
{
    try{
    var d = new Date();
    var currDate = d.getDate();
    var currMonth = d.getMonth() + 1;
    var currYear = d.getFullYear();
    currDate=(parseInt(currDate,10) < 10)?'0'+currDate:currDate;
    currMonth=(parseInt(currMonth,10) < 10) ?'0'+currMonth:currMonth;
    var dateStr = currMonth + "/" + currDate + "/" + currYear; 
    $('#txtDate').val(dateStr);
    $('#txtDate').datepicker({ format: "mm/dd/yyyy" });
    //To show the time 30 minutes ahead
    var thirtyMinutesLater = new Date(d.getTime() + (31 * 60 * 1000));
    
    $(".txttimepicker").timepicker({
        defaultTime: thirtyMinutesLater,
                minuteStep: 1,
                showInputs: false,
                disableFocus: false
    }); 
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','dateTimeControls',e,$rootScope.getglobaldata.Client);
    } 
};

 
//Load Product on Init
$scope.loadProduct=function()
{    
    try{
        getScheduelProduct($scope,$http,$rootScope,$cookieStore); 
    }
    catch(e)
    {
        stackTrace('newscheduleController','loadProduct',e,$rootScope.getglobaldata.Client);
    }
};

//functionality get all TimeZoneDetails
$scope.getallTimeZoneDetails=function(){
        
        showLoader();   
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "GetAllTimeZones";
        var param={};
        $http.post(servicePath,param).then(function(result,status,headers,config){             
            $.loader('close'); 
            $scope.TimeZoneDetails=result.data.d;
        }).error(function(result,status,headers,config){ 
            $.loader('close');
        });
};

//functionality used to save the new schedule
$scope.saveNewSchedule=function(isformvalid){
    try
    {  
    $scope.headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE; 
    $scope.msgDescription=$rootScope.getglobalErrorMessage.SUCCESSSCHEDULESAVE; 
    if (isformvalid) { //form validation if
    if ($scope.showControlValidation()) {
    if (validateDatetime($scope,$rootScope,ngDialog)) { //validate date and time if   
        
        // var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.selectedproduct.ProductName + "," + $scope.callBackNumber + "," + escape($scope.scheduleProblemTitle);
        var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.scheduleTimeZone.TimeZone + "," + $scope.callBackNumber + "," + encodeURIComponent($scope.scheduleProblemTitle);
        // var param = '{ "customerId":'+ parseInt(localStorage.getItem('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + $scope.scheduleProblemTitle + '", "caseCauses": "", "caseNotes": "' + $scope.scheduleProblemDescription + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
        $scope.serviceData=createScheduleCase($scope,$rootScope,scheduleCall);
        showLoader();   
        $http.post($scope.serviceData.servicePath,$scope.serviceData.param).then(function(result,status,headers,config){             
            $.loader('close'); 
            if ($rootScope.getglobaldata.Client === 'GearHead') {
                if (result.data.d) { 
                    ngDialog.openConfirm(
                    {
                        template: 'successdialog',
                        className: 'ngdialog-theme-default',                     
                        scope: $scope
                    }                
                    )
                    .then(function(value){
                         $state.go('scheduleacall');
                    }, function(value){
                    }); //End ngDialog.open 
                }
                else
                {
                  //  alert(result.data.d);
                }
            }
            else{
            if (result !== null) { 
                ngDialog.openConfirm(
                {
                    template: 'successdialog',
                    className: 'ngdialog-theme-default',                     
                    scope: $scope
                }                
                )
                .then(function(value){
                                                                       
                     $state.go('scheduleacall');
                             
                    }, function(value){
                        
                    }); //End ngDialog.open 
                }
                else
                {
                  //  alert(result.data.d);
                }
            }

        }).error(function(result,status,headers,config){ 
            $.loader('close');
        });


                //  ngDialog.openConfirm(
                //     {

                //     template: 'confirmdialog',
                //     className: 'ngdialog-theme-default',                     
                //     scope: $scope
                                        
                //     }                
                // )
                // .then(function(value){
                       
                    
                //     var scheduleCall = $("#txtDate").val() + "," + $("#txtTime").val() + "," + $scope.selectedproduct.ProductName + "," + $scope.callBackNumber + "," + $scope.scheduleProblemTitle;
                //     var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "ScheduleaCall";
                                          
                //                         var param = '{ "customerId":'+ parseInt($cookieStore.get('StoredCustomerID'),10) +', "registrationId": '+ $scope.selectedproduct.RegistrationId +', "serialNumber": "' + $scope.selectedproduct.SerialNo + '", "caseSummary": "' + scheduleCall + '","caseProblem": "' + $scope.scheduleProblemTitle + '", "caseCauses": "", "caseNotes": "' + $scope.scheduleProblemDescription + '", "caseSource":"Client", "caseAssingTo":"GHConnectCallbacks", "caseQueueId":0}'; //Data to server
                //                         $http.post(servicePath,param).then(function(result,status,headers,config){
                //                             if (result.data.d) {
                //                                 $state.go('scheduleacall');
                //                             }
                //                             else
                //                             {

                //                             }

                //                         }).error(function(result,status,headers,config){

                //                         });
                    
                             
                //     }, function(value){
                        

                //     }); //End ngDialog.open

    }     //validate date and time if
  }     //form validation if end
}
    }
    catch(e)
    {
        stackTrace('newscheduleController','saveNewSchedule',e,$rootScope.getglobaldata.Client);
    }
};      //end saveNewSchedule function

$scope.showControlValidation=function(){
    var messageText="";
    var headerText="";
    var buttonText="";


     if($scope.callBackNumber.length < 10){
        
         messageText=$rootScope.getglobalErrorMessage.SCHEDULECALLBACK;
         headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE;
         buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        $("#ngDialogbtnWarningOkButton").focus();
        //Show the info message
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
        $("#txtPhoneNumber").focus();

        return false;
     }
     else if(parseInt($scope.callBackNumber,10) <= 0){
         messageText=$rootScope.getglobalErrorMessage.VALIDATECALLBACK;
         headerText=$rootScope.getglobalErrorMessage.HDRSCHEDULE;
         buttonText=$rootScope.getglobalErrorMessage.BTNOK;
        $("#ngDialogbtnWarningOkButton").focus();
        //Show the info message
        showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogWarning,headerText,messageText,buttonText);
        $("#txtPhoneNumber").focus();
        return false;
     }
     else{
        return true;
     }
    
  };

});     //End Controller



////get the created schedule details
function getSchedule($scope,$http,$cookieStore,$rootScope)
{ 
    try{ 
        $('#calendar').fullCalendar('today');
        if (!$scope.isCalanderLoaded) {
            $scope.isCalanderLoaded=true;
             //Display the fullcalander
            $('#calendar').fullCalendar({
                editable: false,
                eventLimit: true, // allow "more" link when too many events      
                selectable: true,
                slotDuration: '03:00:00',
                allDay : true,
                // Options
                header: {
                            left: 'prev,next today',
                            center: 'title',
                            // right: 'month,basicWeek,basicDay'
                            right: 'month,basicWeek,basicDay'
                        },
                eventClick:  function(event) { 
                        // $('#modalBody').html(event.title);
                        $('#lblSchedule').text(event.title);
                        $('#modalTitle').html("Schedule a Call"); 
                        $('#fullCalModal').appendTo("body").modal('show');
                        // $('#fullCalModal').modal();
                        },
                disableDragging: true
                // ,eventClick: function(calEvent, jsEvent, view) {
                //     jsEvent.preventDefault();
                //     // Go to and show day view for start date of clicked event
                //     $('#calendar').fullCalendar('gotoDate', calEvent.start);
                //     $('#calendar').fullCalendar('changeView', "basicDay");
                //     $('#calendar').fullCalendar('option', 'contentHeight', 350);
                //     $('#calendar').fullCalendar('option', 'eventLimit', false);
                //     // .fc-basic-view tbody .fc-row
                //     // $(".fc-basic-view tbody .fc-row").attr('min-height','23vw');
                // },
                // dayClick: function(date, allDay, jsEvent, view) {
                // $('#calendar').fullCalendar( 'changeView', 'basicDay');
                // $('#calendar').fullCalendar( 'gotoDate', date);
                // $('#calendar').fullCalendar('option', 'contentHeight', 350);
                // $('#calendar').fullCalendar('option', 'eventLimit', false);
                // // $('#containerDayCal')
                // // $(".fc-basic-view tbody .fc-row").attr('min-height','23vw');
                // },
                
                // eventLimitClick : function(date, allDay, jsEvent, view){
                //    $('#calendar').fullCalendar( 'changeView', 'basicDay');
                //    alert(jsEvent.length);
                //    $('#calendar').fullCalendar( 'renderEvent', jsEvent , 'stick');
                // }

            });
        }
        $('#calendar').fullCalendar('removeEvents');
    // $rootScope.getglobaldata =offlineGlobalData;
     $scope.isShowbutton=true;   //show the button
        var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "MyScheduleCases";
         var customerId= localStorage.getItem('StoredCustomerID') ;
        // var customerId = 22933063 ;
        // var customerId= 2 ;
        var param = '{ "customerId":"' + customerId + '"}';
        showLoader(); 
       
     //Get created schedule and display the schedule event in calander   
    $http.post(servicePath, param).then(function (result, status, headers, config) {
        var schuduledEvent = result.data.d;
        // schuduledEvent = schuduledEvent.sort(function (a, b) {
        //        return a.ScheduleTimeStamp.localeCompare( b.ScheduleTimeStamp );
        // });
        for (var j = 0; j < schuduledEvent.length; j++) {
            var scheduledDate = new Date(schuduledEvent[j]["ScheduleDate"].toString());
            var scheduleTime = "";

            if (schuduledEvent[j]["ScheduleTime"] !== null && schuduledEvent[j]["ScheduleTime"] !== undefined)
            {
                scheduleTime = schuduledEvent[j]["ScheduleTime"].toString();
            }

           var scheduleTitle = "";
            if (schuduledEvent[j]["CaseSummary"].toString() !== "") {  
                scheduleTitle = unescape(schuduledEvent[j]["CaseSummary"].toString()) + "," + scheduleTime;                 
                var startDate=scheduledDate.getFullYear() +"-"+ (parseInt(scheduledDate.getMonth(),10)+1) +"-"+ scheduledDate.getDate() +" "+scheduleTime;
                var eventDetails = {

                    title: scheduleTitle,
                    // start: new Date(scheduledDate.getFullYear(), scheduledDate.getMonth(), scheduledDate.getDate())
                    start: new Date(startDate),
                    allday : false
                };
                //render events to the calander  
                 $('#calendar').fullCalendar( 'renderEvent', eventDetails , 'stick');

            }


        } //for loop end
        $.loader('close');
    
    }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
            $.loader('close');
    });
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','getSchedule',e,$rootScope.getglobaldata.Client);
    }
   
}


//get the product based on the customer ID
function getScheduelProduct($scope,$http,$rootScope,$cookieStore) {
    try{
         var servicePath = $rootScope.getglobaldata.getGlobalServiceUrl + "CustomerGetProductInfo";
        var customerId= localStorage.getItem('StoredCustomerID') ; 
        // var param = '{ "customerID":' + parseInt(customerId,10) + ',"email": "","address": ""}';
      var param = customerProductInfo($rootScope); 
    // //get the product based on the customer ID
    $http.post(servicePath, param).then(function (resp, status, headers, config) {
        
        if ($rootScope.getglobaldata.Client === 'GearHead') {
             $scope.productbuild=[];
            $.each(resp.data.d,function(key,values){
                $scope.procuctsinfo={};
                $scope.procuctsinfo.ProductName=values.Product;
                $scope.procuctsinfo.RegistrationId=values.Registration_ID;
                $scope.procuctsinfo.SerialNo=values.Serial_Number;
                $scope.procuctsinfo.PurchaseDate=values.Purchase_Date;
                $scope.procuctsinfo.CountryPurchase=values.Country_Purchased;
                $scope.procuctsinfo.ProductExpired=values.PsExpiry;
                $scope.procuctsinfo.SwExpired=values.SwExpiry;
                $scope.procuctsinfo.ProductWarranty=values.Warranty;
                $scope.productbuild.push($scope.procuctsinfo);
            });
            $scope.procuctdetails=$scope.productbuild;

        }
        else{
            $scope.procuctdetails=resp.data.d;  
        }
        
        
    }).error(function(serverResponse, status, headers, config){
      //alert("failure");
      $.loader('close');
    });
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('newscheduleController','getScheduelProduct',e,$rootScope.getglobaldata.Client);
    }
   

}

//functionality to validate if the date is current date then check time is greater than 30 mins compare to current time
function validateDatetime($scope,$rootScope,ngDialog) {
    try{
        var isValid = true;
        //Split the selected date
        var date = $("#txtDate").val();
        var time = $("#txtTime").val();
        //var date = $scope.scheduleDate;
        var dateArray = date.split(' ');
        var selectdate = dateArray[0].split('/');

        //Split the Current date
        var todayDate = new Date();
        var dd = todayDate.getDate();
         dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
        mm = todayDate.getMonth() + 1; //January is 0!
        mm=(parseInt(mm,10) < 10) ?'0'+mm:mm;
        
        // dd=(dd.length=1)?'0'+dd:dd;
        // var mm = todayDate.getMonth() + 1; //January is 0!
        // mm=(mm.length=1)?'0'+mm:mm;

        var yyyy = todayDate.getFullYear();
        var hours = todayDate.getHours();
        var minutes = todayDate.getMinutes();
 
        //change the dateformat
        var t1 = yyyy +''+ mm +''+ dd ;
         var t2 = selectdate[2] + selectdate[0]  + selectdate[1];
        //Convert 24 hours format
        var twhours = formatConversion(time); 
        //Split the time
        var timeArray = twhours.split(' ');
        var times = timeArray[0].split(':');
        
        
        //Compare the current date and selected date
            if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULE,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60; 
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULE,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }  
            }
             return true;
    }
    catch(e)
    {
        // stackTrace(e);        
        stackTrace('newscheduleController','validateDatetime',e,$rootScope.getglobaldata.Client);
    }
}


//functionality to format the time
 function formatConversion() {
     try{ 
        //Convert time 24 hour format 
        //var time = $scope.scheduleTime;
        var hrs = Number(time.match(/^(\d+)/)[1]);
        var mnts = Number(time.match(/:(\d+)/)[1]);
        var format = time.match(/\s(.*)$/)[1];
        if (format === "PM" && hrs < 12)
        {hrs = hrs + 12;} 
        if (format === "AM" && hrs == 12)
        {hrs = hrs - 12;} 
        var hours = hrs.toString();
        var minutes = mnts.toString();
        if (hrs < 10) {
          hours = "0" + hours;
        }
        if (mnts < 10) {
          minute1 = "0" + minutes;
        }
        return hours + ":" + minutes; 
    }
    catch(e)
    {
        // stackTrace(e);
    }  
}

function checkCallbackNumber(ctrl,event)
{
    if (ctrl.value.length < 10) {
         angular.element(document.getElementById("rightCont")).scope().showControlValidation();
         event.preventDefault();
         return false;
    }
}
function onkeyup(e) {
    var code;
    if (!e) { e = window.event;} // some browsers don't pass e, so get it from the window
    if (e.keyCode) {code = e.keyCode;} // some browsers use e.keyCode
    else if (e.which) {code = e.which;}  // others use e.which

    if (code == 8 || code == 46){
        return false;
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