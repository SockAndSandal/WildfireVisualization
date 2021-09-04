var futureMargin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the SVG object to the body of the page
var SVG = d3.select("#future_charting")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("21-24_data.csv", function(data) {

  // X axis: scale and draw:
  var X = d3.scaleLinear()
      .domain([0, 300])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.fire_duration })
      .range([0, width]);
  SVG.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(X));

  // set the parameters for the histogram
  var hist2 = d3.histogram()
      .value(function(d) { return d.fire_duration; })   // I need to give the vector of value
      .domain(X.domain())  // then the domain of the graphic
      .thresholds(X.ticks(75)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = hist2(data);

  // Y axis: scale and draw:
  var Y = d3.scaleLinear()
      .range([height, 0]);
      Y.domain([0, 250]);   // d3.hist has to be called before the Y axis obviously d3.max(bins, function(d) { return d.length; })
  SVG.append("g")
      .call(d3.axisLeft(Y));

  medianDuration = d3.median(data, function(d) { return d.fire_duration; });

  // append the bar rectangles to the SVG element
  SVG.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + X(d.x0) + "," + Y(d.length) + ")"; })
        .attr("width", function(d) { return X(d.x1) - X(d.x0) -1 ; })
        .attr("height", function(d) { return height - Y(d.length); })
        .style("fill", "#69b3a2")
        .style("fill", function(d){ if(d.x0>medianDuration){return "#ACD49D"} else {return "#F8BE3D"}})
    
  SVG
  .append("line")
    .attr("x1", X(medianDuration) )
    .attr("x2", X(medianDuration) )
    .attr("y1", Y(0))
    .attr("y2", Y(240))
    .attr("stroke", "grey")
    .attr("stroke-dasharray", "4")
SVG
  .append("text")
  .attr("x", X(medianDuration+20))
  .attr("y", Y(240))
  .text("median fire duration: " + medianDuration)
  .style("font-size", "15px")

SVG.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height+30)
  .text("Wildfire Duration");

});

