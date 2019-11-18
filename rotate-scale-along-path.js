var w = 800
var h = 800

var rotateAngle = 20

var svg = d3.select("#graph").append("svg")
    .attr("width", w)
    .attr("height", h)

// draw the rectangle that turns
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + w / 2 + "," + h / 2 + ")")

//just circle for reference,           
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", w / 4)
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
    .attr('width', w / 4)
    .attr('height', 2)
    .transition()
    .delay(1000)
    .duration(10000)
    .attr("transform", "rotate(" + rotateAngle + " 0 0)")

graphContainer.append('rect')
    .attr('x', -w / 4)
    .attr('y', 0)
    .attr('width', w / 4)
    .attr('height', 2)
    .transition()
    .delay(1000)
    .duration(10000)
    .attr("transform", "rotate(" + rotateAngle + " 0 0)")

//to draw an arc that is a path, use math to generate a list of x y points along an arc      
function createNodes(numNodes, radius) {//http://bl.ocks.org/bycoffe/3404776
    var nodes = [],
        width = (radius * 2) + w / 2,
        height = (radius * 2) + w / 2,
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
var points = createNodes(20, w / 4)
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
var stemH = 30

var left = svg.append("g")
left.append("rect")
    .attr("x", w / 4) //Starting x
    .attr("y", w / 2 - stemH) //Starting y
    .attr("height", stemH)
    .attr("width", 2)
    .attr("id", "leftStem")
    .attr("fill", "purple")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenLeft(path) })
left.append("rect")
    .attr("x", w / 4 - stemH / 2) //Starting x
    .attr("y", w / 2 - stemH) //Starting y
    .attr("height", 2)
    .attr("width", stemH)
    .attr("id", "leftPlate")
    .attr("fill", "blue")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenLeft(path) })


//!!! this is where we draw the handle first   
//!!! this is the vertical   
var right = svg.append("g")
right.append("rect")
    .attr("x", w * 3 / 4) //!!! Starting x - these will have to be updated in the tween function below for the right
    .attr("y", w / 2 - stemH) //!!! Starting y- these will have to be updated in the tween function below for the right
    .attr("height", stemH)
    .attr("width", 2)
    .attr("id", "rightStem")
    .attr("fill", "red")
    .transition()
    .delay(1000)
    .duration(10000)
    .tween("pathTween", function () { return pathTweenRight(path) })


//!!! this is the horizontal line
right.append("rect")
    .attr("x", w * 3 / 4 - stemH / 2) //Starting x- these will have to be updated in the tween function below for the right
    .attr("y", w / 2 - stemH) //Starting y- these will have to be updated in the tween function below for the right
    .attr("height", 2)
    .attr("width", stemH)
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
            .attr("y", point.y - stemH * 1.5) //!!!! Set the y as well

        //this is the horizontal one
        d3.select("#rightPlate") //!!! Select the horizontal one i called it plate
            .attr("x", point.x - stemH / 2) //!!! Set the x
            .attr("y", point.y - stemH * 1.5) //!!! Set the y
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
            .attr("x", point.x - stemH / 2) // Set the cx
            .attr("y", point.y) // Set the cy
    }
}
