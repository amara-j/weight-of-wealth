// these are all modifiable style parameters to change dimensions in visualization:
var svgWidth = 1000
var iconRadius = 30
var svgHeight = 1000
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
var floorHeight = doubleArmLength / 2 * Math.cos(Math.PI / 4) + 3


var billionaireWorth = null
var compareWorth = null
var tooltipVal = null
// --------------------------------//


billiDataset = [1.31E+11, 96500000000, 82500000000, 6000000000]
compareDataset = [478740000, 1860476400, 2500048502, 235680000]
//billiTooltipWorth = ["$131 billion", "$96.5 billion", "$82.5 billion", "$76 billion", 
//"$64 billion", "$62.7 billion", "$62.5 billion", "$62.3 billion"]
billiTooltipText = ["Jeff Bezos", "Bill Gates",
    "Warren Buffet", "Bernard Arnault"]
//compareTooltipWorth = ["$478 million", "$1,860,476,400"]
compareTooltipText = ["pay rent for entire New York City homeless population",
    "feed all SNAP recipients in NYC",
    "fund the World Health Organization",
    "pay full price for 1000 college educations at Columbia"]


var svg = d3.select("div#graph")
    .append("svg")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr("viewBox", "-300 -300 1400 1400")
    .classed("svg-content", true);

var resetButton = d3.select("#resetButton")
    .on("click", function () {
        layout.reload()
    })

function makeBilliButtons(i, billiDataset) {
    svg.append('circle')
        .attr("id", "billiButton" + i)
        .classed('billiButton', true)
        .attr("cy", 70 * (i % 4))
        .attr("cx", (60 + Math.floor(i / 4)))
        .attr("fill", "black")
        .attr("r", iconRadius)
        .on("mouseover", function () {
            billiText = billiTooltipText[i]
            document.getElementById('tooltip').innerHTML = billiText
           // d3.select("#tooltip").classed("hidden", false);
            d3.select(this)
                .attr("r", iconRadius + 5)
                .attr("stroke", "gold")
                .attr("stroke-width", 5)
            var tooltipXcoord = parseFloat(d3.select(this).attr("cx"))
            var tooltipYcoord = parseFloat(d3.select(this).attr("cy"))
            console.log(tooltipXcoord, tooltipYcoord)
            d3.select("#tooltip")
                .style("left", 200 + "px")
                .style("top", 50 + "px")
                ;
        })
        .on("mouseout", function () {
            d3.select("#tooltip").classed("hidden", true);
            d3.select(this).attr("r", iconRadius)
                .attr("stroke-width", 0)
        })
        .on("click", function () {
            d3.select(this).attr("fill", "pink")
            billiWorth = billiDataset[i]
            console.log("billionaire value set to", billiWorth)
            currentBilliValue = setBilliValue(billiWorth)
            updateTextRight(billiText, -600, -600, "billitext")
            return currentBilliValue

        })
}

function makeCompareButtons(i, compareDataset) {
    svg.append('circle')
        .attr("id", "compareButton" + i)
        .classed('compareButton', true)
        .attr("cy", 70 * (i % 4))
        .attr("cx", 100 * (9 + Math.floor(i / 4)))
        .attr("fill", "black")
        .attr("r", iconRadius)
        .on("mouseover", function () {
            compareText = compareTooltipText[i]
            document.getElementById('tooltip').innerHTML = compareText
            //d3.select("#tooltip").classed("hidden", false);
            d3.select(this)
                .attr("r", iconRadius + 5)
                .attr("stroke", "gold")
                .attr("stroke-width", 5)
            // var tooltipXcoord = parseFloat(d3.select(this).attr("cx"))
            //  var tooltipYcoord = parseFloat(d3.select(this).attr("cy"))
            //  console.log(tooltipXcoord, tooltipYcoord)
            d3.select("#tooltip")
                // .style("right", tooltipXcoord + "px")
                // .style("top", tooltipYcoord + "px")
                .style("left", 200 + "px")
                .style("top", 50 + "px")

        })
        .on("mouseout", function () {
            d3.select("#tooltip").classed("hidden", true);
            d3.select(this).attr("r", iconRadius)
                .attr("stroke-width", 0)
        })
        .on("click", function () {
            d3.select(this).attr("fill", "pink")
            compareWorth = compareDataset[i]
            console.log("compare value set to", compareWorth)
            currentCompareValue = setCompareValue(compareWorth)
            updateTextRight(compareText, -100, -600, "comparetext")
            return currentCompareValue
        })
}

for (i = 0; i < 4; i += 1) {
    makeBilliButtons(i, billiDataset)
    makeCompareButtons(i, compareDataset)
}

// create container for graph
var graphContainer = svg.append("g").attr("id", "balanceBar")
    .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")")

function setBilliValue(value) {
    billionaireWorth = value
}

function setCompareValue(value) {
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
        .range([5, 70]);
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
    .classed('scalePart', true)

// draw left arm of scale
leftArm = graphContainer.append('rect')
    .attr('x', -svgWidth / 4)
    .attr('y', 0)
    .attr('width', svgWidth / 4)
    .attr('height', armHeight)
    .attr('id', 'leftArm')
    .classed('scalePart', true)

//draw circle at center of scale
graphContainer.append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", centerCircleRadius)
    .classed('scalePart', true)

// draw fulcrum of scale
fulcrumLeft = graphContainer.append('line')
    .attr('x1', -fulcrumWidth / 2)
    .attr('y1', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('x2', -2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")
    .attr("id", "fulcrumLeft")
    .classed('scalePart', true)

fulcrumRight = graphContainer.append('line')
    .attr('x1', fulcrumWidth / 2)
    .attr('y1', doubleArmLength / 2 * Math.cos(Math.PI / 4))
    .attr('x2', 2)
    .attr('y2', 0)
    .attr('stroke-width', 4)
    .attr('stroke', "black")
    .classed('scalePart', true)

// draw the floor
floor = graphContainer.append('line')
    .attr('x1', -doubleArmLength / 2)
    .attr('y1', floorHeight)
    .attr('x2', doubleArmLength / 2)
    .attr('y2', floorHeight)
    .attr('stroke-width', 4)
    .attr('stroke', "black")
    .classed('scalePart', true)

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
    .classed('scalePart', true)
// draw left plate and assign it a starting position
var leftPlate = leftContainer.append("rect")
    .attr("x", svgWidth / 4 - plateWidth / 2) //Starting x
    .attr("y", svgHeight / 2 - stemHeight + stemOffset) //Starting y
    .attr("height", plateHeight)
    .attr("width", plateWidth)
    .attr("id", "leftPlate")
    .attr("fill", "black")
    .classed('scalePart', true)

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
    .classed('scalePart', true)
// draw right plate and assign it a starting position
var rightPlate = rightContainer.append("rect")
    .attr("x", svgWidth * 3 / 4 - plateWidth / 2)
    .attr("y", svgWidth / 2 - stemHeight + stemOffset)
    .attr("height", plateHeight)
    .attr("width", plateWidth)
    .attr("id", "rightPlate")
    .attr("fill", "black")
    .classed('scalePart', true)

rightInvisible = graphContainer.append('rect')
    // click on this invisible rectangle to turn scale left
    .attr('x', centerCircleRadius)
    .attr('y', -doubleArmLength / 2)
    .attr('width', svgWidth / 2)
    .attr('height', svgWidth)
    .attr('opacity', 0)
    .on("click", function () {
        if (compareWorth == null || billionaireWorth == null) {
            console.log("nothing to balance– select 2 variables to compare")
        }
        else {
            // keep track of how many times it has been clicked
            rightPlateClickCount += 1;
            if (rightPlateClickCount <= 1)
                // the first time it's clicked, generate the number of icons that would balance scale
                for (i = 0; i < getCompareRatio(); i += 1) {
                    makeIcons(compareWorth, "R", i)
                }
            if (rightPlateClickCount == getCompareRatio() && leftPlateClickCount >= 1) {
                addBalanceMessage("congrats! you balanced the scale", -100, -400)
                addBalanceMessage(billiText + " could " + compareText + " for " 
                + rightPlateClickCount + " years.", -200,-300)
                // fadeOutScale()
            }
            if (rightPlateClickCount <= getCompareRatio()) {
                // drop an icon each time it's clicked, until there are no more icons left
                dropCompareIcon(rightPlateClickCount - 1)
                // rotate arms each time an icon is dropped
                var rightRotateAngle = angleScale(compareWorth)
                rotateArms(rightRotateAngle)
                updateTextRight(rightPlateClickCount, doubleArmLength / 2, floorHeight + 50, "rightclickcount")
            }
            // don't allow it to interact further once there are no more icons left to drop
            else if (rightPlateClickCount >= getCompareRatio()) {
                (console.log("no more clicks left!"))
            }
        }
    })

leftInvisible = graphContainer.append('rect')
    // click on this invisible rectangle to turn scale left
    .attr('x', -centerCircleRadius - svgWidth / 2)
    .attr('y', -doubleArmLength / 2)
    .attr('width', svgWidth / 2)
    .attr('height', svgWidth)
    .attr('opacity', 0)
    .on("click", function () {
        if (compareWorth == null || billionaireWorth == null) {
            console.log("nothing to balance– select 2 variables to compare")
        }
        else {
            // keep track of how many times it has been clicked 
            leftPlateClickCount += 1;
            if (leftPlateClickCount <= 1) {
                // the first time it's clicked, create & drop the billionaire icon
                // makeIcons(billionaireWorth, "L", 1)
                makeIcons(billionaireWorth, "L", 1)
                var leftRotateAngle = -angleScale(billionaireWorth)
                rotateArms(leftRotateAngle)
                dropBilliIcon()
                updateTextLeft(leftPlateClickCount, -doubleArmLength / 2, floorHeight + 50, "leftclickcount")
            }
            // don't allow it to interact further if clicked more than once
            if (rightPlateClickCount == getCompareRatio() && leftPlateClickCount >= 1) {
                addBalanceMessage("congrats! you balanced the scale", -100, -400)
                addBalanceMessage(billiText + " could " + compareText + " for " 
                + rightPlateClickCount + " years.", -200,-300)
                // fadeOutScale()
            }
            if (leftPlateClickCount > 1) { (console.log("no more clicks left!")) }
        }
    })

// function to create message once scale is balanced
function addBalanceMessage(message, xcoord, ycoord) {
    graphContainer.append("text")
        .attr('opacity', 0)
        .attr("id", "balanceMessage")
        .text(message)
        .attr("font-family", "Open Sans Condensed")
        .attr("font-size", "20px")
        .attr("x", xcoord)
        .attr("y", ycoord)
        .transition()
        .delay(250)
        .duration(2000)
        .attr('opacity', 1)
}
// function to fade out scale once it's balanced
function fadeOutScale() {
    d3.selectAll('.scalePart')
        .attr('opacity', 1)
        .transition()
        .duration(2000)
        .attr('opacity', 0)
}

// the reset button reloads the page 
d3.select("#resetButton")
    .on("click", function () {
        location.reload()
    })

// counter for number of icons on left side
function updateTextLeft(text, xcoord, ycoord, id) {
    graphContainer.append("text")
        .attr("id", id)
        .text(text)
        .attr("font-family", "Open Sans Condensed")
        .attr("font-size", "34px")
        .attr("x", xcoord)
        .attr("y", ycoord)
}

// counter for number of icons on right side
function updateTextRight(text, xcoord, ycoord, id) {
    d3.select("#" + id).remove()
    graphContainer.append("text")
        .attr("id", id)
        .text(text)
        .attr("font-family", "Open Sans Condensed")
        .attr("font-size", "34px")
        .attr("x", xcoord)
        .attr("y", ycoord)
}

var currentRotation = 0
function rotateArms(rotateAngle) {

    lStartDeg = 270 + currentAngle
    lEndDeg = 270 + currentAngle + rotateAngle
    rStartDeg = 90 + currentAngle
    rEndDeg = 90 + currentAngle + rotateAngle

    currentRotation = currentRotation + rotateAngle

    // rotate left arm of scale
    d3.select("#leftArm")
        .classed('scalePart', true)
        .transition()
        .duration(1000)
        .attr("transform", "rotate(" + (currentRotation) + " 0 0)");

    // rotate right arm of scale
    d3.select("#rightArm")
        .classed('scalePart', true)
        .transition()
        .duration(1000)
        .attr("transform", "rotate(" + (currentRotation) + " 0 0)");

    d3.select("#leftStem")
        .classed('scalePart', true)
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenLeft(path, lStartDeg, lEndDeg) })

    d3.select("#leftPlate")
        .classed('scalePart', true)
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenLeft(path, lStartDeg, lEndDeg) })

    d3.select("#rightStem")
        .classed('scalePart', true)
        .transition()
        .duration(1000)
        // call the tweening function to update new position
        .tween("pathTween", function () { return pathTweenRight(path, rStartDeg, rEndDeg) })

    d3.select("#rightPlate")
        .classed('scalePart', true)
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
            .classed('scalePart', true)
            .attr("x", point.x - stemWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.select("#rightPlate")
            .classed('scalePart', true)
            .attr("x", point.x - plateWidth / 2)
            .attr("y", point.y - stemHeight + stemOffset)
        d3.selectAll(".compareIcon")
            .each(function (d, i) {
                circlesPerRow = Math.floor(plateWidth / (2 * iconRadiusScale(compareWorth)))
                d3.select(this)
                    .attr("cx", point.x + 2 * (i % circlesPerRow * iconRadiusScale(compareWorth) - plateWidth / 4
                        + 0.5 * iconRadiusScale(compareWorth)))
                    .attr("cy", point.y - (iconRadiusScale(compareWorth) * 2 * Math.floor(i / circlesPerRow)) -
                        doubleArmLength - plateHeight - stemHeight + 2 * stemOffset)
            })
    }
}

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
            .attr("cy", point.y - 2 * stemHeight + stemOffset - svgWidth / 4 - iconRadiusScale(billionaireWorth) - plateHeight)
    }
}

function makeIcons(weight, side, i) {
    svg.append('circle')
        .style("opacity", 0)
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
        .attr("fill", "black")
        .attr("r", iconRadiusScale(weight))
}

function dropCompareIcon(i) {
    d3.select("#compareIcon" + i)
        .style("opacity", 1)
        .transition()
        .duration(800)
        .ease(d3.easeBounce)
        .attr("transform", "translate(0," + (doubleArmLength + 0.5 * iconRadiusScale(compareWorth) - plateHeight) + ")")
}

function dropBilliIcon() {
    d3.select("#billiIcon")
        .style("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeBounce)
        .attr("transform", "translate(0," + (doubleArmLength / 2 + iconRadiusScale(billionaireWorth)) + ")")
};