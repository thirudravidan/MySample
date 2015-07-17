function initChartVariables() {
    var margin = '';
    var x = '';
    var y = '';
    var xAxis = '';
    var yAxis = '';
    var svg = '';    
}
function initBar(divId) {
    initChartVariables();
    margin = { top: 20, right: 0, bottom: 0, left: 40 },
    width = 670; //1000 - margin.left - margin.right,
    height = 400; //300 - margin.top - margin.bottom;

    x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    y = d3.scale.linear()
      .rangeRound([height, 0]);

    xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    color = d3.scale.ordinal()
      .range(["#B0B0B0", "#4BCBFB", "#9E0566", "#7CB403", "#F9C800"]);    
    $(divId).html("");
    svg = d3.select(divId).append("svg")
      .attr("id", "thesvg")
      .attr("viewBox", "0 0 1000 600")
       .style("font-size", "1.5vw")
      .attr("width", 670) //width + margin.left + margin.right)
      .attr("height", 400)//height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
}
(function () {
    
    var VIZ = {};
    VIZ.stackChart = function (divId,data, offset) {
        initBar(divId);
        var stack = d3.layout.stack()
        .values(function (d) { return d.values; })
        .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
        .y(function (d) { return d.value; });

        var area = d3.svg.area()
        .interpolate("cardinal")
        .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
        .y0(function (d) { return y(d.y0); })
        .y1(function (d) { return y(d.y0 + d.y); });

        var labelVar = '_id';
        var varNames = d3.keys(data[0])
        .filter(function (key) { return key !== labelVar; });        
        color.domain(varNames);

        var seriesArr = [], series = {};
        varNames.forEach(function (name) {
            series[name] = { name: name, values: [] };
            seriesArr.push(series[name]);
        });

        data.forEach(function (d) {
            varNames.map(function (name) {
                series[name].values.push({ name: name, label: d[labelVar], value: +d[name] });
            });
        });

        x.domain(data.map(function (d) { return d._id; }));

        stack.offset(offset)
        stack(seriesArr);

//        y.domain([0, d3.max(seriesArr, function (c) {
//            return d3.max(c.values, function (d) { return d.y0 + d.y; });
//        })])
        
        y.domain([0, -100]);

        var selection = svg.selectAll(".series")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", "series");

       selection.append("path")
      .attr("class", "streamPath")
      .attr("d", function (d) { return area(d.values); })
      .style("fill", function (d) { return randomColor(); })
      .style("stroke", randomColor());

        var points = svg.selectAll(".seriesPoints")
      .data(seriesArr)
      .enter().append("g")
        .attr("class", "seriesPoints");

        points.selectAll(".point")
      .data(function (d) { return d.values; })
      .enter().append("circle")
       .attr("class", "point")
       .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
       .attr("cy", function (d) { return y(d.y0 + d.y); })
       .attr("r", "10px")
       .style("fill", function (d) { return color(d.name); })
       .on("mouseover", function (d) { showPopover.call(this, d); })
       .on("mouseout", function (d) { removePopovers(); })

        drawAxis();
        drawLegend(varNames);

        svg.selectAll(".x text") // select all the text elements for the xaxis
           .attr("dx", "-6.0em")
           .attr("dy", ".10em")
           .style("font-size","1.5vw")
           .attr("transform", function(d) {
                return "rotate(-90)" 
            });
    }

    VIZ.lineChart = function (divId,data) {
        initBar(divId);
        var line = d3.svg.line()
        .interpolate("cardinal")
        .x(function (d) { return x(d.label) + x.rangeBand() / 2; })
        .y(function (d) { return y(d.value); });

        var labelVar = '_id';
        var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar; });
        color.domain(varNames);

        var seriesData = varNames.map(function (name) {
            return {
                name: name,
                values: data.map(function (d) {
                    return { name: name, label: d[labelVar], value: +d[name] };
                })
            };
        });

        x.domain(data.map(function (d) { return d._id; }));
        y.domain([
      d3.min(seriesData, function (c) {
          return 0;
      }),
      d3.max(seriesData, function (c) {
          return -100;
      })
    ]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
         .style("font-size","1.5vw")
        //.style("font-size","1vw")
        .style("text-anchor", "end")
        .text("-dBm");

        var series = svg.selectAll(".series")
        .data(seriesData)
      .enter().append("g")
        .attr("class", "series");

        series.append("path")
      .attr("class", "line")
      .attr("d", function (d) { return line(d.values); })
      .style("stroke", function (d) { return color(d.name); })
      .style("stroke-width", "4px")
     // .style("font-size","34px")
      .style("fill", "none")

        series.selectAll(".linePoint")
      .data(function (d) { return d.values; })
      .enter().append("circle")
       .attr("class", "linePoint")
       .attr("cx", function (d) { return x(d.label) + x.rangeBand() / 2; })
       .attr("cy", function (d) { return y(d.value); })
       .attr("r", "5px")
       .style("fill", function (d) { return randomColor(); })
       .style("stroke", randomColor())
       .style("stroke-width", "1px")
       .on("mouseover", function (d) { showPopover.call(this, d); })
       .on("mouseout", function (d) { removePopovers(); })

        drawAxis();
        drawLegend(varNames);
         svg.selectAll(".x text") // select all the text elements for the xaxis
          .attr("dx", "-6.0em")
           .attr("dy", ".10em")
           .attr("transform", function(d) {
                return "rotate(-90)" 
            });
    }

    VIZ.stackBarChart = function (divId,data) {
        initBar(divId);
        var labelVar = '_id';
        var varNames = d3.keys(data[0]).filter(function (key) { return key !== labelVar; });
        color.domain(varNames);

        data.forEach(function (d) {
            var y0 = 0;
            d.mapping = varNames.map(function (name) {
                return {
                    name: name,
                    label: d[labelVar],
                    y0: y0,
                    y1: y0 += +d[name]
                };
            });
            d.total = d.mapping[d.mapping.length - 1].y1;
        });

        x.domain(data.map(function (d) { return d._id; }));
        //y.domain([0, d3.max(data, function (d) { return d.total; })]);
        y.domain([0, -100]);

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
         .style("font-size","1.5vw")
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("-dBm");

        var selection = svg.selectAll(".series")
        .data(data)
      .enter().append("g")
        .attr("class", "series")
        .attr("transform", function (d) { return "translate(" + x(d._id) + ",0)"; });

        selection.selectAll("rect")
      .data(function (d) { return d.mapping; })
    .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y", function (d) { return y(d.y1); })
      .attr("height", function (d) { return y(d.y0) - y(d.y1); })
      .style("fill", function (d) { return randomColor(); })
      .style("stroke", randomColor())
      .on("mouseover", function (d) { showPopover.call(this, d); })
      .on("mouseout", function (d) { removePopovers(); })

        drawAxis();
        drawLegend(varNames);
         svg.selectAll(".x text") // select all the text elements for the xaxis
           .attr("dx", "-6.0em")
           .attr("dy", ".10em")
           .attr("transform", function(d) {
                return "rotate(-90)" 
            });
    }

    VIZ.clearAll = function () {
        svg.selectAll("*").remove()
    }

    function drawAxis() {
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .style("font-size","1.5vw")
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("-dBm");
    }

    function drawLegend(varNames) {
        var legend = svg.selectAll(".legend")
        .data(varNames.slice().reverse())
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) { return "translate(55," + i * 20 + ")"; });

        legend.append("rect")
        .attr("x", width - 10)
        .attr("width", 10)
        .attr("height", 10)
        .style("fill", randomColor())
        .style("stroke", randomColor());

        legend.append("text")
        .attr("x", width - 12)
        .attr("y", 6)
        .attr("dy", ".35em")
         .style("font-size","1.5vw")
        .style("text-anchor", "end")
        .text(function (d) { return d; });
    }

    function removePopovers() {
        $('.popover').each(function () {
            $(this).remove();
        });
    }

    function showPopover(d) {
        $(this).popover({
            title: d.name,
            placement: 'auto top',
            container: 'body',
            trigger: 'manual',
            html: true,
            content: function () {
            var val="<label style='color:black; !important'>Wifi Name: " + d.label + 
               "</label><br/><label style='color:black; !important'>dBm: " + d3.format(",")(d.value ? d.value : d.y1 - d.y0) + "</label>";               
                return val;
            }
        });
        $(this).popover('show')
    }

    VIZ.onResize = function () {
        var aspect = 1000 / 500, chart = $("#thesvg");
        var targetWidth = chart.parent().width();
//        chart.attr("width", 500);
//        chart.attr("height", 320);
chart.attr("width", targetWidth);
        chart.attr("height", targetWidth / aspect);
    }

   

    window.VIZ = VIZ;

    var randomColor =function() {
    var letters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

} ())






