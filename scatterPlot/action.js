
const width = 960;
const height = 700;
const svg = d3.select("#viz")
    .append("svg")
    .attr("version", "1.1")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet");

// const width = +svg.attr("width");
// const height = +svg.attr("height");

const render = data => {
    const margin = {top: 50, right:20, left: 85, bottom: 70};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // make value accessors

// d.mpg = +d.mpg;
// d.cylinders = +d.cylinders;
// d.displacement = +d.displacement;
// d.horsepower = +d.horsepower;
// d.weight = +d.weight;
// d.year = +d.year;
    const circleRad = 5;
    const xValue = d => d.mpg;
    const xAxisLabel = "MPG";
    const yValue = d => d.weight;
    const yAxisLabel = "Weight";
    const labelValue = d => d.name;
    // select all
    const xScale = d3.scaleLinear()
        // .domain([d3.min(data, xValue), d3.max(data, xValue)]) ––– which is the same as extent, which returns array
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice();
        // .padding(0.2);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        // .tickFormat(d3.format(".2s"))
        .tickPadding(10)
        .tickSize(-innerHeight);

    const yAxis = d3.axisLeft(yScale)
        .tickPadding(10)
        .tickFormat(d3.format(".4"))
        .tickSize(-innerWidth);
    // adding in a Y axis
    g.append("g")
        .call(yAxis)
        .select(".domain")
            .remove();
    // change axis representation
    const xAxisG = g.append("g").call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

    const yAxisG = g.append("g").call(yAxis)
        .attr("transform", `translate(0, 0)`);

    xAxisG.select(".domain").remove();
    
    xAxisG.append("text")
        .attr("class", "axis-label")
        .attr("y", 50)
        .attr("x", innerWidth/2)
        .attr("fill", "black")
        .text(xAxisLabel)

    yAxisG.append("text")
        .attr("class", "axis-label")
        .attr("y", -60)
        .attr("x", -innerHeight / 2)
        .attr("fill", "black")
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)

    const div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    const color = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range(["white", "#306BAC"]);

    console.log(d3.extent(data, d => d.year));
    g.selectAll('circle').data(data)
        .enter().append('circle')
            .attr("cy", d => yScale(yValue(d)))
            .attr("cx", d => xScale(xValue(d)))
            .attr("r", circleRad)
            .attr("fill", d => color(d.year))
            .on('mouseover', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '.85');
                console.log(d);
                div.transition()
                    .duration(50)
                    .style("opacity", 1);
                div.html(d.target.__data__.year + " " +d.target.__data__.name)
                    .style("left", (d.pageX + 10) + "px")
                    .style("top", (d.pageY - 15) + "px");
            })
            .on('mouseout', function (d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition()
                    .duration(50)
                    .style("opacity", 0);
            });

    g.append("text")
        .attr("class", "title")
        .attr("y", -20)
        // .attr("x", -40)
        .text("Cars, 1970-1982: MPG vs. Weight")
};

d3.csv("https://vizhub.com/curran/datasets/auto-mpg.csv")
    .then(data => {
        data.forEach(d =>{
            d.mpg = +d.mpg;
            d.cylinders = +d.cylinders;
            d.displacement = +d.displacement;
            d.horsepower = +d.horsepower;
            d.weight = +d.weight;
            d.year = +d.year;
        })
        console.log(data);
        render(data);
    })
