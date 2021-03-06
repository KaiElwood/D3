
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
    const margin = {top: 50, right:20, left: 60, bottom: 70};
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // make value accessors
    const xValue = d => d.Population;
    const yValue = d => d.Age_Group;
    // select all rectangles, and then pass in the data array returned
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, xValue)])
        .range([0, innerWidth]);

    const yScale = d3.scaleBand()
        .domain(data.map(yValue))
        .range([0, innerHeight])
        .padding(0.1);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format(".2s"))
        .tickSize(-innerHeight + 5);

    // adding in a Y axis
    g.append("g")
        .call(d3.axisLeft(yScale))
        .selectAll(".domain, .tick line")
            .remove();
    // change axis representation
    const xAxisG = g.append("g").call(xAxis)
        .attr("transform", `translate(0, ${innerHeight})`);

    xAxisG.select(".domain").remove();
    
    xAxisG.append("text")
        .attr("class", "axis-label")
        .attr("y", 60)
        .attr("x", innerWidth/2)
        .attr("fill", "black")
        .text("Population")

    console.log(xScale.domain());
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr("y", d => yScale(yValue(d)))
            .attr("width", d => xScale(xValue(d)))
            .attr("height", yScale.bandwidth())

    g.append("text")
        .attr("class", "title")
        .attr("y", -10)
        .attr("x", -40)
        .text("High Income Countries Estimated 2020 Population By Age Group")
};

d3.csv("popData.csv").then(data => {
    data.forEach(d =>{
        d.Population = +d.Population * 1000;
    })
    render(data);
})
