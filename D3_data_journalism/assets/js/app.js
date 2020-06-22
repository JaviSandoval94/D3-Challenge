// Adjust svg container dimensions to the page
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

// Select scatter element and create SVG wrapper
var svg = d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Append SVG group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Declare starting parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";
var radius = 8

// Define scale functions based on the axes selections
function xScale (myData, chosenXAxis){
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d => d[chosenXAxis]) * 0.8,
            d3.max(myData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
};

function yScale (myData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(myData, d => d[chosenYAxis]) * 0.8,
            d3.max(myData, d => d[chosenYAxis]) * 1.1
        ])
        .range([height, 0]);
    return yLinearScale;
};

// Declare function for updating x and y axes upon selection
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    
    return xAxis;
};

function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis;
};

// Declare function to transport circles based on axes selection
function renderCircles(circlesGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]))
        .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
};

// Declare function to transport state labels based on the axes selection
function renderLabels(labelsGroup, newXScale, newYScale, chosenXAxis, chosenYAxis) {
    labelsGroup.transition()
        .duration(1000)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]) + radius / 3);
    return labelsGroup;
};

// Declare function to update tooltip based on the axes selection
function updateToolTip(chosenXAxis, chosenYAxis, labelsGroup) {
    var xLabelTool;
    var yLabelTool;
    // x-Axis cases
    switch (chosenXAxis) {
        case "poverty": xLabelTool = "Poverty (%):";
            break;
        case "age": xLabelTool = "Median age:";
            break;
        case "income": xLabelTool = "Median household income:";
            break;
    }
    // y-Axis cases
    switch (chosenYAxis) {
        case "healthcare": yLabelTool = "Lacks healthcare (%):";
            break;
        case "smokes": yLabelTool = "Smokes (%):";
            break;
        case "obesity": yLabelTool = "Obesity (%):";
            break;
    }

    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([80, -60])
        .html(function(d) {
            return (`${d.state}<br>${xLabelTool} ${d[chosenXAxis]}<br>${yLabelTool} ${d[chosenYAxis]}`)
        });
    // Declare handlers 
    labelsGroup.call(toolTip);
    labelsGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return labelsGroup;
}

// Call data csv and plot initial parameters
d3.csv("assets/data/data.csv").then(function(myData, err) {
    if (err) throw err;
    // Parse data
    myData.forEach(function (data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.obese = +data.obesity;
        data.income = +data.income;
    });
    // Assign scales based on initial selected values
    var xLinearScale = xScale(myData, chosenXAxis);
    var yLinearScale = yScale(myData, chosenYAxis);
    // Select axis scaless based on initial selected values
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale); 
    // Append axes to SVG group 
    var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    
    var yAxis = chartGroup.append("g")
        .call(leftAxis);
    // Render circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(myData)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", radius)
    // Render state labels
    var labelsGroup = chartGroup.selectAll(".stateText")
        .data(myData)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + radius / 3)
        .attr("font-size", radius)
        .text(d => d.abbr);
    // Create x axis labels and append to an SVG group
    var xLabels = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
    var povertyLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .classed("active", true)
        .text("In Poverty (%)");

    var ageLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .classed("inactive", true)
        .attr("value", "age")
        .text("Age (Median)");

    var incomeLabel = xLabels.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .classed("inactive", true)
        .attr("value", "income")
        .text("Household Income (Median)");

    // Create y axis labels and append to an SVG group
    var yLabels = chartGroup.append("g")
        .attr("transform", "rotate(-90)");

    var obesityLabel = yLabels.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("inactive", true)
        .attr("value", "obesity")
        .text("Obese (%)");

    var smokesLabel = yLabels.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "2em")
        .classed("inactive", true)
        .attr("value", "smokes")
        .text("Smokes (%)");

    var healthcareLabel = yLabels.append("text")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "3em")
        .classed("active", true)
        .attr("value", "healthcare")
        .text("Lacks Healthcare (%)");

    // Create tooltips based on current selection
    var labelsGroup = updateToolTip(chosenXAxis, chosenYAxis, labelsGroup);

    // Assign on click handlers to x-axis labels.
    xLabels.selectAll("text")
        .on("click", function() {
            // Get value from HTML element.
            var value = d3.select(this).attr("value");
            // Validate chosen value and perform plotting functions based on selection.
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(myData, chosenXAxis);
                xAxis = renderXAxis(xLinearScale, xAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                labelsGroup = renderLabels(labelsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                labelsGroup = updateToolTip(chosenXAxis, chosenYAxis, labelsGroup);
                // Chance class to active or inactive based on selection.
                switch (chosenXAxis){
                    case "poverty": (
                                        povertyLabel.classed("active", true).classed("inactive", false),
                                        ageLabel.classed("active", false).classed("inactive", true),
                                        incomeLabel.classed("active", false).classed("inactive", true)
                                    )
                    break;
                    case "age":     (
                                        povertyLabel.classed("active", false).classed("inactive", true),
                                        ageLabel.classed("active", true).classed("inactive", false),
                                        incomeLabel.classed("active", false).classed("inactive", true)
                                    )
                    break;
                    case "income":  (
                                        povertyLabel.classed("active", false).classed("inactive", true),
                                        ageLabel.classed("active", false).classed("inactive", true),
                                        incomeLabel.classed("active", true).classed("inactive", false)
                                    )
                    break;
                }
            }
        });
    // Repeat for y-axis labels
    yLabels.selectAll("text")
        .on("click", function() {
            var value = d3.select(this).attr("value");
            console.log(`Selected Y value: ${value}`);
            if (value !== chosenYAxis) {
                chosenYAxis = value;
                yLinearScale = yScale(myData, chosenYAxis);
                yAxis = renderYAxis(yLinearScale, yAxis);
                circlesGroup = renderCircles(circlesGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                labelsGroup = renderLabels(labelsGroup, xLinearScale, yLinearScale, chosenXAxis, chosenYAxis);
                labelsGroup = updateToolTip(chosenXAxis, chosenYAxis, labelsGroup);
                switch (chosenYAxis){
                    case "smokes":      (
                                            smokesLabel.classed("active", true).classed("inactive", false),
                                            healthcareLabel.classed("active", false).classed("inactive", true),
                                            obesityLabel.classed("active", false).classed("inactive", true)
                                        )
                    break;
                    case "healthcare":  (
                                            smokesLabel.classed("active", false).classed("inactive", true),
                                            healthcareLabel.classed("active", true).classed("inactive", false),
                                            obesityLabel.classed("active", false).classed("inactive", true)
                                        )
                    break;
                    case "obesity":     (
                                            smokesLabel.classed("active", false).classed("inactive", true),
                                            healthcareLabel.classed("active", false).classed("inactive", true),
                                            obesityLabel.classed("active", true).classed("inactive", false)

                                        )
                    break;
                }
            }
        })
});