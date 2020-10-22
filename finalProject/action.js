$(function () {
    var controller = new ScrollMagic.Controller();

    // var blockTween = new TweenMax.to('#block', 1.5, {
    //     backgroundColor: 'red'
    // });

    var backgroundChangeBlack = new TweenMax.to('body', 1.5, {
        backgroundColor: 'black'
    });

    var backgroundChangeBody = new TweenMax.to('body', 1.5, {
        backgroundColor: 'white'
    });

    var containerScene = new ScrollMagic.Scene({
        triggerElement: '#container', duration: 200
    , triggerHook: 0.1})
        // .setTween(backgroundChange)
        .setPin('#container')
        // .addIndicators({name: "1 (duration: 700)"})
        // .addIndicators()
        .addTo(controller);
    
    var containerScene2 = new ScrollMagic.Scene({
        triggerElement: '#container2', duration: 200
    , triggerHook: 0.05
    })
        .setPin('#container2')
        .setTween(backgroundChangeBody)
        // .addIndicators()
        .addTo(controller);

    var containerScene3 = new ScrollMagic.Scene({
        triggerElement: '#container3', duration: 200
    , triggerHook: 0.05
    })
        .setPin('#container3')
        // .setTween(backgroundChangeBody)
        // .addIndicators()
        .addTo(controller);
    
    var backToBlack = new ScrollMagic.Scene({
        triggerElement:'#changeBack', duration: 300
    })
        .setTween(backgroundChangeBlack)
        // .addIndicators()
        .addTo(controller);

    var containerScene4 = new ScrollMagic.Scene({
        triggerElement: '#container4', duration: 200
    , triggerHook: 0.05
    })
        .setPin('#container4')
        // .addIndicators()
        .addTo(controller);

    var Titlescene = new ScrollMagic.Scene({triggerElement: "#trigger1", duration: 100})
        .setPin("#title")
        
        .addTo(controller);
});





// ----------------- D3

var margin = {top: 40, right: 0, bottom: 10, left: 0},
    width = 700 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg1 = d3.select("#Q1vis")
  .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("version", "1.1")
    .attr("viewBox", "0 0 700 400")
    .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
var svg2 = d3.select("#Q2vis")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("version", "1.1")
    .attr("viewBox", "0 0 700 400")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
var svg3 = d3.select("#Q3vis")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("version", "1.1")
    .attr("viewBox", "0 0 700 400")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
var svg4 = d3.select("#Q4vis")
    .append("svg")
    // .attr("width", width + margin.left + margin.right)
    // .attr("height", height + margin.top + margin.bottom)
    .attr("version", "1.1")
    .attr("viewBox", "0 0 700 400")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


        //   in this case, add on(resize) or something – 900 for largest, 3 different ranges on resize
        //   first check to see if media queries will work

function displayGraph(asset, svg, legendSpacing, legendOffset){
    d3.csv(asset, function(data) {
        console.log(data);
        // List of subgroups = header of the csv files = soil condition here
        var subgroups = data.columns.slice(1)
        console.log(subgroups);
        // List of groups = species here = value of the first column called group -> I show them on the X axis
        // debugger;
        var groups = d3.map(data, function(d){
            // debugger;
            return(d.Group)
        }).keys()
        console.log(groups);
    
        // Add X axis
        var x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.3])
        svg.append("g")
            .attr("transform", "translate(0," + -1 + ")")
            .call(d3.axisTop(x).tickSizeOuter(0))
    
        // Add Y axis
        var y = d3.scaleLinear()
            .domain([100, 0])
            .range([ height, 0 ]);
        // svg.append("g")
            // .call(d3.axisLeft(y));
        var colorArray = ['#AFE1CD','#99DFF0','#E6D379', '#FBB9B9']
        // color palette = one color per subgroup
        var color = d3.scaleOrdinal()
            .domain(groups)
            .range(colorArray)
    
        //stack the data? --> stack per subgroup
        var stackedData = d3.stack()
            .keys(subgroups)
            (data)
    
        var div = d3.select("body").append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0);
    
        // Show the bars
        svg.append("g")
            .selectAll("g")
            // Enter in the stack data = loop key per key = group per group
            .data(stackedData)
            .enter().append("g")
            .attr("fill", function(d) { return color(d.key); })
            .selectAll("rect")
            // enter a second time = loop subgroup per subgroup to add all rectangles
            .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d) { return x(d.data.Group); })
                .attr("y", function(d) { return y(d[0]); })
                .attr("height", function(d) { return y(d[1])-y(d[0]); })
                .attr("width",x.bandwidth())
                .attr("stroke", "black")
                .on('mouseover', function (d, i) {
                    console.log(d)
                    d3.select(this).transition()
                         .duration('50')
                         .attr('opacity', '.85');
                    div.transition()
                         .duration(50)
                         .style("opacity", 1);
                    div.html(d[1]-d[0]+ "%")
                         .style("left", (d3.event.pageX + 10) + "px")
                         .style("top", (d3.event.pageY - 15) + "px");
                })
                .on('mouseout', function (d, i) {
                    d3.select(this).transition()
                         .duration('50')
                         .attr('opacity', '1');
                    div.transition()
                         .duration(50)
                         .style("opacity", 0);
                });
        var legend = svg.append('g')
                .attr('class', 'legend')
                .attr('transform', 'translate(' + (margin.left + 12) + ', -40)');
        
        legend.selectAll('rect')
            .data(subgroups)
            .enter()
            .append('rect')
            .attr('x', function(d, i){
                return (i * legendSpacing) + (legendOffset-20);
            })
            .attr('y', 0)
            .attr('width', 12)
            .attr('height', 12)
            .attr('fill', function(d, i){
                return colorArray[i];
            });
        
        legend.selectAll('text')
            .data(subgroups)
            .enter()
            .append('text')
            .text(function(d){
                return d;
            })
            .attr('x', function(d, i){
                return (i * legendSpacing) + legendOffset;
            })
            .attr('y', 0)
            .attr('text-anchor', 'start')
            .attr('alignment-baseline', 'hanging');
        })
}

displayGraph("assets/Q1.csv", svg1, 100, 170);
displayGraph("assets/Q2.csv", svg2, 200, 20);
displayGraph("assets/Q3.csv", svg3, 200, 20);
displayGraph("assets/Q4.csv", svg4, 200, 20)

// ------------------FIRST GRAPH------------------
// d3.csv("assets/Q1.csv", function(data) {
//     console.log(data);
//     // List of subgroups = header of the csv files = soil condition here
//     var subgroups = data.columns.slice(1)
//     console.log(subgroups);
//     // List of groups = species here = value of the first column called group -> I show them on the X axis
//     // debugger;
//     var groups = d3.map(data, function(d){
//         // debugger;
//         return(d.Group)
//     }).keys()
//     console.log(groups);

//     // Add X axis
//     var x = d3.scaleBand()
//         .domain(groups)
//         .range([0, width])
//         .padding([0.3])
//     svg1.append("g")
//         .attr("transform", "translate(0," + -1 + ")")
//         .call(d3.axisTop(x).tickSizeOuter(0))

//     // Add Y axis
//     var y = d3.scaleLinear()
//         .domain([100, 0])
//         .range([ height, 0 ]);
//     // svg.append("g")
//         // .call(d3.axisLeft(y));
//     var colorArray = ['#AFE1CD','#99DFF0','#E6D379', '#FBB9B9']
//     // color palette = one color per subgroup
//     var color = d3.scaleOrdinal()
//         .domain(groups)
//         .range(colorArray)

//     //stack the data? --> stack per subgroup
//     var stackedData = d3.stack()
//         .keys(subgroups)
//         (data)

//     var div = d3.select("body").append("div")
//         .attr("class", "tooltip-donut")
//         .style("opacity", 0);

//     // Show the bars
//     svg1.append("g")
//         .selectAll("g")
//         // Enter in the stack data = loop key per key = group per group
//         .data(stackedData)
//         .enter().append("g")
//         .attr("fill", function(d) { return color(d.key); })
//         .selectAll("rect")
//         // enter a second time = loop subgroup per subgroup to add all rectangles
//         .data(function(d) { return d; })
//         .enter().append("rect")
//             .attr("x", function(d) { return x(d.data.Group); })
//             .attr("y", function(d) { return y(d[0]); })
//             .attr("height", function(d) { return y(d[1])-y(d[0]); })
//             .attr("width",x.bandwidth())
//             .attr("stroke", "black")
//             .on('mouseover', function (d, i) {
//                 console.log(d)
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '.85');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 1);
//                 div.html(d[1]-d[0]+ "%")
//                      .style("left", (d3.event.pageX + 10) + "px")
//                      .style("top", (d3.event.pageY - 15) + "px");
//             })
//             .on('mouseout', function (d, i) {
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '1');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 0);
//             });
//     var legend = svg1.append('g')
//             .attr('class', 'legend')
//             .attr('transform', 'translate(' + (margin.left + 12) + ', -40)');
    
//     legend.selectAll('rect')
//         .data(subgroups)
//         .enter()
//         .append('rect')
//         .attr('x', function(d, i){
//             return (i * 100) + 150;
//         })
//         .attr('y', 0)
//         .attr('width', 12)
//         .attr('height', 12)
//         .attr('fill', function(d, i){
//             return colorArray[i];
//         });
    
//     legend.selectAll('text')
//         .data(subgroups)
//         .enter()
//         .append('text')
//         .text(function(d){
//             return d;
//         })
//         .attr('x', function(d, i){
//             return (i * 100) + 170;
//         })
//         .attr('y', 0)
//         .attr('text-anchor', 'start')
//         .attr('alignment-baseline', 'hanging');
//     })

// ------------------SECOND GRAPH------------------
// d3.csv("assets/Q2.csv", function(data) {
//     console.log(data);
//     // List of subgroups = header of the csv files = soil condition here
//     var subgroups = data.columns.slice(1)
//     console.log(subgroups);
//     // List of groups = species here = value of the first column called group -> I show them on the X axis
//     // debugger;
//     var groups = d3.map(data, function(d){
//         // debugger;
//         return(d.Group)
//     }).keys()
//     console.log(groups);

//     // Add X axis
//     var x = d3.scaleBand()
//         .domain(groups)
//         .range([0, width])
//         .padding([0.3])
//     svg2.append("g")
//         .attr("transform", "translate(0," + -1 + ")")
//         .call(d3.axisTop(x).tickSizeOuter(0))

//     // Add Y axis
//     var y = d3.scaleLinear()
//         .domain([100, 0])
//         .range([ height, 0 ]);
//     // svg.append("g")
//         // .call(d3.axisLeft(y));
//     var colorArray = ['#AFE1CD','#99DFF0','#E6D379', '#FBB9B9']
//     // color palette = one color per subgroup
//     var color = d3.scaleOrdinal()
//         .domain(groups)
//         .range(colorArray)

//     //stack the data? --> stack per subgroup
//     var stackedData = d3.stack()
//         .keys(subgroups)
//         (data)

//     var div = d3.select("body").append("div")
//         .attr("class", "tooltip-donut")
//         .style("opacity", 0);

//     // Show the bars
//     svg2.append("g")
//         .selectAll("g")
//         // Enter in the stack data = loop key per key = group per group
//         .data(stackedData)
//         .enter().append("g")
//         .attr("fill", function(d) { return color(d.key); })
//         .selectAll("rect")
//         // enter a second time = loop subgroup per subgroup to add all rectangles
//         .data(function(d) { return d; })
//         .enter().append("rect")
//             .attr("x", function(d) { return x(d.data.Group); })
//             .attr("y", function(d) { return y(d[0]); })
//             .attr("height", function(d) { return y(d[1])-y(d[0]); })
//             .attr("width",x.bandwidth())
//             .attr("stroke", "black")
//             .on('mouseover', function (d, i) {
//                 console.log(d)
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '.85');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 1);
//                 div.html(d[1]-d[0]+ "%")
//                      .style("left", (d3.event.pageX + 10) + "px")
//                      .style("top", (d3.event.pageY - 15) + "px");
//             })
//             .on('mouseout', function (d, i) {
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '1');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 0);
//             });
//     var legend = svg2.append('g')
//             .attr('class', 'legend')
//             .attr('transform', 'translate(' + (margin.left + 12) + ', -40)');
    
//     legend.selectAll('rect')
//         .data(subgroups)
//         .enter()
//         .append('rect')
//         .attr('x', function(d, i){
//             return (i * 200);
//         })
//         .attr('y', 0)
//         .attr('width', 12)
//         .attr('height', 12)
//         .attr('fill', function(d, i){
//             return colorArray[i];
//         });
    
//     legend.selectAll('text')
//         .data(subgroups)
//         .enter()
//         .append('text')
//         .text(function(d){
//             return d;
//         })
//         .attr('x', function(d, i){
//             return (i * 200) + 20;
//         })
//         .attr('y', 0)
//         .attr('text-anchor', 'start')
//         .attr('alignment-baseline', 'hanging');
//     })

// ------------------THIRD GRAPH------------------
// d3.csv("assets/Q3.csv", function(data) {
//     console.log(data);
//     // List of subgroups = header of the csv files = soil condition here
//     var subgroups = data.columns.slice(1)
//     console.log(subgroups);
//     // List of groups = species here = value of the first column called group -> I show them on the X axis
//     // debugger;
//     var groups = d3.map(data, function(d){
//         // debugger;
//         return(d.Group)
//     }).keys()
//     console.log(groups);

//     // Add X axis
//     var x = d3.scaleBand()
//         .domain(groups)
//         .range([0, width])
//         .padding([0.3])
//     svg3.append("g")
//         .attr("transform", "translate(0," + -1 + ")")
//         .call(d3.axisTop(x).tickSizeOuter(0))

//     // Add Y axis
//     var y = d3.scaleLinear()
//         .domain([100, 0])
//         .range([ height, 0 ]);
//     // svg.append("g")
//         // .call(d3.axisLeft(y));
//     var colorArray = ['#AFE1CD','#99DFF0','#E6D379', '#FBB9B9']
//     // color palette = one color per subgroup
//     var color = d3.scaleOrdinal()
//         .domain(groups)
//         .range(colorArray)

//     //stack the data? --> stack per subgroup
//     var stackedData = d3.stack()
//         .keys(subgroups)
//         (data)

//     var div = d3.select("body").append("div")
//         .attr("class", "tooltip-donut")
//         .style("opacity", 0);

//     // Show the bars
//     svg3.append("g")
//         .selectAll("g")
//         // Enter in the stack data = loop key per key = group per group
//         .data(stackedData)
//         .enter().append("g")
//         .attr("fill", function(d) { return color(d.key); })
//         .selectAll("rect")
//         // enter a second time = loop subgroup per subgroup to add all rectangles
//         .data(function(d) { return d; })
//         .enter().append("rect")
//             .attr("x", function(d) { return x(d.data.Group); })
//             .attr("y", function(d) { return y(d[0]); })
//             .attr("height", function(d) { return y(d[1])-y(d[0]); })
//             .attr("width",x.bandwidth())
//             .attr("stroke", "black")
//             .on('mouseover', function (d, i) {
//                 console.log(d)
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '.85');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 1);
//                 div.html(d[1]-d[0]+ "%")
//                      .style("left", (d3.event.pageX + 10) + "px")
//                      .style("top", (d3.event.pageY - 15) + "px");
//             })
//             .on('mouseout', function (d, i) {
//                 d3.select(this).transition()
//                      .duration('50')
//                      .attr('opacity', '1');
//                 div.transition()
//                      .duration(50)
//                      .style("opacity", 0);
//             });
//     var legend = svg3.append('g')
//             .attr('class', 'legend')
//             .attr('transform', 'translate(' + (margin.left + 12) + ', -40)');
    
//     legend.selectAll('rect')
//         .data(subgroups)
//         .enter()
//         .append('rect')
//         .attr('x', function(d, i){
//             return (i * 200);
//         })
//         .attr('y', 0)
//         .attr('width', 12)
//         .attr('height', 12)
//         .attr('fill', function(d, i){
//             return colorArray[i];
//         });
    
//     legend.selectAll('text')
//         .data(subgroups)
//         .enter()
//         .append('text')
//         .text(function(d){
//             return d;
//         })
//         .attr('x', function(d, i){
//             return (i * 200) + 20;
//         })
//         .attr('y', 0)
//         .attr('text-anchor', 'start')
//         .attr('alignment-baseline', 'hanging');
//     })