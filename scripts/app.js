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
    var temp = "";
    temp += "<h2 id='title'>"+thisGraph.title+"</h2><br>";
    temp += "<p id='yLabel'>"+thisGraph.yLabel+"</p>";
    temp += "<div id='graph'></div>";
    temp += "<p id='xLabel'>"+thisGraph.xLabel+"</p><br>";
    temp += "<div id='desc'>"+thisGraph.desc+"</div>";
    $("#graphContainer").html(temp);
  };

  $.getJSON(url)
  .then(function(data) {

    if (thisGraph.url == "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json") {
      // reformat GDP data
      thisGraph.data = data.data.map(function(val){
        return {quarter: val[0], value: val[1]};
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
