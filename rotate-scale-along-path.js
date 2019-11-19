// these are all modifiable parameters to change dimensions in visualization

var svgWidth = 800
var svgHeight = 800
var rotateAngle = -45
var centerCircleRadius = 10
var stemHeight = 60
var stemWidth = 4
var plateHeight = 4
var plateWidth = 110
var stemOffset = 3
//stem offset makes it look more like the stems are really attached to the scale– there is a tiny gap otherwise

var svg = d3.select("#graph").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// create svg container
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")

//draw circle– turning scale should move along this as a path           
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", svgWidth / 4)
    .attr("opacity", .1)

// draw right arm of scale     
rightArm = graphContainer.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', 2)
    .attr('id', 'rightArm')

// draw left arm of scale
leftArm = graphContainer.append('rect')
    .attr('x', -svgWidth / 4)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', 2)
    .attr('id', 'leftArm')

// create small svg container for stem and plate unit on left side
var leftContainer = svg.append("g")
// draw left stem and assign it a starting position
var leftStem = leftContainer.append("rect")
    .attr("x", svgWidth / 4 - stemWidth / 2) //Starting x
    .attr("y", svgHeight / 2 - stemHeight + stemOffset) //Starting y
    .attr("height", stemHeight)
    .attr("width", stemWidth)
    .attr("id", "leftStem")
    .attr("fill", "black")
// draw left plate and assign it a starting position
var leftPlate = leftContainer.append("rect")
    .attr("x", svgWidth / 4 - plateWidth / 2) //Starting x
    .attr("y", svgHeight / 2 - stemHeight + stemOffset) //Starting y
    .attr("height", plateHeight)
    .attr("width", plateWidth)
    .attr("id", "leftPlate")
    .attr("fill", "black")

// do the same thing for the other side:
// create small svg container for stem+plate unit on right side
var rightContainer = svg.append("g")
// draw right stem and assign it a starting position
var rightStem = rightContainer.append("rect")
    .attr("x", svgWidth * 3 / 4 - stemWidth / 2)
    .attr("y", svgWidth / 2 - stemHeight + stemOffset)
    .attr("height", stemHeight)
    .attr("width", stemWidth)
    .attr("id", "rightStem")
    .attr("fill", "black")
// draw right plate and assign it a starting position
var rightPlate = rightContainer.append("rect")
    .attr("x", svgWidth * 3 / 4 - plateWidth / 2)
    .attr("y", svgWidth / 2 - stemHeight + stemOffset)
    .attr("height", plateHeight)
    .attr("width", plateWidth)
    .attr("id", "rightPlate")
    .attr("fill", "black")


//draw circle at center of scale
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", centerCircleRadius)
    .attr("opacity", 1)
    // make mouseover of scale center interactive, so it feels like a button
    .on("mouseover", function () {
        d3.select(this).attr("fill", "red")
    })
    .on("mouseout", function () {
        d3.select(this).attr("fill", "black");
    })
    // when scale center is clicked, turn scale by rotateAngle parameter
    // can change this parameter above
    .on("click", function () {
        // rotate left arm of scale
        d3.select("#leftArm")
            .transition()
            .duration(10000)
            .attr("transform", "rotate(" + rotateAngle + " 0 0)");

        // rotate right arm of scale
        d3.select("#rightArm")
            .transition()
            .duration(10000)
            .attr("transform", "rotate(" + rotateAngle + " 0 0)");

        d3.select("#leftStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(path) })

        d3.select("#leftPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(path) })

        d3.select("#rightStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(path) })

        d3.select("#rightPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(path) })
    })


//generate a series of nodes around the circle
// visualize them with circles to be sure it's working as it should
// we want two circles at 0 and π radians that line up with where the scale starts
function createNodes(numNodes, radius) {
    var nodes = [],
        width = (radius * 2) + svgWidth / 2,
        height = (radius * 2) + svgWidth / 2,
        angle,
        x,
        y,
        i;
    for (i = 0; i < numNodes + 1; i++) {
        angle = (i / (numNodes / 2)) * Math.PI - Math.PI / 2;
        x = (radius * Math.cos(angle)) + (width / 2);
        y = (radius * Math.sin(angle)) + (width / 2);
        nodes.push([x, y]);
        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("fill", "purple")
            .attr("r", 3)
    }
    return nodes;
}
var points = createNodes(20, svgWidth / 4)

//draw these points as a regular d3.line path
var path = svg.append("path")
    .data([points])
    .attr("d", d3.line().curve(d3.curveCardinal))
    .style("stroke", "red")
    .attr("opacity", .3)
    .style("fill", "none");

function pathTweenRight(path) {
    var length = path.node().getTotalLength();
    // Get the length of the path
    var r = d3.interpolate(length / 4, length / 4 + length * rotateAngle / 360);
    //Set up interpolation from 0 to the path length
    return function (t) {
        var point = path.node().getPointAtLength(r(t));
        // Get the next point along the path

        d3.select("#rightStem")
            // select right stem
            .attr("x", point.x - stemWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)

        //this is the horizontal one
        d3.select("#rightPlate")
            .attr("x", point.x - plateWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
    }
}

// do basically the same thing with some small coordinate changes for the left side
function pathTweenLeft(path) {
    var length = path.node().getTotalLength();
    var r = d3.interpolate(length * 3 / 4, length * 3 / 4 + length * rotateAngle / 360);
    return function (t) {
        var point = path.node().getPointAtLength(r(t));
        d3.select("#leftStem")
            .attr("x", point.x - stemWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.select("#leftPlate")
            .attr("x", point.x - plateWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
    }
}

