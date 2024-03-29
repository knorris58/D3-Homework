var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 40,
  right: 40,
  bottom: 80,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv")
  .then(function(data) {


    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(data1) {
        data1.healthcare = +data1.healthcare;
        data1.poverty = +data1.poverty;
      });
  
      // Step 2: Create scale functions
      // ==============================
      var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.poverty), d3.max(data, d => d.poverty)])
        .range([0, width]);
  
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d=>d.healthcare), d3.max(data, d => d.healthcare)])
        .range([height, 0]);
  
      // Step 3: Create axis functions
      // ==============================
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      // Step 4: Append Axes to the chart
      // ==============================
      chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
  
      chartGroup.append("g")
        .call(leftAxis);
  
      // Step 5: Create Circles
      // ==============================
      var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "13")
      .attr("fill", "blue")
      .attr("opacity", ".5");

      var textG=chartGroup.selectAll(".stateText")
        .data(data)
        .enter()
        .append("text")
        .attr("x",d=> xLinearScale(d.poverty))
        .attr("y",d=> yLinearScale(d.healthcare))
        .text(d=>(d.abbr))
        .attr("class", "stateText")
        .attr("font-size","10px")
        .attr("text-anchor","middle")
        .attr("fill","white")
  
      // Step 6: Initialize tool tip
      // ==============================
      var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
          return (`${d.state}<br>Healthcare: ${d.healthcare}<br>Poverty: ${d.poverty}`);
        });
  
      // Step 7: Create tooltip in the chart
      // ==============================
      chartGroup.call(toolTip);
  
      // Step 8: Create event listeners to display and hide the tooltip
      // ==============================
      circlesGroup.on("click", function(data) {
        toolTip.show(data, this);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
  
      // Create axes labels
      chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("In Poverty (%)");
  
      chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");
    });
  