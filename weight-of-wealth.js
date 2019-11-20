// these are all modifiable style parameters to change dimensions in visualization:
var svgWidth = 800
var svgHeight = 800
var centerCircleRadius = 10
var stemHeight = 60
var stemWidth = 4
var plateHeight = 10
var plateWidth = 110
var armHeight = 5
var stemOffset = 3 // makes it look more like the stems are really attached to the scale– there is a tiny gap otherwise
var fulcrumWidth = 20
var padding = 20
var doubleArmLength = svgWidth / 2

// ------------------------ these numbers are selection variables
// they will eventually be fed in from sharvari's code, read from csv
var billionaireWorth = 70300000000
var compareWorth = 2762628933
// --------------------------------//

// initialize current angle to 0
currentAngle = 0

//initialize click counters
leftPlateClickCount = 0
rightPlateClickCount = 0

// determine the ratio between the variables
//compareRatio = Math.ceil(billionaireWorth / compareWorth)
// for now we'll just use a constant compare ratio
var compareRatio = 10

// to make the comparison scalable, create scale with billionaire worth as upper limit
var angleScale = d3.scaleLinear()
    .domain([0, billionaireWorth])
    .range([0, 45]);

// can change the numbers in this range to adjust small and large icon sizes
var iconRadiusScale = d3.scaleLinear()
    .domain([0, billionaireWorth])
    .range([10, 70]);

var svg = d3.select("#graph").append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)

// create container for graph
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")

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
    .attr('y1', doubleArmLength / 2* Math.cos(Math.PI/4))
    .attr('x2', -2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")
fulcrumRight = graphContainer.append('line')
    .attr('x1', fulcrumWidth / 2)
    .attr('y1', doubleArmLength / 2* Math.cos(Math.PI/4))
    .attr('x2', 2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")

// draw the floor
floor = graphContainer.append('line')
    .attr('x1', -doubleArmLength/2)
    .attr('y1', doubleArmLength / 2* Math.cos(Math.PI/4))
    .attr('x2', doubleArmLength/2)
    .attr('y2', doubleArmLength / 2* Math.cos(Math.PI/4))
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
    // left plate is interactive
    .on("click", function () {
        // keep track of how many times it has been clicked 
        leftPlateClickCount += 1;
        console.log("left plate click count =", leftPlateClickCount)
        if (leftPlateClickCount <= 1) {
            // the first time it's clicked, create & drop the billionaire icon
            makeIcons(billionaireWorth, "L", 1)
            rotateArms(leftRotateAngle)
            dropBilliIcon()
        }
        // don't allow it to interact further if clicked more than once
        else if (leftPlateClickCount > 1) { (console.log("no more clicks left!")) }
    })

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
    // right plate is interactive
    .on("click", function () {
        // keep track of how many times it has been clicked
        rightPlateClickCount += 1;
        console.log("right plate click count =", rightPlateClickCount)
        if (rightPlateClickCount <= 1)
        // the first time it's clicked, generate the number of icons that would balance scale
            for (i = 0; i < compareRatio; i += 1) {
                makeIcons(compareWorth, "R", i)
            }
        if (rightPlateClickCount <= compareRatio) {
            // drop an icon each time it's clicked, until there are no more icons left
            dropCompareIcon(rightPlateClickCount -1)
             // rotate arms each time an icon is dropped
            rotateArms(rightRotateAngle)
        }
    // don't allow it to interact further once there are no more icons left to drop
        else if (rightPlateClickCount >= compareRatio) {
            (console.log("no more clicks left!"))
        }
    })

//Right now, scale breaks apart if you click on the right plate more than once
// because it resets to interpolate from its original position,
// instead of updating to interpolate from its current position to its next position
// this is probably something to do with tweening and interpolation

leftRotateAngle = -angleScale(billionaireWorth)

//eventually, rightRotateAngle = angleScale(compareWorth)
// for now, it is a constant because the other angle is too small to see visually whether scale is working
rightRotateAngle = 10

//rStartDeg = 90 and lStartDeg = 270 because of the coordinate system in the interpolation function

function rotateArms(rotateAngle) {
    lEndDeg = 270 + rotateAngle
    rEndDeg = 90 + rotateAngle

console.log("current angle is ", currentAngle)
console.log("rotating by", rotateAngle, "degrees...")
    
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
        .tween("pathTween", function () { return pathTweenLeft(path, 270, lEndDeg) })

    d3.select("#leftPlate")
        .transition()
        .duration(10000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenLeft(path, 270, lEndDeg) })

    d3.select("#rightStem")
        .transition()
        .duration(10000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenRight(path, 90, rEndDeg) })

    d3.select("#rightPlate")
        .transition()
        .duration(10000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenRight(path, 90, rEndDeg) })

currentAngle = currentAngle + rotateAngle
console.log("updated angle=", currentAngle)

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
    .style("stroke", "red")
    .attr("opacity", .3)
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
                    .attr("cy", point.y - stemHeight + stemOffset - doubleArmLength - plateHeight)
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
                return 3* Math.floor(i / 4) * (iconRadiusScale(weight) + doubleArmLength - stemHeight - plateHeight - stemOffset)
            }
            else {
                return (-iconRadiusScale(weight))
            }
        })
        

        // perfect y for icons to fall to: doubleArmLength - stemHeight - plateHeight
        .attr("fill", "gold")
        .attr("r", iconRadiusScale(weight))
}

function dropCompareIcon(i) {
    d3.select("#compareIcon" + i)
        .transition()
        .duration(1000)
        .attr("fill", "blue")
       // .attr("transform", "translate(0," + (doubleArmLength - Math.floor(i / 5) * 2 * (iconRadiusScale(compareWorth))) + ")")
       .attr("transform", "translate(0," + (doubleArmLength/2 + iconRadiusScale(compareWorth)) + ")")
}

function dropBilliIcon() {
    d3.select("#billiIcon")
        .transition()
        .duration(1000)
        .attr("transform", "translate(0," + (doubleArmLength / 2 + iconRadiusScale(billionaireWorth)) + ")")
       //.attr("transform", "translate(0," + (-3* Math.floor(i / 4) * (iconRadiusScale(weight)) + ")"))
};