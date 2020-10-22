const svg = d3.select("#viz")
    .append("svg")
    .attr("version", "1.1")
    .attr("viewBox", "0 0 960 500")
    .attr("preserveAspectRatio", "xMinYMin meet");

// const width = +svg.attr("width");
// const height = +svg.attr("height");

const width = 960;
const height = 500;

const render = data => {
    const margin = {top: 20, right:20, left: 60, bottom: 20};
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

    // adding in a Y axis
    g.append("g").call(d3.axisLeft(yScale));
    g.append("g").call(d3.axisBottom(xScale))
        .attr("transform", `translate(0, ${innerHeight})`);

    console.log(xScale.domain());
    g.selectAll('rect').data(data)
        .enter().append('rect')
            .attr("y", d => yScale(yValue(d)))
            .attr("width", d => xScale(xValue(d)))
            .attr("height", yScale.bandwidth())
};

d3.csv("popData.csv").then(data => {
    data.forEach(d =>{
        d.Population = +d.Population * 1000;
    })
    render(data);
})
