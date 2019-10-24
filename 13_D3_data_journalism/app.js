var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 30,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating an SVG wrapper, append an SVG group to hold the chart, shift SVG group by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Importing the csv file
d3.csv("datafile.csv")
  .then(function(projectData) {

    // Parse Data/Cast as numbers

   
    projectData.forEach(function(data) {
      data.income = +data.income;
      data.poverty = +data.poverty;
    });
 
    //Creating the scale functions
   
    var xLinearScale = d3.scaleLinear()
      .domain([35000, d3.max(projectData, d => d.income+30)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(projectData, d => d.poverty+10)])
      .range([height, 0]);


 
    // Creating the axis functions
  
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //Appending the Axes to the chart
    
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Creating the Circles for Bubble Chart
  
    var gradient1 = svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", "gradient1")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  gradient1.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", "pink")
    .attr("stop-opacity", 0.5);

   gradient1.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", "pink")
    .attr("stop-opacity", 1);


    var circlesGroup = chartGroup.selectAll("circle")
    .data(projectData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.income))
    .attr("cy", d => yLinearScale(d.poverty))
    .attr("r", 30)
    .style("fill", "url(#gradient1)");
        
    
    
  


    //Initializing tool tip
   
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, 120])
      .html(function(d) {
        return (`<u><b>State:</b> ${d.state}</u><br><b>Income:</b> ${d.income}<br><b>Poverty:</b> ${d.poverty}`);
      });

      var toolTip1 = d3.tip()
      .attr("class", "tooltip1")
      .offset([80, 120])
      .html(function(d) {
        return ("hi");
      });

    //Creating tooltip in the Bubble chart
  
    chartGroup.call(toolTip);
    chartGroup.call(toolTip1);

    //Creating Event Listeners to display/hide the tooltip
    
  

    // Creating the mouseover event 
     circlesGroup.on("mouseover", function(data) {
      d3.select(this)
        .transition()
        .duration(0)
        .attr("r", 40)
        ;
        toolTip.show(data,this);
    })
      // Creating the onmouseout event
  
      circlesGroup.on("mouseout", function(data, index) {
         d3.select(this)
          .transition()
          .duration(100)
         .attr("r", 40)
        toolTip.hide(data);
        toolTip1.hide(data);
      });

  

       
    // Creating axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 15)
      .attr("x", 0 - (height / 2.5))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("State Poverty");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("State Income");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height - 427})`)
      .attr("class", "titleText")
      .text("Poverty vs Income By State")
  });

  

  ;(jQuery);