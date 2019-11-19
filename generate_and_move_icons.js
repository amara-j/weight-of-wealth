var padding = 20
        var w = 600
        var h = 1
        var xRect = 50
        var yRect = 300 + padding

        //this number is the "choose your billionaire" variable being fed in
        var billionaireWorth = 70300000000
        var compareWorth = 2762628933

        // determine the ratio between the variables
        compareRatio = Math.ceil(billionaireWorth / compareWorth)
        console.log(compareRatio)


        // to make the comparison scalable, create scale with billionaire worth as upper limit
        var angleScale = d3.scaleLinear()
            .domain([0, billionaireWorth])
            .range([0, 45]);

        var iconRadiusScale = d3.scaleLinear()
            .domain([0, billionaireWorth])
            .range([5, 70]);

        var svg = d3.select("#graph").append("svg")
            .attr("width", 1000)
            .attr("height", 1000)
            .attr("yRect", 50);

        // draw center of scale
        var center = svg.append('circle')
            .attr("cx", w / 2 + xRect)
            .attr("cy", yRect + h / 2)
            .attr("fill", "black")
            .attr("r", 10)
            .on("mouseover", function () {
                d3.select(this).attr("fill", "red")
            })
            .on("mouseout", function () {
                d3.select(this).attr("fill", "black");
            })
            //When clicked, should select off-screen circles and
            // eventially make them fall onto the scale
            .on("click", function() {
               makeIcons(billionaireWorth, "L", 1) 
         })

            .on("click", function () {
                for (i = 0; i < compareRatio; i += 1) {
                    makeIcons(compareWorth, "R", i)
                }
            })
            ;

        // call the makeIcons function for billionaire
        // specify sides "L" and "R" so billionaire is always on left side,
        // and comparison variable always on right.
         makeIcons(billionaireWorth, "L", 0)

        // define function to make icons
        function makeIcons(weight, side, i) {
            svg.append('circle')
                .attr("cx", function () {
                    // put billionaire icon on left side of screen
                    if (side == "L") {
                        return 200
                    }
                    // put comparison icon on right side of screen
                    // else { return xRect + w - 5 * padding - iconRadiusScale(weight) / 2 + i % 5 * 2 * (iconRadiusScale(weight)) }
                    else { return xRect + w - 5 * padding - iconRadiusScale(weight) / 2 + i % 5 * 2 * (iconRadiusScale(weight)) }
                })
                // assign each icon an ID
                .attr("id", function () {
                    if (side == "L") {
                        // the billionaire gets its own unique id
                        return "billiIcon"
                    }
                    // the comparison icons get numbered ids like "compareIcon3"
                    else { return "compareIcon" + i }
                })
                .attr("cy", Math.floor(i / 5) * 2 * (iconRadiusScale(weight)))
                .attr("fill", "gold")
                .attr("r", iconRadiusScale(weight))
                .on("click", function () {
                    d3.select(this)
                })

            d3.select("#compareIcon" + i)
                .transition()
                // delay falling icons to their own randomized times
                .delay(1000 * Math.random())
                .duration(1000)
                .attr("fill", "blue")
                .attr("transform", "translate(0,400)")

            d3.select("#billiIcon")
                .transition()
                .delay(1000)
                .duration(1000)
                .attr("transform", "translate(0,400)")

        };