// these are all modifiable style parameters to change dimensions in visualization:
var svgWidth = 800
var svgHeight = 800
var centerCircleRadius = 10
var stemHeight = 60
var stemWidth = 4
var plateHeight = 10
var plateWidth = 110
var armHeight = 5
var stemOffset = 5 // makes it look more like the stems are really attached to the scale– there is a tiny gap otherwise
var fulcrumWidth = 20
var padding = 20
var doubleArmLength = svgWidth / 2

// ------------------------ these numbers are selection variables
// they will eventually be fed in from sharvari's code, read from csv
var billionaireWorth = 70300000000
var compareWorth = 2762628933
// --------------------------------//

var svg = d3.select("#graph").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

var resetButton = d3.select("#resetButton")
    .on("click", function(){
       layout.reload() 
    })

// create container for graph
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")

function setLeftValue(value) {
    billionaireWorth = value
}

function setRightValue(value) {
    compareWorth = value
}

// initialize current angle to 0
currentAngle = 0

//initialize click counters
leftPlateClickCount = 0
rightPlateClickCount = 0

// determine the ratio between the variables
function getCompareRatio() { return Math.ceil(billionaireWorth / compareWorth) }

// to make the comparison scalable, create scale with billionaire worth as upper limit
var angleScale = function (value) {
    const scalingFunction = d3.scaleLinear()
        .domain([0, billionaireWorth])
        .range([0, 45]);
    return scalingFunction(value)
}


// can change the numbers in this range to adjust small and large icon sizes
var iconRadiusScale = function (value) {
    const scalingFunction = d3.scaleLinear()
        .domain([0, billionaireWorth])
        .range([10, 70]);
    return scalingFunction(value)
}

// draw scale elements:

// draw right arm of scale     
rightArm = graphContainer.append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', armHeight)
    .attr('id', 'rightArm')

// draw left arm of scale
leftArm = graphContainer.append('rect')
    .attr('x', -svgWidth / 4)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', armHeight)
    .attr('id', 'leftArm')

//draw circle at center of scale
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", centerCircleRadius)
    .attr("opacity", 1)

// draw fulcrum of scale
fulcrumLeft = graphContainer.append('line')
    .attr('x1', -fulcrumWidth / 2)
    .attr('y1', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('x2', -2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")
fulcrumRight = graphContainer.append('line')
    .attr('x1', fulcrumWidth / 2)
    .attr('y1', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('x2', 2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")

// draw the floor
floor = graphContainer.append('line')
    .attr('x1', -doubleArmLength / 2)
    .attr('y1', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('x2', doubleArmLength / 2)
    .attr('y2', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('stroke-width', 4)
    .attr('stroke', "black")

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

rightInvisible = graphContainer.append('rect')
    // click on this invisible rectangle to turn scale left
    .attr('x', centerCircleRadius)
    .attr('y', -doubleArmLength / 2)
    .attr('width', svgWidth / 2)
    .attr('height', svgWidth / 2)
    .attr('opacity', 0)
    .on("click", function () {
        // keep track of how many times it has been clicked
        rightPlateClickCount += 1;
        if (rightPlateClickCount <= 1)
            // the first time it's clicked, generate the number of icons that would balance scale
            for (i = 0; i < getCompareRatio(); i += 1) {
                makeIcons(compareWorth, "R", i)
            }
        if (rightPlateClickCount <= getCompareRatio()) {
            // drop an icon each time it's clicked, until there are no more icons left
            dropCompareIcon(rightPlateClickCount - 1)
            // rotate arms each time an icon is dropped
            var rightRotateAngle = angleScale(compareWorth)
            rotateArms(rightRotateAngle)
        }
        // don't allow it to interact further once there are no more icons left to drop
        else if (rightPlateClickCount >= getCompareRatio()) {
            (console.log("no more clicks left!"))
        }
    })

leftInvisible = graphContainer.append('rect')
    // click on this invisible rectangle to turn scale left
    .attr('x', -centerCircleRadius - svgWidth / 2)
    .attr('y', -doubleArmLength / 2)
    .attr('width', svgWidth / 2)
    .attr('height', svgWidth / 2)
    .attr('opacity', 0)
    .on("click", function () {
        // keep track of how many times it has been clicked 
        leftPlateClickCount += 1;
        if (leftPlateClickCount <= 1) {
            // the first time it's clicked, create & drop the billionaire icon
            makeIcons(billionaireWorth, "L", 1)
            var leftRotateAngle = -angleScale(billionaireWorth)
            rotateArms(leftRotateAngle)
            dropBilliIcon()
        }
        // don't allow it to interact further if clicked more than once
        else if (leftPlateClickCount > 1) { (console.log("no more clicks left!")) }
    })

// the reset button reloads the page 
d3.select("#resetButton")
    .on("click", function () {
        location.reload()
    })


//rStartDeg = 90 and lStartDeg = 270 because of the coordinate system in the interpolation function

var currentRotation = 0
function rotateArms(rotateAngle) {

    lStartDeg = 270 + currentAngle
    lEndDeg = 270 + currentAngle + rotateAngle
    rStartDeg = 90 + currentAngle
    rEndDeg = 90 + currentAngle + rotateAngle

    currentRotation = currentRotation + rotateAngle

    // rotate left arm of scale
    d3.select("#leftArm")
        .transition()
        .duration(1000)
        .attr("transform", "rotate(" + (currentRotation) + " 0 0)");

    // rotate right arm of scale
    d3.select("#rightArm")
        .transition()
        .duration(1000)
        .attr("transform", "rotate(" + (currentRotation) + " 0 0)");

    d3.select("#leftStem")
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenLeft(path, lStartDeg, lEndDeg) })

    d3.select("#leftPlate")
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenLeft(path, lStartDeg, lEndDeg) })

    d3.select("#rightStem")
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenRight(path, rStartDeg, rEndDeg) })

    d3.select("#rightPlate")
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenRight(path, rStartDeg, rEndDeg) })

    currentAngle = currentAngle + rotateAngle

}

//generate a series of nodes around the circle
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
    }
    return nodes;
}
var points = createNodes(20, svgWidth / 4)

//draw these points as a regular d3.line path
var path = svg.append("path")
    .data([points])
    .attr("d", d3.line().curve(d3.curveCardinal))
    //.style("stroke", "red")
    .attr("opacity", 0)
    .style("fill", "none");


function pathTweenRight(path, startDeg, endDeg) {
    var length = path.node().getTotalLength();
    // Get the length of the path
    // convert rotate angle into radians
    var interpolationFn = d3.interpolate(length * startDeg / 360, length * endDeg / 360);
    //Set up interpolation from 0 to the path length
    return function (t) {
        var point = path.node().getPointAtLength(interpolationFn(t));
        // Get the next point along the path
        d3.select("#rightStem")
            .attr("x", point.x - stemWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.select("#rightPlate")
            .attr("x", point.x - plateWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.selectAll(".compareIcon")
            .each(function (d, i) {
                d3.select(this)
                    .attr("cx", point.x + 2 * (i % 4) * iconRadiusScale(compareWorth) - plateWidth / 3)
                    .attr("cy", point.y - 25 * Math.floor(i / 4) + stemOffset - doubleArmLength - plateHeight - stemHeight)
            })
    }
}

// do basically the same thing with some small coordinate changes for the left side

// should current angle & everything be going in here instead??
function pathTweenLeft(path, startDeg, endDeg) {
    var length = path.node().getTotalLength();
    var interpolationFn = d3.interpolate(length * startDeg / 360, length * endDeg / 360);
    return function (t) {
        var point = path.node().getPointAtLength(interpolationFn(t));
        d3.select("#leftStem")
            .attr("x", point.x - stemWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.select("#leftPlate")
            .attr("x", point.x - plateWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.select("#billiIcon")
            .attr("cx", point.x)
            // replace 70 with radius of big circle!!
            .attr("cy", point.y - 2 * stemHeight + stemOffset - svgWidth / 4 - 70 - plateHeight)
    }
}

function makeIcons(weight, side, i) {
    svg.append('circle')
        .attr("cx", function () {
            // put billionaire icon on left side of screen
            if (side == "L") {
                return 200
            }
            // put comparison icon on right side of screen
            // stack the icons
            else { return 1.5 * doubleArmLength - plateWidth / 2 + i % 4 * 2 * (iconRadiusScale(2762628933)) }
        })
        // assign each icon an ID
        .attr("class", function () {
            if (side == "R") { return "compareIcon" }
        })
        .attr("id", function () {
            if (side == "L") {
                // the billionaire gets its own unique id
                return "billiIcon"
            }
            // the comparison icons get numbered ids like "compareIcon3"
            else { return "compareIcon" + i }
        })
        .attr("cy", function () {
            if (side == "R") {
                return 15 * Math.floor(i / 4) + (iconRadiusScale(weight) + doubleArmLength - stemHeight - plateHeight - stemOffset)
                //return doubleArmLength
            }
            else {
                return (-iconRadiusScale(weight))
            }
        })
        .attr("fill", "gold")
        .attr("r", iconRadiusScale(weight))
}

function dropCompareIcon(i) {
    d3.select("#compareIcon" + i)
        .transition()
        .duration(800)
        .ease(d3.easeBounce)
        .attr("transform", "translate(0," + (doubleArmLength + 0.5 * iconRadiusScale(compareWorth) - plateHeight) + ")")
}

function dropBilliIcon() {
    d3.select("#billiIcon")
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("transform", "translate(0," + (doubleArmLength / 2 + iconRadiusScale(billionaireWorth)) + ")")
};