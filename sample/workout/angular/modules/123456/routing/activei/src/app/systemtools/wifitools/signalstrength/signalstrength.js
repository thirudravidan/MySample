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
angular.module('activei.signalstrength', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('signalstrength', {
        url: '/signalstrength',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/signalstrength/signalstrength.tpl.html",
                controller: "signalstrengthController"
            }
        },
        data: { pageTitle: 'Signal Strength' }
    });
})
/**
 
 * And of course we define a controller for our route.
 */


.controller('signalstrengthController', function signalstrengthController($scope, $rootScope, $http, $state, $cookieStore) {
    $rootScope.isMiddleCont = true;
    $scope.drawChart = function () {
        try{
        window.external.wifi_dBm();
        var isconnected = "false";
        isconnected = window.external.getWiFiGraph();
        if (isconnected === "false") {
           document.getElementById('wifidiv').style.display = "none";
            $("#wifiAnalytics").append("No Wi-Fi access points found.");
        }
        else {
            document.getElementById('wifidiv').style.display = "block";
            var jsonResult = parseJSON(isconnected);
            jsonResult = JSON.parse(jsonResult);
            renderLiveGraph(jsonResult);
        }
        } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','drawChart ',e,offlineGlobalData.Client);
    }
    };
}); 

function parseJSON(results) {   
    try{
    var jsonString = results.split(',');
    var jsonResult = '[';
    for (var i = 0; i <= jsonString.length; i++) {
        if (jsonString[i] !== "" && jsonString[i] !== undefined && jsonString[i + 1] !== "" && jsonString[i + 1] !== undefined) {
            jsonResult += '{"_id":"' + jsonString[i] + '",' + '"dBm":' + jsonString[i + 1] + '},';
            i = i + 1;
        }
    }
    var jsonval = jsonResult.slice(0, jsonResult.lastIndexOf(","));
    jsonResult = jsonval + ']';    
    return jsonResult;
    } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','parseJSON ',e,offlineGlobalData.Client);
    }
}

function renderLiveGraph(jsonData) {
    try{
    var divId = "#wifiAnalytics";
    VIZ.stackBarChart(divId, $.extend(true, [], jsonData));
    $(".rdowifi").click(function () {
        if (this.id == 'sbar') {
            VIZ.stackBarChart(divId, $.extend(true, [], jsonData));
            VIZ.onResize();
        } else if (this.id == 'line') {
            VIZ.lineChart(divId, jsonData);
            VIZ.onResize();
        } else if (this.id == 'area') {
            VIZ.stackChart(divId, jsonData, 'zero');
            VIZ.onResize();
        } else {
            VIZ.stackChart(divId, jsonData, 'wiggle');
            VIZ.onResize();
        }
    });

    VIZ.onResize();
    $(window).on("resize", function () {
      //  VIZ.onResize();
    });
    } catch (e) {
        // stackTrace(e);
        stackTrace('signalstrengthController','renderLiveGraph ',e,offlineGlobalData.Client);
    }
}
