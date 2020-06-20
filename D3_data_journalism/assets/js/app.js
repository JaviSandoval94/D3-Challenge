// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// var chosenXAxis = "poverty";

// function xScale(xData, chosenXAxis) {
//     var xLinearScale = d3.scaleLinear()
//         .domain([d3.min(xData, d => d[chosenXAxis]) * 0.8,
//             d3.max(xData, d => d[chosenXAxis]) * 1.2
//         ])
//         .range([0, width]);

//     return xLinearScale;
// };

// function renderAxes(newXScale, xAxis) {
//     var bottomAxis = d3.axisBottom(newXScale);
    
//     xAxis.transition()
//         .duration(1000)
//         .call(bottomAxis);

//     return xAxis;
// }

// function renderCircles(circlesGroup, newXScale, chosenXAxis) {
//     circlesGroup.transition()
//         .duration(1000)
//         .attr("cx", d => newXScale(d[chosenXAxis]));
        
//     return circlesGroup;
// }

// function updateToolTip(chosenXAxis, circlesGroup) {
//     var label;
//     if (chosenXAxis == "poverty") {
//         label = "In Poverty (%)"
//     }
//     else {
//         label = "Age (Median)"
//     }
// }

d3.csv("assets/data/data.csv").then(function(myData){
    console.log(myData);

    myData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xScale = d3.scaleLinear()
        .domain([8, d3.max(myData, d => d.poverty)])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([4, d3.max(myData, d => d.healthcare)])
        .range([height, 0]);

    var xAxis = d3.axisBottom(xScale);
    var yAxis = d3.axisLeft(yScale);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    chartGroup.append("g")
        .call(yAxis);   
            
    var radius = 8    
    var circlesGroup = chartGroup.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", radius)
        //.html(`<text x="${d => xScale(d.poverty)}", y="${yScale(d.healthcare)}", class="stateText">${d => d.abbr}</text>`);

    var labelsGroup = chartGroup.selectAll("text")
        .data(myData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xScale(d.poverty))
        .attr("y", d => yScale(d.healthcare) + radius/3)
        .attr("font-size", radius)
        .text(d => (d.abbr) ? d.abbr: console.log("Not found"));

    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axisText", true)
        .text("Lacks healthcare (%)")

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .classed("axisText", true)
        .text("In Poverty (%)")
}).catch(function(error){
    console.log(error);
});