// these are all modifiable parameters to change dimensions in visualization

var svgWidth = 800
var svgHeight = 800
var rotateAngle = -45
var centerCircleRadius = 10
var stemHeight = 60
var stemWidth = 4
var plateHeight = 10
var plateWidth = 110
var armHeight = 5
var stemOffset = 3 // makes it look more like the stems are really attached to the scale– there is a tiny gap otherwise

// -- new vars -- 
var padding = 20
var doubleArmLength = svgWidth / 2
// ------------------------ these numbers are selection variable being fed in from sharvari's code
var billionaireWorth = 70300000000
var compareWorth = 2762628933
// --------------------------------//

// determine the ratio between the variables
//compareRatio = Math.ceil(billionaireWorth / compareWorth)
var compareRatio = 40

// to make the comparison scalable, create scale with billionaire worth as upper limit
var angleScale = d3.scaleLinear()
    .domain([0, billionaireWorth])
    .range([0, 45]);

var iconRadiusScale = d3.scaleLinear()
    .domain([0, billionaireWorth])
    .range([10, 70]);

iconRadiusScale(2762628933)

// first rotateAngle = - angleScale(billionaireWorth)
// then rotateAngle = angleScale(compareWorth)

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
    .attr('height', armHeight)
    .attr('id', 'rightArm')

// draw left arm of scale
leftArm = graphContainer.append('rect')
    .attr('x', -svgWidth / 4)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', armHeight)
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
    // try making this interactive instead 
    .on("click", function () {
        makeIcons(billionaireWorth, "L", 1)
        d3.select("#billiIcon")
            .transition()
            .duration(1000)
            .attr("transform", "translate(0," + (doubleArmLength / 2 + iconRadiusScale(billionaireWorth)) + ")")
        rotateArms(-angleScale(billionaireWorth))
    })


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
    .on("click", function () {
        for (i = 0; i < compareRatio; i += 1) {
            makeIcons(compareWorth, "R", i)
        }

        d3.select("#compareIcon" + i)
            .transition()
            // delay falling icons to their own randomized times
            .delay(4000 + 1000 * Math.random())
            .duration(1000)
            .attr("fill", "blue")
            // replace 10 with Small radius variable
            .attr("transform", "translate(0," + (doubleArmLength - Math.floor(i / 5) * 2 * 10) + ")")

        rotateArms(45)
    })


//draw circle at center of scale
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", centerCircleRadius)
    .attr("opacity", 1)

function rotateArms(rotateAngle) {
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

    if (rotateAngle < 0) {

        d3.select("#leftStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(pathL) })

        d3.select("#leftPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(pathL) })

        d3.select("#rightStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(pathL) })

        d3.select("#rightPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(pathL) })
    }
    else {
        d3.select("#leftStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(pathR) })

        d3.select("#leftPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenLeft(pathR) })

        d3.select("#rightStem")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(pathR) })

        d3.select("#rightPlate")
            .transition()
            .duration(10000)
            // call the tweening function to update new position
            .tween("pathTween", function () { return pathTweenRight(pathR) })
    }

}

//generate a series of nodes around the circle
// visualize them with circles to be sure it's working as it should
// we want two circles at 0 and π radians that line up with where the scale starts
function createNodes(numNodes, radius, side) {
    var nodes = [],
        width = (radius * 2) + svgWidth / 2,
        height = (radius * 2) + svgWidth / 2,
        angle,
        x,
        y,
        i;
    if (side = "L") {
        for (i = 0; i < numNodes + 1; i++) {
            return angle = (i / (numNodes / 2)) * Math.PI - Math.PI / 2
        }
    }
    else {
        for (i = 0; i < numNodes + 1; i++) {
            return angle = (-i / (numNodes / 2)) * Math.PI - Math.PI / 2
        }
    }
    ;
    x = (radius * Math.cos(angle)) + (width / 2);
    y = (radius * Math.sin(angle)) + (width / 2);
    nodes.push([x, y]);
    svg.append("circle")
        .attr("cx", x)
        .attr("cy", y)
        .attr("fill", "purple")
        .attr("r", 3)
    return nodes;
}

var pointsL = createNodes(20, svgWidth / 4, "L")
var pointsR = createNodes(20, svgWidth / 4, "R")

//draw these points as a regular d3.line path
var pathL = svg.append("path")
    .data([pointsL])
    .attr("d", d3.line().curve(d3.curveCardinal))
    .style("stroke", "red")
    .attr("opacity", .3)
    .style("fill", "none");

var pathR = svg.append("path")
    .data([pointsR])
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
        d3.selectAll(".compareIcon")
            .each(function (d, i) {
                d3.select(this)
                    // replace this crazy hard coded number with icon radius scale!!
                    // make these into public variables
                    .attr("cx", point.x + 2 * (i % 4) * iconRadiusScale(2762628933) - plateWidth / 3)
                    .attr("cy", point.y - stemHeight + stemOffset - doubleArmLength - plateHeight)
            })
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
        d3.select("#billiIcon")
            .attr("cx", point.x)
            // replace 70 with radius of big circle!!
            .attr("cy", point.y - 2 * stemHeight + stemOffset - svgWidth / 4 - 70 - plateHeight)
    }
}


// define makeIcons function
function makeIcons(weight, side, i) {
    svg.append('circle')
        .attr("cx", function () {
            // put billionaire icon on left side of screen
            if (side == "L") {
                return 200
            }
            // put comparison icon on right side of screen
            // stack the icons, regardless of how many there are
            // else { return 1.5 * doubleArmLength - plateWidth / 2 }
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
                return - Math.floor(i / 5) * (iconRadiusScale(weight) - stemHeight - plateHeight - stemOffset)
            }
            else {
                return (-iconRadiusScale(weight))
            }
        })

        // perfect y for icons to fall to: doubleArmLength - stemHeight - plateHeight

        //.attr("cy", svgHeight / 2 - stemHeight + stemOffset)
        .attr("fill", "gold")
        .attr("r", iconRadiusScale(weight))
        .on("click", function () {
            d3.select(this)
        })
};

// Shouldn't be able to click center of scale button more than once

// style scale

// rename double arm length