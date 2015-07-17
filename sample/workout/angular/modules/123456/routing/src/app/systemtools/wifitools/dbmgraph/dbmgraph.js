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
angular.module('activei.dbmgraph', ['ui.router', 'plusOne'])

/**
* Each section or module of the site can also have its own routes. AngularJS
* will handle ensuring they are all available at run-time, but splitting it
* this way makes each module more "self-contained".
*/
.config(function config($stateProvider) {
    $stateProvider.state('dbmgraph', {
        url: '/dbmgraph',
        views: {
            "RightView": {
                templateUrl: "systemtools/wifitools/dbmgraph/dbmgraph.tpl.html",
                controller: "dbmgraphController"
            }
        },
        data: { pageTitle: 'dBm Graph' }
    });
})
/**
 * And of course we define a controller for our route.
 */
.controller('dbmgraphController', function dbmgraphController($scope, $rootScope, $http, $state, $cookieStore, $interval) {
    $rootScope.isMiddleCont = true;

    $scope.initializeGuage = function () {
      try{
        window.external.wifi_dBm();
        createGauges();
        //setInterval(updateGauges, 200);
        } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','initializeGuage ',e,offlineGlobalData.Client);
    }

    };
    
});

function updateLables() {
  try{
    wifiname=window.external.getWifiname();
    sigquality = window.external.getsigquality();
    if(wifiname === ""){
      document.getElementById("dbmdisplay").style.display="none";
      document.getElementById("dbmhide").style.display="block";
    }
    else
    {
       document.getElementById("dbmdisplay").style.display="block";
       document.getElementById("dbmhide").style.display="none";
       $("#wifiname").text(wifiname);
     $("#signalquality").text(sigquality);  
    }
    
     } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','updateLables ',e,offlineGlobalData.Client);
    }
     
}   
 var gauges = [];
      
function createGauge(name, label, min, max)
{
  try{
  var config = 
  {
    size: 200,
    label: label,
    min: undefined !== min ? min : -100,
    max: undefined !== max ? max : 0,
    minorTicks: 5
  };
  
  var range = config.max - config.min;
  config.yellowZones = [{ from: config.min + range*0.75, to: config.min + range*0.9 }];
  config.redZones = [{ from: config.min + range*0.9, to: config.max }];
  
  gauges[name] = new Gauge(name + "GaugeContainer", config);
  gauges[name].render();
  } catch (e) {
        // stackTrace(e);
        stackTrace('dbmgraphController','createGauge ',e,offlineGlobalData.Client);
    }
}

function createGauges()
{
  createGauge("network", "");
  /*createGauge("cpu", "CPU");
  createGauge("network", "Network");*/
  //createGauge("test", "Test", -100, 0 );
}
      
function updateGauges(datavalue)
{
  for (var key in gauges)
  {
   // var value = getRandomValue(gauges[key]);
    var value=datavalue;
    gauges[key].redraw(value);
  }
}

function getRandomValue(gauge)
{
  var overflow = 0;
  return gauge.config.min - overflow + (gauge.config.max - gauge.config.min + overflow*2) *  Math.random();
}
 
 
    


