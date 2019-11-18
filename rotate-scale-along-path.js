var svgWidth = 800
var svgHeight = 800

var rotateAngle = 20

var svg = d3.select("#graph").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// draw the rectangle that turns
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")

//just circle for reference,           
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", svgWidth / 4)
    .attr("opacity", .1)

//center circle
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 10)
    .attr("opacity", 1)


//draw 2 arms as separate, and rotate them            
graphContainer.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', 2)
    .transition()
    .delay(1000)
    .duration(10000)
    .attr("transform", "rotate(" + rotateAngle + " 0 0)")

graphContainer.append('rect')
    .attr('x', -svgWidth / 4)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', 2)
    .transition()
    .delay(1000)
    .duration(10000)
    .attr("transform", "rotate(" + rotateAngle + " 0 0)")

//to draw an arc that is a path, use math to generate a list of x y points along an arc      
function createNodes(numNodes, radius) {//http://bl.ocks.org/bycoffe/3404776
    var nodes = [],
        width = (radius * 2) + svgWidth / 2,
        height = (radius * 2) + svgWidth / 2,
        angle,
        x,
        y,
        i;
    for (i = 0; i < numNodes + 1; i++) {
        angle = (i / (numNodes / 2)) * Math.PI - 1.5; // Calculate the angle at which the element will be placed.
        console.log(angle)                // For a semicircle, we would use (i / numNodes) * Math.PI.
        x = (radius * Math.cos(angle)) + (width / 2); // Calculate the x position of the element.
        y = (radius * Math.sin(angle)) + (width / 2); // Calculate the y position of the element.
        nodes.push([x, y]);
    }
    return nodes;
}
var points = createNodes(20, svgWidth / 4)
console.log(points)

//draw these points as a regular d3.line path
var path = svg.append("path")
    .data([points])
    .attr("d", d3.line().curve(d3.curveCardinal))
    //.attr("d",arc)
    .style("stroke", "red")
    .attr("opacity", .3)
    .style("fill", "none");


//draw the little sticks for the plates left and right
var stemHeight = 30
var stemWidth = 2
var plateHeight = 2

var leftContainer = svg.append("g")
var leftStem = leftContainer.append("rect")
    .attr("x", svgWidth / 4) //Starting x
    .attr("y", svgWidth / 2 - stemHeight) //Starting y
    .attr("height", stemHeight)
    .attr("width", stemWidth)
    .attr("id", "leftStem")
    .attr("fill", "purple")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenLeft(path) })
var leftPlate = leftContainer.append("rect")
    .attr("x", svgWidth / 4 - stemHeight / 2) //Starting x
    .attr("y", svgWidth / 2 - stemHeight) //Starting y
    .attr("height", plateHeight)
    .attr("width", stemHeight)
    .attr("id", "leftPlate")
    .attr("fill", "blue")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenLeft(path) })


//!!! this is where we draw the handle first   
//!!! this is the vertical   
var rightContainer = svg.append("g")
var rightStem = rightContainer.append("rect")
    .attr("x", svgWidth * 3 / 4) //!!! Starting x - these will have to be updated in the tween function below for the right
    .attr("y", svgWidth / 2 - stemHeight) //!!! Starting y- these will have to be updated in the tween function below for the right
    .attr("height", stemHeight)
    .attr("width", stemWidth)
    .attr("id", "rightStem")
    .attr("fill", "red")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenRight(path) })


//!!! this is the horizontal line
var rightPlate = rightContainer.append("rect")
    .attr("x", svgWidth * 3 / 4 - stemHeight / 2) //Starting x- these will have to be updated in the tween function below for the right
    .attr("y", svgWidth / 2 - stemHeight) //Starting y- these will have to be updated in the tween function below for the right
    .attr("height", plateHeight)
    .attr("width", stemHeight)
    .attr("id", "rightPlate")
    .attr("fill", "red")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenRight(path) })

//move each one by tweening along path, these also uses the rotateAngle variable, 
// so whatever you set the angle to be at top, these will rotate along with arm
function pathTweenRight(path) {
    var length = path.node().getTotalLength(); // Get the length of the path
    var r = d3.interpolate(length / 4, length / 4 + length * rotateAngle / 360); //Set up interpolation from 0 to the path length
    return function (t) {
        var point = path.node().getPointAtLength(r(t)); // Get the next point along the path
        d3.select("#rightStem") // !!!Select vertical line
            .attr("x", point.x) //!!! Set the x tween at each point, play around with this number till it doesn't jump
            .attr("y", point.y - stemHeight * 1.5) //!!!! Set the y as well

        //this is the horizontal one
        d3.select("#rightPlate") //!!! Select the horizontal one i called it plate
            .attr("x", point.x - stemHeight / 2) //!!! Set the x
            .attr("y", point.y - stemHeight * 1.5) //!!! Set the y
    }
}

function pathTweenLeft(path) {
    var length = path.node().getTotalLength(); // Get the length of the path
    var r = d3.interpolate(length * 3 / 4, length * 3 / 4 + length * rotateAngle / 360); //Set up interpolation from 0 to the path length
    return function (t) {
        var point = path.node().getPointAtLength(r(t)); // Get the next point along the path
        d3.select("#leftStem") // Select the circle
            .attr("x", point.x) // Set the cx
            .attr("y", point.y) // Set the cy
        d3.select("#leftPlate") // Select the circle
            .attr("x", point.x - stemHeight / 2) // Set the cx
            .attr("y", point.y) // Set the cy
    }
}
