const width = 960;
const height = 700;
const svg = d3.select("#viz")
    .append("svg")
    .attr("version", "1.1")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("preserveAspectRatio", "xMinYMin meet");

var x = d3.scaleTime().range([0, innerWidth]);
var y = d3.scaleLinear().range([innerHeight, 0]);

// const width = +svg.attr("width");
// const height = +svg.attr("height");

const render = data => {
    const margin = { top: 80, right: 20, left: 65, bottom: 70 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    // make value accessors
    // d.Year = +d.Year;
    // d.China = +d.China;
    // d.Brazil = +d.Brazil;
    // d.France = +d.France;
    // d.Germany = +d.Germany;
    // d.India = +d.India;
    // d.Japan = +d.Japan;
    // d.Russia = +d.Russia;
    // d.United_Kingdom = +d.United_Kingdom;
    // d.United_States = +d.United_States;
    
    const xValue = d => d.Year;
    const xAxisLabel = "Year";

    const countries = ['d.Brazil', 'd.China', 'd.France', 'd.Germany', 'd.India', 'd.Japan', 'd.Russia', 'd.UK', 'd.US'];
    const yValue = function(d) {
        return d.China;
    };
    const yAxisLabel = "Countries";
    const labelValue = d => d.name;
    const title = "YOY GDP Growth in Selected Countries 2009-2021 (Forecast for 2020-2021)";

    const xScale = d3.scaleTime()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();

    const yScale = d3.scaleLinear()
        .domain([-10, d3.max(data, d => Math.max(d.China, d.Brazil, d.France, d.Germany, d.India, d.Japan, d.Russia, d.UK, d.US))])
        .range([innerHeight, 0])
        .nice();

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format(".4"))
        .tickPadding(10)
        .tickSize(-innerHeight);

    const yAxis = d3.axisLeft(yScale)
        .tickPadding(10)
        .tickFormat(d3.format(".2"))
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
        .attr("x", innerWidth / 2)
        .attr("fill", "black")
        .text(xAxisLabel)

    yAxisG.append("text")
        .attr("class", "axis-label")
        .attr("y", -30)
        .attr("x", -innerHeight / 2)
        .attr("fill", "black")
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text(yAxisLabel)

    const div = d3.select("body").append("div")
        .attr("class", "tooltip-donut")
        .style("opacity", 0);

    const colors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#f1c40f", "#e67e22", "#e74c3c", "#95a5a6"]
    
    for(i = 0; i < countries.length; i++){
        let lineGenerator = d3.line(data)
            .curve(d3.curveNatural)
            .x(d => xScale(d.Year))
            .y(d => yScale(eval(countries[i])));
        console.log(countries[i], colors[i]);
        console.log(lineGenerator(data));
        g.append('path')
            .attr("class", "line-path")
            .attr("d", lineGenerator(data))
            .attr("stroke", colors[i])
            .on('mouseover', function (d, i) {
                d3.selectAll(".line-path").transition()
                    .duration('50')
                    .attr("opacity", ".30")
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
            })
            .on('mouseout', function (d, i) {
                d3.selectAll(".line-path").transition()
                    .duration('50')
                    .attr("opacity", "1")
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
            });
    }

    g.append("text")
        .attr("class", "title")
        .attr("y", -60)
        .text(title)

    var legend = g.append('g')
        .attr('class', 'legend')
        .attr('transform', 'translate(' + (margin.left + 12) + ', -40)');
    var subgroups = data.columns.slice(1)
    console.log(subgroups);
    var legendSpacing = 110;
    var legendOffset = 0;
    legend.selectAll('rect')
        .data(subgroups)
        .enter()
        .append('rect')
        .attr('x', (d, i) => (i * legendSpacing) + (legendOffset - 20) - 120)
        .attr('y', 0)
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', (d, i) => {console.log(colors[i]); return colors[i];});

    legend.selectAll('text')
        .data(subgroups)
        .enter()
        .append('text')
        .text(d => d)
        .attr('x', (d, i) => (i * legendSpacing) + legendOffset -120)
        .attr('y', -1)
        .attr('alignment-baseline', 'hanging');

};

d3.csv("statistic.csv")
    .then(data => {
        console.log(data);
        data.forEach(d => {
            d.Year = +d.Year;
            d.China = +d.China;
            d.Brazil = +d.Brazil;
            d.France = +d.France;
            d.Germany = +d.Germany;
            d.India = +d.India;
            d.Japan = +d.Japan;
            d.Russia = +d.Russia;
            d.United_Kingdom = +d.United_Kingdom;
            d.United_States = +d.United_States;
        })
        render(data);
    })
