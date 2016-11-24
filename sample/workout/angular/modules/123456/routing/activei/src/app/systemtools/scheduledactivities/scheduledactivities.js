angular.module( 'activei.scheduledactivities', ['ui.router','plusOne','ngDialog'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'scheduledactivities', {
    url: '/scheduledactivities',
  views:{
           "RightView":{
             templateUrl:"systemtools/scheduledactivities/scheduledactivities.tpl.html", 
        controller:"scheduledactivitiesController"
    
    }
    },
    data:{ pageTitle: 'Scheduled Activities' }
  });
})

.controller( 'scheduledactivitiesController', function scheduledactivitiesController( $scope ,$rootScope,$http,$state,ngDialog) {
 
  $rootScope.isMiddleCont = true; 
   
$scope.schedulerActivities = function () {  
    try
    {     
       var schdactivi="";
       var recurdays="";  
       var rdbdaily = $("input[name=rdodaily]:checked").val();   
       var date="";
       var time=""; 
       var dateArray="";var selectdate="";var todayDate="";var dd="";var mm="";var yyyy="";
       var hours="";var minutes="";var t1="";var t2="";var twhours="";var timeArray="";
       var times="";var utcCurrenddate="";
       var uctselectedDate="";
       var minusmilisec ="";
       var sec="";
       var min=""; 
       var wdays ="";
       var mdays ="";
       var checkedweekValues="";
       var checkedmonthValues="";
       var selectmnth="";

       if(rdbdaily == "daily") { 
          recurdays=$("#txtdays").val(); 
          date = $("#txtDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtdays").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#txtdays").val() === '0') || ($("#txtdays").val() === '00') || ($("#txtdays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if((parseInt($("#txtdays").val(),10) > 365)) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'The Recovery Days should not be greater than 365 Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else { 
            date=$("#txtDate").val(); 
            time=$scope.frmData.txtTime;  
            dateArray = date.split(' ');
            selectdate = dateArray[0].split('/'); 
            //Split the Current date
            todayDate = new Date();
            dd = todayDate.getDate(); 
            dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
            mm = todayDate.getMonth() + 1; //January is 0!
            mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
            yyyy = todayDate.getFullYear();
            hours = todayDate.getHours();
            minutes = todayDate.getMinutes(); 
            //change the dateformat 
             t1 = yyyy +''+ mm +''+ dd ;
             t2 = selectdate[2]  + selectdate[0]  + selectdate[1]; 
              //Convert 24 hours format
             twhours = formatConversion(time);

            //Split the time
             timeArray = twhours.split(' ');
             times = timeArray[0].split(':');  
            //Compare the current date and selected date 
            if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60; 
                if (min <= 30) {
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEACTIVITYTIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            }
          }
       }

       else if(rdbdaily == "weekly") {
           recurdays=$("#txtweekdays").val(); 
          date = $("#txtweekDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtweekTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($('input[name=weekdays]:checked').length === 0){ 
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Select the Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtweekdays").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#txtweekdays").val() === '0') || ($("#txtweekdays").val() === '00') || ($("#txtweekdays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }
          else if(parseInt(recurdays,10) > 52)
          {
              showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter Week between 1 to 52 ',$rootScope.getglobalErrorMessage.BTNOK);           
              return false;
          }
          else { 
              date=$("#txtweekDate").val(); 
              time=$scope.frmData.txtweekTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes();  
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];  
                //Convert 24 hours format
                 twhours = formatConversion(time); 
                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);                 
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       }
       else if(rdbdaily == "monthly") {
           recurdays=$("#txtmonthlydays").val(); 
          date = $("#txtmonthlyDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtmonthlyTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($('input[name=monthlydays]:checked').length === 0){ 
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Select the Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }else if(($("#monthlydays").val() === '0') || ($("#monthlydays").val() === '00') || ($("#monthlydays").val() === '000')) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Valid Recovery Days',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          }  
          else { 
            recurdays=0; 
              date=$("#txtmonthlyDate").val(); 
              time=$scope.frmData.txtmonthlyTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes(); 
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];    
                //Convert 24 hours format
                 twhours = formatConversion(time); 
                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) { 
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       }
       else if(rdbdaily == "onetime") {
           recurdays=0; 
          date = $("#txtonetimeDate").val(); 
          if($.trim(date).length === 0) {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the valid Date',$rootScope.getglobalErrorMessage.BTNOK);           
            return false;
          } else if($("#txtoneTime").val() ==='') {
            showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,'Please Enter the Time',$rootScope.getglobalErrorMessage.BTNOK);           
            return false; 
          }
          else { 
              date=$("#txtonetimeDate").val(); 
              time=$scope.frmData.txtoneTime;
              dateArray = date.split(' ');
              selectdate = dateArray[0].split('/');  
              //Split the Current date
              todayDate = new Date();
              dd = todayDate.getDate();
              dd=(parseInt(dd,10) < 10)?'0'+dd:dd; 
              mm = todayDate.getMonth() + 1; //January is 0!
              mm=(parseInt(mm,10) < 10) ?'0'+mm:mm; 
              yyyy = todayDate.getFullYear();
              hours = todayDate.getHours();
              minutes = todayDate.getMinutes();  
              //change the dateformat 
               t1 = yyyy +''+ mm +''+ dd ;
               t2 = selectdate[2]  + selectdate[0]  + selectdate[1];
                //Convert 24 hours format
                 twhours = formatConversion(time);

                //Split the time
                 timeArray = twhours.split(' ');
                 times = timeArray[0].split(':');
              if (t2 < t1) {  
                showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPAREDATE,$rootScope.getglobalErrorMessage.BTNOK);           
                return false;
            } 
            else if (t2 == t1) {  
                 utcCurrenddate = Date.UTC(yyyy, mm , dd, hours, minutes);
                 uctselectedDate = Date.UTC(selectdate[2], selectdate[0], selectdate[1], times[0], times[1]);
                 minusmilisec = uctselectedDate - utcCurrenddate;
                 sec = minusmilisec / 1000;
                 min = sec / 60;  
                if (min <= 30) { 
                    showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.INFOSCHEDULEDTIMECOMPARETIME,$rootScope.getglobalErrorMessage.BTNOK);                
                    return false;
                }   
            } 
          }
       } 
       
        checkedweekValues = $('input[name=weekdays]:checked').map(function() {
            return this.value;
        }).get();
         checkedmonthValues = $('input[name=monthlydays]:checked').map(function() {
            return this.value;
        }).get();  
         
        wdays = checkedweekValues.join(); 
        mdays = checkedmonthValues.join();  
        try{ 
        //$scope.loaderdisplay = true;     
         schdactivi = window.external.createScheduleactivities(rdbdaily,parseInt(recurdays,10),date,time,wdays,mdays);               
        // $scope.loaderdisplay = false;
         //schdactivi = window.external.createScheduleactivities('monthly',3,'02/25/2015','11:30 PM','',01);               
        }
        catch(e){
          // stackTrace(e);
          stackTrace('scheduledactivitiesController','schedulerActivities ',e,offlineGlobalData.Client);
        } 
      
       if (schdactivi !== "Failed" && schdactivi !== null)
       {
         showMessage($scope,ngDialog,$rootScope.getglobalErrorMessage.DialogInfo,$rootScope.getglobalErrorMessage.HDRSCHEDULEDACTIVITIES,$rootScope.getglobalErrorMessage.SUCCESSSCHEDULEDACTIVITIESSAVE,$rootScope.getglobalErrorMessage.BTNOK);
       }
    //}
       
    }
    catch(e)
    {
      // stackTrace(e);
      stackTrace('scheduledactivitiesController','schedulerActivities ',e,offlineGlobalData.Client);
    }
  };

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
    $('#txtweekDate').val(dateStr);
    $('#txtweekDate').datepicker({ format: "mm/dd/yyyy" }); 
    $('#txtmonthlyDate').val(dateStr);
    $('#txtmonthlyDate').datepicker({ format: "mm/dd/yyyy" });
    $('#txtonetimeDate').val(dateStr);
    $('#txtonetimeDate').datepicker({ format: "mm/dd/yyyy" });
    //To show the time 30 minutes ahead
    var thirtyMinutesLater = new Date(d.getTime() + (31 * 60 * 1000));
    
    $(".txttimepicker").timepicker({
                defaultTime: thirtyMinutesLater,
                minuteStep: 1,
                showInputs: false,
                disableFocus: true
    });  
    }
    catch(e)
    {
        // stackTrace(e);
        stackTrace('scheduledactivitiesController','dateTimeControls ',e,offlineGlobalData.Client);
    } 
};

});
 
function rdbChangeEvent(){ 
var rdoid=$("input[name=rdodaily]:checked").val(); 

 var d = new Date();
    var rdbcurrDate = d.getDate();
    var rdbcurrMonth = d.getMonth() + 1;
    var rdbcurrYear = d.getFullYear(); 
    rdbcurrDate=(parseInt(rdbcurrDate,10) < 10)?'0'+rdbcurrDate:rdbcurrDate;
    rdbcurrMonth=(parseInt(rdbcurrMonth,10) < 10) ?'0'+rdbcurrMonth:rdbcurrMonth;
    var rdbdateStr = rdbcurrMonth + "/" + rdbcurrDate + "/" + rdbcurrYear;

    $('#txtDate').val(rdbdateStr);
    $('#txtweekDate').val(rdbdateStr);
    $('#txtmonthlyDate').val(rdbdateStr);
    $('#txtonetimeDate').val(rdbdateStr);

    $('#txtTime').val('');
    $('#txtweekTime').val('');
    $('#txtmonthlyTime').val('');
    $('#txtoneTime').val('');

    $('#txtdays').val('');
    $('#txtmonthlydays').val('');
    $('#txtweekdays').val(''); 

    $('input:checkbox[name=weekdays]').attr('checked',false);
    $('input:checkbox[name=monthlydays]').attr('checked',false); 

    $(".dvscheduler").hide(); 
    $("#" + rdoid).show(); 
}

//functionality to format the time
 function formatConversion(time) {
    try{
         
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
    stackTrace('scheduledactivitiesController','formatConversion ',e,offlineGlobalData.Client);
    }  
}


 
    


