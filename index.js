var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 700 - margin.left - margin.right,
    height = 750 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("pastdata.csv", function(data) {

  // X axis: scale and draw:
  var x = d3.scaleLinear()
      .domain([0, 300])     // can use this instead of 1000 to have the max of data: d3.max(data, function(d) { return +d.fire_duration })
      .range([0, width]);
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // set the parameters for the histogram
  var histogram = d3.histogram()
      .value(function(d) { return d.fire_duration; })   // I need to give the vector of value
      .domain(x.domain())  // then the domain of the graphic
      .thresholds(x.ticks(50)); // then the numbers of bins

  // And apply this function to data to get the bins
  var bins = histogram(data);

  // Y axis: scale and draw:
  var y = d3.scaleLinear()
      .range([height, 0]);
      y.domain([0, 250]);   // d3.hist has to be called before the Y axis obviously d3.max(bins, function(d) { return d.length; })
  svg.append("g")
      .call(d3.axisLeft(y));

  medianDuration = d3.median(data, function(d) { return d.fire_duration; });

  // append the bar rectangles to the svg element
  svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
        .attr("x", 1)
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", "#69b3a2")
        .style("fill", function(d){ if(d.x0>medianDuration){return "#fe657d"} else {return "#69b3a2"}})
    
  svg
  .append("line")
    .attr("x1", x(medianDuration) )
    .attr("x2", x(medianDuration) )
    .attr("y1", y(0))
    .attr("y2", y(240))
    .attr("stroke", "grey")
    .attr("stroke-dasharray", "4")
svg
  .append("text")
  .attr("x", x(medianDuration+20))
  .attr("y", y(240))
  .text("median fire duration: " + medianDuration)
  .style("font-size", "15px")

svg.append("text")
  .attr("class", "x label")
  .attr("text-anchor", "end")
  .attr("x", width)
  .attr("y", height + 30)
  .text("Wildfire Duration");

});

