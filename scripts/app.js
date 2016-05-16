"use strict";

// Graph constructor
function Graph(url, title, xLabel, yLabel, desc, type) {
  var thisGraph = this;
  this.url = url;
  this.title = title;
  this.xLabel = xLabel;
  this.yLabel = yLabel;
  this.desc = desc;
  this.type = type;
  this.data = [];

  this.render = function() {
    $("#title").text(thisGraph.title);
    $("#xLabel").text(thisGraph.xLabel);
    $("#yLabel").text(thisGraph.yLabel);
    $("#desc").html(thisGraph.desc);
    $("#graph").html("");
    if (thisGraph.type == 'bar') {
      drawBarGraph(thisGraph.data);
    }
  };

  $.getJSON(url)
  .then(function(data) {

    if (thisGraph.url == "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json") {
      // reformat GDP data
      thisGraph.data = data.data.map(function(val){
        return {xVal: val[0], yVal: val[1]};
      });

    } else if (thisGraph.url == "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json") {
      // reformat temp data
      thisGraph.data = data;
      thisGraph.baseTemp = data.baseTemperature;
      thisGraph.data = data.monthlyVariance;
      
    } else {
      thisGraph.data = data;
    }
  });
}

// instantiate graphs
var barGraph = new Graph(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",
  "USA Gross Domestic Product by Quarter",
  "Quarter",
  "GDP, Billions USD",
  "<p>Units: Billions of Dollars Seasonal</p><p>Adjustment: Seasonally Adjusted Annual Rate</p><p>Notes: A Guide to the National Income and Product Accounts of the United States (NIPA) - (http://www.bea.gov/national/pdf/nipaguid.pdf)</p>",
  "bar"
);

var scatterPlot = new Graph(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json",
  "Doping in Professional Bicycle Racing: 35 Fastest times up Alpe d'Huez Normalized to 13.8km distance",
  "Minutes behind fastest time",
  "Ranking",
  "<p>Sources:</p><ul><li>https://en.wikipedia.org/wiki/Alpe_d%27Huez</li><li>http://www.fillarifoorumi.fi/forum/showthread.php?38129-Ammattilaispy%F6r%E4ilij%F6iden-nousutietoja-%28aika-km-h-VAM-W-W-kg-etc-%29&p=2041608#post2041608</li><li>https://alex-cycle.blogspot.com/2015/07/alpe-dhuez-tdf-fastest-ascent-times.html</li><li>http://www.dopeology.org/</li></ul>",
  "scatter"
);

var heatMap = new Graph(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json",
  "Monthly Global Land-Surface Temperature 1753 - 2015",
  "Years",
  "Month",
  "<p>Temperatures are in Celsius and reported as anomalies relative to the Jan 1951-Dec 1980 average.</p><p>Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07</p>",
  "heat"
);

$(function(){

  // button event handlers
  $("#barBtn").click(function(e){
    barGraph.render();
  });

  $("#scatterBtn").click(function(e){
    scatterPlot.render();
  });

  $("#heatBtn").click(function(e){
    heatMap.render();
  });
});

function drawBarGraph(graphData) {
  // draw bar graph
  // expects data to be in the form: [{"xVal": xVal, "yVal": yVal},...]

  // Color variables
  var backgroundColor = '#fff';
  var barColor = 'lightblue'; // @todo pick a better color (and use hex code)
  var barOutline = 'lightBlue'; // @todo pick a better color (and use hex code)
  var barOutlineWidth = 1;
  var selectedBarColor = 'blue'; // @todo pick a better color (and use hex code)

  var margin = {top: 30, right: 10, bottom: 30, left: 80};

  // Set up graph and bar sizes 
  var graphWidth = $("#graph").width() - margin.left - margin.right;
  var graphHeight = $("#graph").height() - margin.top - margin.bottom;
  var barWidth = graphWidth / graphData.length;
  var barOffset = 2;

  // Massage the graph data into an easier to draw format
  // @todo change this to play more nicely with  bar graph data objects
  var yVals = [];
  var xVals = [];
  for (var i = 0; i < graphData.length; i++) {
    yVals.push(graphData[i].yVal);
    xVals.push(graphData[i].xVal);
  }

  var yScale = d3.scale.linear()
    .domain([0, d3.max(yVals)])
    .range([0, graphHeight]);

  var xScale = d3.scale.ordinal()
    .domain(d3.range(0, graphData.length))
    .rangeBands([0, graphWidth]);

  // Draw tooltip div
  d3.select('body').append('div')
    .attr('id', 'tooltip');

  // Draw the graph
  d3.select("#graph").append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom + 50)
    .style('background', backgroundColor)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')')
    .selectAll('rect').data(yVals)
    .enter().append('rect')
    .style({'fill': barColor, 'stroke': barOutline, 'stroke-width': barOutlineWidth})
    .attr('width', xScale.rangeBand())
    .attr('height', function(data, i) {return yScale(data);})
    .attr('x', function(data, i) {return xScale(i);})
    .attr('y', function(data) {return graphHeight - yScale(data);})

    .on('mouseover', function(data) {
      d3.select(this).style('fill', selectedBarColor);

      // show tooltip
      d3.select('#tooltip')
        .style('top', (event.pageY - 10) + 'px')
        .style('left', (event.pageX + 10) + 'px')
        .style('visibility', 'visible')
        .html("<p>GDP: $" + data + " Billion</p><p>Quarter:" + /* Quarter data goes here */ + "</p>");

    }).on('mouseout', function(data){
      d3.select(this).style('fill', barColor);
      // hide tooltip
      d3.select('#tooltip').style('visibility', 'hidden');
    });

  // Vertical guide
  var verticalGuideScale = d3.scale.linear()
    .domain([0, d3.max(yVals)])
    .range([graphHeight, 0]);

  var vAxis = d3.svg.axis()
    .scale(verticalGuideScale)
    .orient('left')
    .ticks(16)
    .tickFormat(function(i){return "$ " + i + " B"});

  var verticalGuide = d3.select('svg').append('g');
  vAxis(verticalGuide);
  verticalGuide.attr('transform', 'translate(' + margin.left + ', ' + margin.top + ')');
  verticalGuide.selectAll('path').style({fill: 'none', stroke: "#000"});
  verticalGuide.selectAll('line').style({stroke: "#000"});

  // Horizontal Guide
  var horizontalGuideScale = d3.scale.ordinal()
    .domain(d3.range(0, graphData.length, 6))
    .rangeRoundBands([0, graphWidth]);

  var hAxis = d3.svg.axis()
    .scale(horizontalGuideScale)
    .orient('bottom')
    .tickFormat(function(i){ return xVals[i].split("-")[0];})

  var horizontalGuide = d3.select('svg').append('g');
  hAxis(horizontalGuide);
  horizontalGuide.attr('transform', 'translate(' + margin.left + ',' + (graphHeight + margin.top) + ')');
  horizontalGuide.selectAll('path').style({fill: 'none', stroke: '#000'});
  horizontalGuide.selectAll('line').style({stroke: '#000'});
  horizontalGuide.selectAll('text').attr('class', 'rotatedText');
}
