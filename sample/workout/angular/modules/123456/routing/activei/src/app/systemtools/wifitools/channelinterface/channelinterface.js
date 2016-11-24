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
angular.module('activei.channelinterface', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('channelinterface', {
        url: '/channelinterface',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/channelinterface/channelinterface.tpl.html",
                controller: "channelinterfaceController"
            }
        },
        data: { pageTitle: 'Channel Interface' }
    });
})
/**
* And of course we define a controller for our route.
*/

.controller('channelinterfaceController', function channelinterfaceController($scope, $rootScope, $http, $state, $cookieStore, $filter) {
    $rootScope.isMiddleCont = true;
    $scope.loadWifiChannelDetails = function () {
        try{
        var results = "false";
        window.external.wifi_dBm();
        results = window.external.getCurrentWifiChannels();
        if (results === "false") {
            $("#wifiChannel").append("No Wi-Fi access points found.");
        }
        else {
            $("#wifiChannel").append(results);
            $("#wifiChannelTbl").slimScroll({
                wheelStep: 1,
                width: "100%",
                height: "23vw",
                display: "none"
            });
        }
        } catch (e) {
        // stackTrace(e);
        stackTrace('channelinterfaceController','loadWifiChannelDetails ',e,offlineGlobalData.Client);
    }
    };
}); 
    
 
 
    


