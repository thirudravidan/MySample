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
angular.module( 'activei.networkspeed', ['ui.router','plusOne'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(function config( $stateProvider ) {
  $stateProvider.state( 'networkspeed', {
    url: '/networkspeed',
    views:{
       "RightView":{
        templateUrl:"systemtools/networktools/networkspeed/networkspeed.tpl.html",
        controller:"networkspeedController" 
    }
    },
    data:{ pageTitle: 'Network Speed' }
  });  
})
/**
 * And of course we define a controller for our route.
 */
 
.controller( 'networkspeedController', function networkspeedController( $scope ,$rootScope,$http,$state,$interval) {
  $rootScope.isMiddleCont = true;  
 var imageAddr = "http://www.kenrockwell.com/contax/images/g2/examples/31120037-5mb.jpg"; 
 
var downloadSize = 4995374; //bytes
$scope.uploadspeed=0;
$scope.downloadspeed=0;
$scope.initNetworkSpeed =function()
{
    
   /* var oProgress = document.getElementById("progress");
    oProgress.innerHTML = "Loading the image, please wait...";*/
    //var oProgress = document.getElementById("progress");
    //oProgress.innerHTML = "Loading the image, please wait...";
     showLoader();
     $rootScope.isNetworkSpeed=true;

     $interval(function() {
     // var downloadspeedMbps= measureDownloadSpeed();
     // var uploadspeedMbps= measureuploadSpeed(30);
      //debugger;
      // tick(downloadspeedMbps,uploadspeedMbps);
      
      $.loader('close');
      if ($rootScope.isNetworkSpeed) {
        window.external.getUploadTransferRate();  
        measureConnectionSpeed();
      }
       // window.external.getUploadTransferRate();  
       //  measureConnectionSpeed();
     }, 5000);
//JUST AN EXAMPLE, PLEASE USE YOUR OWN PICTURE!




function measureConnectionSpeed() {
    $scope.uploadspeed=window.external.getUploadingrate();
    $scope.downloadspeed=window.external.getDownloadingrate();
    tick($scope.downloadspeed,$scope.uploadspeed);
    //var oProgress = document.getElementById("progress");
    /*var startTime, endTime;
     startTime = (new Date()).getTime();
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };
    
    download.onerror = function (err, msg) {
        //oProgress.innerHTML = "Invalid image, or error downloading";
    };
    
   
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        $scope.downloadspeed=speedMbps;
        $scope.uploadspeed=window.external.getUploadingrate();
        tick(speedMbps,$scope.uploadspeed);
       /* oProgress.innerHTML = "Your connection speed is: <br />" + 
           speedBps + " bps<br />"   + 
           speedKbps + " kbps<br />" + 
           speedMbps + " Mbps<br />";
    }*/
}

/*function checkUploadSpeed( iterations, update ) {
    var average = 0,
        index = 0,
        timer = window.setInterval( check, 5000 ); //check every 5 seconds
    check();
    
    function check() {
        var xhr = new XMLHttpRequest(),
            url = '?cache=' + Math.floor( Math.random() * 10000 ), //prevent url cache
            data = getRandomString( 1 ), //1 meg POST size handled by all servers
            uploadstartTime,
            speed = 0;
        xhr.onreadystatechange = function ( event ) {
            if( xhr.readyState === 4 ) {
                speed = Math.round( 1024 / ( ( new Date() - uploadstartTime ) / 1000 ) );
                if(average === 0 )
                {
                 average = speed ;
                }
                else
                {
                 average = Math.round( ( average + speed ) / 2 );
                }
                update( speed, average );
                index++;
                if( index === iterations ) {
                    window.clearInterval( timer );
                }
            }
        };
        xhr.open( 'POST', url, true );
        uploadstartTime = new Date();
        xhr.send( data );
    }
    
    function getRandomString( sizeInMb ) {
        var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+`-=[]{}|;':,./<>?", //random data prevents gzip effect
            iterations = sizeInMb * 1024 * 1024, //get byte count
            result = '';
        for( var index = 0; index < iterations; index++ ) {
            result += chars.charAt( Math.floor( Math.random() * chars.length ) );
        }    
        return result;
    }
}

checkUploadSpeed( 30, function ( speed, average ) {
    document.getElementById( 'speed' ).textContent = 'speed: ' + speed + 'kbs';
    document.getElementById( 'average' ).textContent = 'average: ' + average + 'kbs';
} );
*/
/*
checkUploadSpeed( 30, function ( speed, average ) {
    document.getElementById( 'speed' ).textContent = 'speed: ' + speed + 'kbs';
    document.getElementById( 'average' ).textContent = 'average: ' + average + 'kbs';
} );*/



    var t = -1;
    var n = 10;
    var duration = 750;

    var data1 = initialise(); 
    var data2 = initialise();
    function initialise()
    {
        var time = -1;
        var arr = [];
        for (var i = 0; i < n; i++)
        {
            var obj = {
                time: time++,
                value:  0
            };
            arr.push(obj);
        }   
        t = time;
        return arr;
    }
    
    // push a new element on to the given array
    function updateData(a,speedVal)
    {
        var obj = {
            time:  t,  
            value: speedVal  //value: Math.floor(Math.random()*100)
        };
        a.push(obj);
    }
    
    var margin = {top: 10, right: 10, bottom: 20, left: 40},
        width = 580 - margin.left - margin.right,
        height = 380 - margin.top - margin.bottom;
     
    var x = d3.scale.linear()
        .domain([t-n+1, t])
        .range([0, width]);
     
    var y = d3.scale.linear()
        .domain([0, 10])
        .range([height, 0]);
     
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d, i) { return x(d.time); })
        .y(function(d, i) { return y(d.value); });
        
    var svg = d3.select(".networkSpeed").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
    // extra svg to clip the graph and x axis as they transition in and out
    var graph = g.append("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);   
    
    var xAxis = d3.svg.axis().scale(x).orient("bottom");
    var axis = graph.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(x.axis=xAxis);
     
    g.append("g")
        .attr("class", "y axis")
        .call(d3.svg.axis().scale(y).orient("left"));
     
    var path1 = graph.append("g")
        .append("path")
        .data([data1])
        .attr("class", "line1");
        
    var path2 = graph.append("g")
        .append("path")
        .data([data2])
        .attr("class", "line2");
    

    //tick();
        
    function tick(downloadSpeed,uploadSpeed) {
        t++;
        
        // push
        updateData(data1,downloadSpeed);
        updateData(data2,uploadSpeed);

        // update the domains
        x.domain([t - n + 2 , t]);
        
        // redraw the lines
        graph.select(".line1").attr("d", line).attr("transform", null);
        graph.select(".line2").attr("d", line).attr("transform", null);
        
        // slide the line left
        path1.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
        path2.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
       
            
         // slide the x-axis left
        axis.transition()
            .duration(duration)
            .ease("linear")
            .call(xAxis);
           // .each("end", tick);


       // data1.shift();
       //data2.shift();
       
        
    }
   /* function tick1(uploadSpeed) {
debugger;
        t++;
        
        // push
        //updateData(data1,downloadSpeed);
        updateData(data2,uploadSpeed);

        // update the domains
        x.domain([t - n + 2 , t]);
        
        // redraw the lines
       // graph.select(".line1").attr("d", line).attr("transform", null);
        graph.select(".line2").attr("d", line).attr("transform", null);
        
        // slide the line left
        path1.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
        path2.transition()
            .duration(duration)
            .ease("linear")
            .attr("transform", "translate(" + x(t-n+1) + ")");
            
       
            
         // slide the x-axis left
        axis.transition()
            .duration(duration)
            .ease("linear")
            .call(xAxis);
           // .each("end", tick);


       // data1.shift();
       //data2.shift();
       
        
    }*/
};

/*function measureConnectionSpeed() {
    var oProgress = document.getElementById("progress");
    var startTime, endTime;
    var download = new Image();
    download.onload = function () {
        endTime = (new Date()).getTime();
        showResults();
    };
    
    download.onerror = function (err, msg) {
        oProgress.innerHTML = "Invalid image, or error downloading";
    };
    
    startTime = (new Date()).getTime();
    var cacheBuster = "?nnn=" + startTime;
    download.src = imageAddr + cacheBuster;
    
    function showResults() {
        var duration = (endTime - startTime) / 1000;
        var bitsLoaded = downloadSize * 8;
        var speedBps = (bitsLoaded / duration).toFixed(2);
        var speedKbps = (speedBps / 1024).toFixed(2);
        var speedMbps = (speedKbps / 1024).toFixed(2);
        oProgress.innerHTML = "Your connection speed is: <br />" + 
           speedBps + " bps<br />"   + 
           speedKbps + " kbps<br />" + 
           speedMbps + " Mbps<br />";
    }
}*/

    
});



    


