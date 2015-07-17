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
angular.module('activei.messagecenter', ['ui.router'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('messagecenter', {
        url: '/messagecenter',
        views: {
            "RightView": {
                templateUrl: "messagecenter/messagecenterRight.tpl.html",
                controller: "messagecenterRightController"

            }
        },
        data: { pageTitle: 'MessageCenter' }
    });
})
//controller initialization
.controller('messagecenterRightController', function messagecenterRightController($scope, $rootScope, $http, $cookieStore, $state) {
    $rootScope.isMiddleCont = true;
    $('#background_logo').removeClass().addClass('cont_bg_logo');
    //Get message details
    $scope.getMessageDetails = function () {
        showLoader();
        if($rootScope.getglobaldata.Client === "GearHead"){
          $scope.socialshow=true;
        }
        getMessageDetailsList($scope, $http, $cookieStore, $rootScope);
        showSocial();
    };

    //view the message description
    $scope.redirecttoMessageDescription = function (ID, redirectionPageID) {
        // console.log('ne sdlkk fasd sddf sa');
        try{
        redirectTomsgView(ID, redirectionPageID, $scope, $http, $cookieStore, $rootScope);
      }
      catch(e){
        stackTrace('messagecenterRightController','redirecttoMessageDescription',e,$rootScope.getglobaldata.Client);
      }
    };

});

//Get message details 
function getMessageDetailsList($scope,$http,$cookieStore,$rootScope)
{ 
  try
  {
    var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetmessageDetails";   
        var param = ""; 
        $http.post(servicePath, param).success(function (result) 
        {
          $.loader('close');
            var  content= '';
            $scope.Messagelist = result.d; 
        }).error(function (serverResponse, status, headers, config) {
            //alert("failure");
            $.loader('close');
        });
  }
    catch(e)  
  {
    // stackTrace(e);
    stackTrace('messagecenterRightController','getMessageDetailsList',e,$rootScope.getglobaldata.Client);
  }     
}

 //functionality to view message description
function redirectTomsgView(ID, redirectionPageID,$scope,$http,$cookieStore,$rootScope)
{  
  try
  {
     showLoader();
     $rootScope.isnewpage=true;
      var servicePath=$rootScope.getglobaldata.getGlobalServiceUrl+"GetmessageviewDetails";                 
      var params = '{ "msgID":"' + ID + '"}'; 
      $http.post(servicePath, params).success(function (result) 
          {  
            $.loader('close');
            var msglist = result.d[0];  
            var epochMilliseconds = msglist.Publishedon.replace(/^\/Date\(([0-9]+)([+-][0-9]{4})?\)\/$/,'$1');
            var b = new Date(parseInt(epochMilliseconds,''));
            var c = new Date(b.toString());
            var curr_date = c.getDate();
            var curr_month = c.getMonth() + 1;
            var curr_year = c.getFullYear();
            var curr_h = c.getHours();
            var curr_m = c.getMinutes();
            var curr_s = c.getSeconds();
            var curr_offset = c.getTimezoneOffset() / 60;
            var publisheddate = curr_month.toString() + '/' + curr_date + '/' + curr_year; 
 
           $(".right_bg_cont_msgcenter").empty();    
             result = "<div class=\"view_alert\"><h1>" + "Message Center" + "</h1><p></br>" + msglist.MessageTitle + "</p></br><span style='font-size:15px;'>" + msglist.ShortDescription + "</br></br>" +  publisheddate + "</span></div>";           
           $(".right_bg_cont_msgcenter").html(result) ; 

           var serviceUrl=$rootScope.getglobaldata.getGlobalServiceUrl+"SaveReadMessageDetails"; 
           var serviceParam='{ "msgID": "' + ID + '", "CustomerID": "' + localStorage.getItem('StoredCustomerID') + '"}';
           $http.post(serviceUrl, serviceParam).success(function (result) 
            { 
                $.loader('close');
            }).error(function (serverResponse, status, headers, config) {
              $.loader('close');
              //alert("failure");
            });
       
        }).error(function (serverResponse, status, headers, config) {
          $.loader('close');
            //alert("failure");
        });
  }
  catch(e)
  {
    // stackTrace(e);
    stackTrace('messagecenterRightController','redirectTomsgView',e,$rootScope.getglobaldata.Client);
  }

}

function showSocial() { 
    $('[data-popup-target]').click(function () {
        $('html').addClass('overlay');
        var activePopup = $(this).attr('data-popup-target');
        $(activePopup).addClass('visible');

    });

    $(document).keyup(function (e) {
        if (e.keyCode == 27 && $('html').hasClass('overlay')) {
            clearPopup();
        }
    });

    $('.popup-exit').click(function () {
        clearPopup();

    });

    $('.popup-overlay').click(function () {
        clearPopup();
    });
}

function clearPopup() {
    $('.popup.visible').addClass('transitioning').removeClass('visible');
    $('html').removeClass('overlay');

    setTimeout(function () {
        $('.popup').removeClass('transitioning');
    }, 200);
}
function googPlus() {
    document.getElementById("hrefgplus").innerHTML = "<div class=\"g-page\" data-width=\"410\" data-href=\"https://plus.google.com/107087502395383715305/\" data-rel=\"publisher\"></div>";
}

// $(document).ready(function(){       
//         $('#twitter').contents().find('href').click(function(event) {
//             alert("demo only");

//             event.preventDefault();

//         }); 
// });


   
    


